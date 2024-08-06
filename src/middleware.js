// src/middleware.js
import { NextResponse } from 'next/server';

const rateLimitStore = new Map();

const rateLimiter = (ip, token) => {
  const currentTime = Date.now();
  const windowMs = 15 * 60 * 1000; 
  const maxRequests = 70; 

  const ipKey = `ip:${ip}`;
  const tokenKey = `token:${token}`;
  
  const checkAndUpdate = (key) => {
    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, []);
    }

    const requests = rateLimitStore.get(key);
    const filteredRequests = requests.filter(timestamp => currentTime - timestamp < windowMs);
    
    if (filteredRequests.length >= maxRequests) {
      return false;
    }

    filteredRequests.push(currentTime);
    rateLimitStore.set(key, filteredRequests);
    return true;
  };

  return checkAndUpdate(ipKey) && checkAndUpdate(tokenKey);
};

const sanitizeInput = (input) => {
  const sqlKeywords = /select|insert|update|delete|drop|union|--|;/i;
  return sqlKeywords.test(input);
};

export function middleware(req) {
  const ip = req.headers.get('x-forwarded-for') || req.ip;
  const token = req.headers.get('authorization');
  const url = req.nextUrl.pathname;

  if (!rateLimiter(ip, token)) {
    return NextResponse.json({ message: 'TMR' }, { status: 429 });
  }

  const body = req.body ? JSON.stringify(req.body) : '';
  const query = req.nextUrl.searchParams.toString();

  if (sanitizeInput(body) || sanitizeInput(query) || sanitizeInput(url)) {
    return NextResponse.json({ message: 'Potential SQL injection detected' }, { status: 400 });
  }

  // Restrict access to /api/createVlog to 10 requests per 15 minutes per user
  if (url === '/api/createVlog') {
    const vlogKey = `vlog:${token}`;
    const currentTime = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxVlogRequests = 10;

    if (!rateLimitStore.has(vlogKey)) {
      rateLimitStore.set(vlogKey, []);
    }

    const vlogRequests = rateLimitStore.get(vlogKey);
    const filteredVlogRequests = vlogRequests.filter(timestamp => currentTime - timestamp < windowMs);

    if (filteredVlogRequests.length >= maxVlogRequests) {
      return NextResponse.json({ message: 'Access limit exceeded for createVlog' }, { status: 429 });
    }

    filteredVlogRequests.push(currentTime);
    rateLimitStore.set(vlogKey, filteredVlogRequests);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
