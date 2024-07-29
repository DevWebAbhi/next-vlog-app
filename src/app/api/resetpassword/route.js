import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/dbconfig/db";
import jwt from "jsonwebtoken";
import { userLoginSchema } from "@/zodValidations/zodValidations";
export const dynamic = 'force-dynamic';
const JWT_CODE = process.env.JWT_CODE;

export async function POST(req = NextRequest) {
  try {
    const body = await req.json();
    const { token, email, newPassword } = body;
    try {
      const decoded = jwt.verify(token, JWT_CODE);
    } catch (jwtError) {
      console.error("JWT Verification Error:", jwtError);
      return NextResponse.json({ message: "NV" }, { status: 401 });
    }
    try {
      userLoginSchema.parse({
        email: email,
        password: newPassword,
      });
    } catch (validationError) {
      console.error("Validation Error:", validationError);
      return NextResponse.json({ message: "VAE" }, { status: 401 });
    }

    const resetPassword = await executeQuery({
      query: "CALL nextvlog.ResetPasswordUser(?, ?, ?)",
      values: [email, token, newPassword],
    });

    if (resetPassword == "SEXT") {
      return NextResponse.json({ message: "ISE" }, { status: 500 });
    } else if (resetPassword == "NV") {
      return NextResponse.json({ message: "NV" }, { status: 401 });
    }
    return NextResponse.json({ message: "SFL" }, { status: 200 });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ message: "ISE" }, { status: 500 });
  }
}
