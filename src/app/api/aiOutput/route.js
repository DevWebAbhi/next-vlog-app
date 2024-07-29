import { generateOutput } from "@/geminiAI";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function GET(req){
    try {
        const { searchParams } = new URL(req.url);
        const prompt = (searchParams && searchParams.get('prompt').replace('_', ' ')) || "";
        
        const response = await generateOutput(prompt);
        return NextResponse.json({ message: "SFL",output:response }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: "ISE" }, { status: 500 });
    }
}