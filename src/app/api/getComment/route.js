import { NextResponse } from 'next/server';
import { executeQuery } from '@/dbconfig/db';
export const dynamic = 'force-dynamic';
export const GET = async (req, res) => {
  try {
    const { searchParams } = new URL(req.url);
    const VlogID = searchParams.get('VlogID');
    const ParentID = searchParams.get('ParentID');
    const band = searchParams.get('band');


    if (!VlogID || !ParentID || !band) {
      return NextResponse.json({ message: 'IP' }, { status: 400 });
    }

   
    let comment = await executeQuery({
        query:`CALL nextvlog.GetComment( ?,?,? )`,
        values:[VlogID,ParentID,band]
    })
    if(comment && comment[0] && comment[0].length==0){
      return NextResponse.json({ message: 'NCF' }, { status: 404 });
    }
    comment.splice(-1);
    if(comment && comment[0] && comment[0][0]){
        const message  = comment[0][0].Message;
        if(message == 'SEXT'){
            return NextResponse.json({ message: 'ISE' }, { status: 500 });
        }
        comment = comment[0];
      return NextResponse.json({ message: 'SFL', comment }, { status: 200 });
    }
        return NextResponse.json({ message: 'ISE' }, { status: 500 }); 
    
} catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'ISE' }, { status: 500 });
  }
};
