import { executeQuery } from "@/dbconfig/db";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'; 
import { userLoginSchema } from "@/zodValidations/zodValidations";
export const dynamic = 'force-dynamic';
const JWT_CODE = process.env.JWT_CODE;

export async function POST(req) {
    try {
        const { email, password, token } = await req.json();
        console.log(token);
        try {
            await userLoginSchema.parse({email,password});
        } catch (error) {
            return NextResponse.json({ message: 'VE' }, { status: 401 });
        }
        try {
            const decoded = jwt.verify(token, JWT_CODE);
        } catch (jwtError) {
            console.error('JWT Verification Error:', jwtError);
            return NextResponse.json({ message: 'TE' }, { status: 401 });
        }

        const verify = await executeQuery({
            query: `CALL nextvlog.Verification(?, ?, ?)`,
            values: [email, password, token]
        });

        console.log(verify);
        if (verify && verify[0] && verify[0][0]) {
            const verifyMessage = verify[0][0].Message;

            if (verifyMessage === "NV") {
                return NextResponse.json({ message: "NV" }, { status: 401 });
            } else if (verifyMessage === "SEXT") {
                return NextResponse.json({ message: "SEXT" }, { status: 500 });
            }

            const { Email, Username, UserID, IsVerified } = verify[0][0];

            if (Email && Username) {
                try {
                    const authToken = jwt.sign({ email, userName: Username , UserID }, JWT_CODE, { algorithm: 'HS256', expiresIn: '24h' });

                    const updateToken = await executeQuery({
                        query: `CALL nextvlog.UpdateToken(?, ?)`,
                        values: [email, authToken]
                    });

                    if (updateToken && updateToken[0] && updateToken[0][0]) {
                        const updateTokenMessage = updateToken[0][0].Message;

                        if (updateTokenMessage === 'SEXT') {
                            return NextResponse.json({ message: 'ISE' }, { status: 500 });
                        } else if (updateTokenMessage === 'NV') {
                            return NextResponse.json({ message: 'NV' }, { status: 401 });
                        }
                    } else {
                        return NextResponse.json({ message: 'ISE' }, { status: 500 });
                    }

                    const response = NextResponse.json({ message: 'SFL', userName: Username, token: authToken ,UserID }, { status: 200 });
                    response.cookies.set('nextvlogauthtoken', authToken, { httpOnly: true, secure: true });
                    const userDetails = JSON.stringify({ Email, Username, UserID });
                    response.cookies.set("nextvlogauthuserdetails", userDetails, {
                        httpOnly: true,
                        secure: true,
                    });
                    return response;
                } catch (error) {
                    return NextResponse.json({ message: 'ISE' }, { status: 500 });
                }
            } else {
                return NextResponse.json({ message: 'ISE' }, { status: 500 });
            }
        } else {
            return NextResponse.json({ message: 'ISE' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'ISE' }, { status: 500 });
    }
}
