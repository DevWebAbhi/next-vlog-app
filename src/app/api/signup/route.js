// src/app/api/signup/route.js
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/dbconfig/db';
import { userSignupSchema } from '@/zodValidations/zodValidations';
export const dynamic = 'force-dynamic';
export async function POST(req = NextRequest) {
  try {
    const body = await req.json();
    const { userName, email, password } = body;

    try {
      userSignupSchema.parse({ email, password, userName });
    } catch (validationError) {
      console.error("Validation Error:", validationError);
      return NextResponse.json({ message: 'VAE' }, { status: 400 });
    }
    
     const signup = await executeQuery({
        query: 'CALL nextvlog.SignupUser(?, ?, ?)',
        values: [userName, email, password],
      });
    
    if(signup && signup[0] && signup[0][0] && signup[0][0].Message == "AR"){
      return NextResponse.json({ message: "AR" }, { status: 401 });
    }else if(signup && signup[0] && signup[0][0] && signup[0][0].Message == "SEXT"){
      return NextResponse.json({ message: "ISE" }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'SFL'}, { status: 200 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'ISE' }, { status: 500 });
  }
}
