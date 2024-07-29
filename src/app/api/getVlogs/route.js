import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { executeQuery } from "@/dbconfig/db";
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('nextvlogauthtoken'); 
        
        console.log("Token from cookies:", token);

        let allvlogs;
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page');
        if (token && token.value) {
            try {
                const decoded = jwt.verify(token.value, process.env.JWT_CODE);
                console.log("Decoded Token:", decoded);

                const { email } = decoded;
                allvlogs = await executeQuery({
                    query: `CALL nextvlog.AllVlogs(?,?,?)`,
                    values: [email, token.value, page || 1],
                });
            } catch (jwtError) {
                console.error("JWT Token Error:", jwtError);
                return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
            }
        } else {
            allvlogs = await executeQuery({
                query: `CALL nextvlog.AllVlogs(?,?,?)`,
                values: [null, null, page || 1],
            });
        }

        allvlogs.splice(-1);

        if (allvlogs && allvlogs[0] && allvlogs[0][0] && allvlogs[0][0].Message) {
            const message = allvlogs[0][0].Message;
            if (message === "NVF") {
                return NextResponse.json({ message: "NVF" }, { status: 200 });
            } else if (message === "SEXT") {
                return NextResponse.json({ message: "SEXT" }, { status: 500 });
            }
        }

        allvlogs = allvlogs[0];

        return NextResponse.json({ message: "SFL", allvlogs }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: "ISE" }, { status: 500 });
    }
}
