import { executeQuery } from "@/dbconfig/db";
import { NextResponse } from "next/server";
import { bucket } from '../../../firebaseAdmin';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

const JWT_CODE = process.env.JWT_CODE;

export const DELETE = async(req) => {
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

        let email;
        try {
            const decoded = jwt.verify(token.value, JWT_CODE);
            email = decoded.email;
        } catch (jwtError) {
            console.error('JWT Verification Error:', jwtError);
            return NextResponse.json({ message: 'TE' }, { status: 500 });
        }

        const removeVlog = await executeQuery({
            query: 'CALL nextvlog.RemoveVlog(?,?,?)',
            values: [VlogID, email, token.value]
        });
        console.log(removeVlog,"Response from RemoveVlog procedure");
        if (removeVlog && removeVlog[0] && removeVlog[0][0]) {
            const message = removeVlog[0][0].Message;
            if (message === 'SEXT') {
                return NextResponse.json({ message: 'ISE' }, { status: 500 });
            } else if (message === 'NV') {
                return NextResponse.json({ message: 'NV' }, { status: 401 });
            } else if (message === 'NVF') {
                return NextResponse.json({ message: 'NVF' }, { status: 401 });
            } else if (message && message.startsWith('http')) {
                const mediaURL = message;
                const fileName = mediaURL.split('/').pop();
                console.log(`Media URL: ${mediaURL}`);
                console.log(`File name extracted: ${fileName}`);

                try {
                    await bucket.file(fileName).delete();
                    console.log(`Successfully deleted media file: ${fileName}`);
                } catch (deleteError) {
                    console.error('Error deleting media file from Firebase:', deleteError);
                    return NextResponse.json({ message: 'ISE' }, { status: 500 });
                }

                return NextResponse.json({ message: 'SFL' }, { status: 200 });
            }else if(message == 'NM'){
                return NextResponse.json({ message: 'SFL' }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'ISE' }, { status: 500 });
            }
        } else {
            return NextResponse.json({ message: 'ISE' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in DELETE handler:', error);
        return NextResponse.json({ message: "ISE" }, { status: 500 });
    }
};
