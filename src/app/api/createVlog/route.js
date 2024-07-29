import { NextResponse } from 'next/server';
import { bucket } from '../../../firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from '@/dbconfig/db';
import jwt from 'jsonwebtoken';
import { vlogSchema } from '@/zodValidations/zodValidations';
import { cookies } from 'next/headers';
export const dynamic = "force-dynamic";
const JWT_CODE = process.env.JWT_CODE;

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const media = formData.get("media");

    const cookieStore = cookies();
    const token = cookieStore.get('nextvlogauthtoken'); 
    if (!token) {
      return NextResponse.json({ message: "NV" }, { status: 401 });
    }

    let email;
    try {
      const decoded = jwt.verify(token.value, JWT_CODE);
      email = decoded.email;
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      return NextResponse.json({ message: 'TE' }, { status: 500 });
    }

    console.log('Received fields:', { email, title, description });
    console.log('Received file:', media);

    try {
      vlogSchema.parse({ title, description });
    } catch (error) {
      return NextResponse.json({ message: 'VAE' }, { status: 400 });
    }

    let mediaURL = null;

    if (media) {
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/bmp', 'image/webp', 'image/jfif', 
        'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg', 
        'video/mov', 'video/avi', 'video/mpeg'
      ];
      const maxSizeInBytes = 6 * 1024 * 1024;

      if (!allowedTypes.includes(media.type)) {
        return NextResponse.json({ message: 'IFF' }, { status: 400 });
      }

      if (media.size > maxSizeInBytes) {
        return NextResponse.json({ message: 'M6MB' }, { status: 400 });
      }

      try {
        const mediaName = `${uuidv4()}-${Date.now()}-${media.name}`;
        const file = bucket.file(mediaName);

        const stream = file.createWriteStream({
          metadata: { contentType: media.type },
        });

        const streamFinished = new Promise((resolve, reject) => {
          stream.on('error', (err) => {
            console.error('Stream Error:', err);
            reject(new Error('Stream Error'));
          });

          stream.on('finish', async () => {
            console.log('Stream finished');
            await file.makePublic();
            mediaURL = `https://storage.googleapis.com/${bucket.name}/${mediaName}`;
            resolve();
          });
        });

        const buffer = await media.arrayBuffer();
        stream.end(Buffer.from(buffer));

        await streamFinished;
      } catch (uploadError) {
        console.error('Media Upload Error:', uploadError);
        return NextResponse.json({ message: 'Media Upload Error' }, { status: 500 });
      }
    }

    try {
      const allvlogs = await executeQuery({
        query: 'CALL nextvlog.AddVlog(?, ?, ?, ?, ?)',
        values: [email, token.value, title, description, mediaURL],
      });

      if (allvlogs && allvlogs[0] && allvlogs[0][0]) {
        const message = allvlogs[0][0].Message;
        if (message === 'NV') {
          return NextResponse.json({ message: 'NV' }, { status: 200 });
        } else if (message === 'SEXT') {
          return NextResponse.json({ message: 'SEXT' }, { status: 500 });
        }
      }

      return NextResponse.json({ message: 'SFL' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
