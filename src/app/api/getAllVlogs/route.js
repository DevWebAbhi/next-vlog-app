import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { executeQuery } from "@/dbconfig/db";
import { cookies } from 'next/headers';
export const dynamic = "force-dynamic";
export async function GET(req) {
    const cookieStore = cookies();
    const token = cookieStore.get('nextvlogauthtoken'); 
    if (!token && token.value) {
        return NextResponse.json({ message: "NV" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    console.log(page)
    try {
        // Verify JWT token
        const decoded = jwt.verify(token.value, process.env.JWT_CODE);
        console.log("Decoded Token:", decoded);

        // Extract email from decoded token
        const { email } = decoded;

        // Execute stored procedure to get user vlogs
        let allvlogs = await executeQuery({
            query: `CALL nextvlog.GetUserVlogsByEmailAndToken(?, ?, ?)`,
            values: [email, token.value, page || 1],
        });
        allvlogs.splice(-1);
        if (allvlogs && allvlogs[0] && allvlogs[0][0] && allvlogs[0][0].Message) { 
            const message = allvlogs[0][0].Message;
            if (message === "NOV") {
                return NextResponse.json({ message: "NOV" }, { status: 200 });
            } else if (message === "SEXT") {
                return NextResponse.json({ message: "SEXT" }, { status: 500 });
            }else if(message === "NV") {
                return NextResponse.json({ message: "NV" }, { status: 401 });
            }
        } 
        allvlogs = allvlogs[0];

        return NextResponse.json({ message: "SFL", allvlogs }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: "ISE" }, { status: 500 });
    }
}
