import { executeQuery } from "@/dbconfig/db";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
export const dynamic = 'force-dynamic';
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
        const CommentID = searchParams.get('CommentID');
        console.log(VlogID,ParentID,CommentID);
    
    
        if (!VlogID || !ParentID || !CommentID) {
          return NextResponse.json({ message: 'IP' }, { status: 404 });
        }
        let email;
    try {
      const decoded = jwt.verify(token.value, JWT_CODE);
      email = decoded.email;
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      return NextResponse.json({ message: 'TE' }, { status: 500 });
    }
        const deleteComment =await executeQuery({
            query:'CALL nextvlog.RemoveComment(?,?,?,?,?)',
            values:[VlogID,ParentID,CommentID,email,token.value]
        });
        console.log(deleteComment)
        if(deleteComment && deleteComment[0] && deleteComment[0][0]){
            const message  = deleteComment[0][0].Message;
            if(message == 'SEXT'){
                return NextResponse.json({ message: 'ISE' }, { status: 500 });
            }else if(message == 'NV'){
                return NextResponse.json({ message: 'NV' }, { status: 401 });
            }else if(message == 'NCF'){
                return NextResponse.json({ message: 'NCF' }, { status: 401 });
            }else if(message == 'NVF'){
                return NextResponse.json({ message: 'NVF' }, { status: 401 });
            }
          return NextResponse.json({ message: 'SFL' }, { status: 200 });
        }
            return NextResponse.json({ message: 'ISE' }, { status: 500 }); 
    } catch (error) {
        return NextResponse.json({message:"ISE"},{status:500});
    }
}