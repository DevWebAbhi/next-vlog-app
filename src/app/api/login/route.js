import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/dbconfig/db";
import { userLoginSchema } from "@/zodValidations/zodValidations";
import jwt from "jsonwebtoken";
import mailer from "@/nodemailer/nodemailer";
export const dynamic = 'force-dynamic';
const JWT_CODE = process.env.JWT_CODE;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    try {
      userLoginSchema.parse({ email, password });
    } catch (validationError) {
      console.error("Validation Error:", validationError.errors);
      return NextResponse.json({ message: "VAE" }, { status: 401 });
    }

    const login = await executeQuery({
      query: `CALL nextvlog.LoginUser(?, ?)`,
      values: [email, password],
    });
    console.log(login);
    if (login && login[0] && login[0][0]) {
      const loginMessage = login[0][0].Message;

      if (loginMessage === "NV") {
        return NextResponse.json({ message: "NV" }, { status: 401 });
      } else if (loginMessage === "SEXT") {
        return NextResponse.json({ message: "SEXT" }, { status: 500 });
      }

      const { Email, Username, UserID, IsVerified } = login[0][0];
      console.log(login[0][0]);
      if (Email && Username) {
        try {
          const authToken = await jwt.sign(
            { email: Email, userName: Username, UserID },
            JWT_CODE,
            { algorithm: "HS256" }
          );

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
          } else {
            return NextResponse.json({ message: "ISE" }, { status: 500 });
          }

          if (!IsVerified) {
            await mailer(email, authToken, "verification");
            return NextResponse.json({ message: "VE" }, { status: 401 });
          }

          // Create response
          const response = NextResponse.json(
            { message: "SFL", userName: Username, token: authToken, UserID },
            { status: 200 }
          );

          // Set cookies with unique values
          response.cookies.set("nextvlogauthtoken", authToken, {
            httpOnly: true,
            secure: true,
          });

          // Serialize user details object to a JSON string
          const userDetails = JSON.stringify({ Email, Username, UserID });
          response.cookies.set("nextvlogauthuserdetails", userDetails, {
            httpOnly: true,
            secure: true,
          });

          return response;
        } catch (jwtError) {
          console.error("JWT Token Error:", jwtError);
          return NextResponse.json({ message: "TE" }, { status: 500 });
        }
      } else {
        return NextResponse.json({ message: "ISE" }, { status: 500 });
      }
    } else {
      return NextResponse.json({ message: "ISE" }, { status: 500 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "ISE" }, { status: 500 });
  }
}
