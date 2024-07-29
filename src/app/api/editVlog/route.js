import { executeQuery } from "@/dbconfig/db";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { vlogSchema } from "@/zodValidations/zodValidations";
import { cookies } from "next/headers";
export const dynamic = 'force-dynamic';
const JWT_CODE = process.env.JWT_CODE;


export const PUT = async(req)=>{
    try {
      const cookieStore = cookies();
      const token = cookieStore.get('nextvlogauthtoken'); 
        if (!token && token.value) {
            return NextResponse.json({ message: "NV" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const VlogID = searchParams.get('VlogID');  
        
        if (!VlogID) {
          return NextResponse.json({ message: 'IP' }, { status: 400 });
        }
        const {title,description} = await req.json().catch(() => null);;
        try {
            vlogSchema.parse({title,description})
          } catch (error) {
            return NextResponse.json({message:'VAE'},{status:401});
          }
        let email;
    try {
      const decoded = jwt.verify(token.value, JWT_CODE);
      email = decoded.email;
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      return NextResponse.json({ message: 'TE' }, { status: 500 });
    }

    
        const editVlog =await executeQuery({
            query:'CALL nextvlog.EditVlog(?,?,?,?,?)',
            values:[VlogID,email,token.value,title,description]
        });
        if(editVlog && editVlog[0] && editVlog[0][0]){
            const message  = editVlog[0][0].Message;
            if(message == 'SEXT'){
                return NextResponse.json({ message: 'ISE' }, { status: 500 });
            }else if(message == 'NV'){
                return NextResponse.json({ message: 'NV' }, { status: 401 });
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