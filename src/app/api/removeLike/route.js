import { executeQuery } from "@/dbconfig/db";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

const JWT_CODE = process.env.JWT_CODE;


export const DELETE = async(req)=>{
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('nextvlogauthtoken');
        if (!token && token.value) {
            return NextResponse.json({ message: "NV" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const VlogID = searchParams.get('VlogID');
        const ParentID = searchParams.get('ParentID');
        
    
    
        if (!VlogID || !ParentID) {
          return NextResponse.json({ message: 'IP' }, { status: 400 });
        }
        let email;
    try {
      const decoded = jwt.verify(token.value, JWT_CODE);
      email = decoded.email;
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      return NextResponse.json({ message: 'TE' }, { status: 500 });
    }
        const deleteLike =await executeQuery({
            query:'CALL nextvlog.RemoveLike(?,?,?,?)',
            values:[VlogID,ParentID,email,token.value]
        });
        if(deleteLike && deleteLike[0] && deleteLike[0][0]){
            const message  = deleteLike[0][0].Message;
            if(message == 'SEXT'){
                return NextResponse.json({ message: 'ISE' }, { status: 500 });
            }else if(message == 'NV'){
                return NextResponse.json({ message: 'NV' }, { status: 401 });
            }else if(message == 'NLF'){
                return NextResponse.json({ message: 'NLF' }, { status: 401 });
            }
          return NextResponse.json({ message: 'SFL' }, { status: 200 });
        }
            return NextResponse.json({ message: 'ISE' }, { status: 500 }); 
    } catch (error) {
        return NextResponse.json({message:"ISE"},{status:500});
    }
}