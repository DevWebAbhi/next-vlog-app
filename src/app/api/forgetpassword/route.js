import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/dbconfig/db";
import { forgetPasswordSchema } from "@/zodValidations/zodValidations";
import mailer from "@/nodemailer/nodemailer";
import jwt from "jsonwebtoken";
export const dynamic = 'force-dynamic';
const JWT_CODE = process.env.JWT_CODE;
export async function POST(req = NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    try {
      forgetPasswordSchema.parse({ email });
    } catch (validationError) {
      console.error("Validation Error:", validationError);
      return NextResponse.json({ message: "VAE" }, { status: 400 });
    }

    const user = await executeQuery({
      query: "CALL ForgetPasswordUser(?)",
      values: [email],
    });
    if (user && user[0] && user[0][0]) {
      const userMessage = user[0][0].Message;
      if(userMessage == 'SEXT'){
      return NextResponse.json({ message: "ISE" }, { status: 500 });
    } else if (userMessage == "NV") {
      return NextResponse.json({ message: "NV" }, { status: 401 });
    }
    const { Email, Username, UserID, IsVerified } = user[0][0];


    let authToken;
    try {
      authToken = jwt.sign(
        { UserID },
        JWT_CODE,
        { algorithm: "HS256" },
        { expiresIn: "1h" }
      );
    } catch (jwtError) {
      console.error("JWT Token Error:", jwtError);
      return NextResponse.json({ message: "TE" }, { status: 500 });
    }
    const updateToken = await executeQuery({
      query: `CALL nextvlog.UpdateToken(?, ?)`,
      values: [email, authToken],
    });

    if (updateToken && updateToken[0] && updateToken[0][0]) {
      const updateTokenMessage = updateToken[0][0].Message;

      if (updateTokenMessage === "SEXT") {
        return NextResponse.json({ message: "ISE" }, { status: 500 });
      } else if (updateTokenMessage === "NV") {
        return NextResponse.json({ message: "NV" }, { status: 401 });
      }
    }
    console.log(user)
    await mailer(email, authToken);
    return NextResponse.json({ message: "SFL" }, { status: 200 });
  }else{
    return NextResponse.json({ message: "ISE" }, { status: 500 });
  }

    
  } catch (error) {
    console.error("user error:", error);
    return NextResponse.json({ message: "ISE" }, { status: 500 });
  }
}
