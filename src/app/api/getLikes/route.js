import { NextResponse } from 'next/server';
import { executeQuery } from '@/dbconfig/db';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const VlogID = searchParams.get('VlogID');
    const ParentID = searchParams.get('ParentID');
    const band = searchParams.get('band');


    if (!VlogID || !ParentID || !band) {
      return NextResponse.json({ message: 'IIP' }, { status: 400 });
    }

    let like = await executeQuery({
      query: `CALL nextvlog.GetLikes( ?,?,? )`,
      values: [VlogID, ParentID, band],
    });
    if(like && like[0] && like[0].length==0){
      return NextResponse.json({ message: 'NLF' }, { status: 404 });
    }
    like.splice(-1);
    if (like && like[0] && like[0][0]) {
      const message = like[0][0].Message;
     
      if (message == 'SEXT') {
        return NextResponse.json({ message: 'ISE' }, { status: 500 });
      }
        
      
      like = like[0];
      return NextResponse.json({ message: 'SFL', like }, { status: 200 });
    }
    return NextResponse.json({ message: 'ISE' }, { status: 500 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'ISE' }, { status: 500 });
  }
}
