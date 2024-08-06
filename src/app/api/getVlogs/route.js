import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { executeQuery } from "@/dbconfig/db";
export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {


        let allvlogs;
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page');
       

               
            
      
            allvlogs = await executeQuery({
                query: `CALL nextvlog.AllVlogs(?,?,?)`,
                values: [null, null, page || 1],
            });
            if(allvlogs && allvlogs[0] && allvlogs[0].length==0){
                return NextResponse.json({ message: 'NOV' }, { status: 404 });
              }

        allvlogs.splice(-1);

        if (allvlogs && allvlogs[0] && allvlogs[0][0] && allvlogs[0][0].Message) {
            const message = allvlogs[0][0].Message;
            if (message === "NOV") {
                return NextResponse.json({ message: "NOV" }, { status: 200 });
            } else if (message === "SEXT") {
                return NextResponse.json({ message: "ISE" }, { status: 500 });
            }
        }

        allvlogs = allvlogs[0];

        return NextResponse.json({ message: "SFL", allvlogs }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: "ISE" }, { status: 500 });
    }
}
