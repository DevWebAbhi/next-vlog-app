import { NextResponse } from 'next/server';
import { bucket } from '../../../firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from '@/dbconfig/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';
const JWT_CODE = process.env.JWT_CODE;

export const POST = async (req) => {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const { VlogID, ParentID } = body;
    console.log(VlogID, ParentID);

    const cookieStore = cookies();
    const token = cookieStore.get('nextvlogauthtoken'); 
    if (!token && token.value) {
        return NextResponse.json({ message: "NV" }, { status: 401 });
    }
    let email;
    try {
      const decoded = jwt.verify(token.value, JWT_CODE);
      email = decoded.email;
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      return NextResponse.json({ message: 'TE' }, { status: 500 });
    }

    let like = await executeQuery({
      query: `CALL nextvlog.AddLikeVlog( ?,?,?,? )`,
      values: [VlogID, ParentID, email, token.value]
    });

    like.splice(-1);
    if (like && like[0] && like[0][0]) {
      const message = like[0][0].Message;
      if (message === 'SEXT') {
        return NextResponse.json({ message: 'ISE' }, { status: 500 });
      } else if (message === 'NV') {
        return NextResponse.json({ message: 'NV' }, { status: 401 });
      } else if (message === 'LAE') {
        return NextResponse.json({ message: 'TE' }, { status: 500 });
      }
      like = like[0];
      return NextResponse.json({ message: 'SFL', like }, { status: 200 });
    }
    return NextResponse.json({ message: 'ISE' }, { status: 500 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'ISE' }, { status: 500 });
  }
};
