import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { saveIdentifikasi } from "@/lib/identifikasi/action";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const response = await saveIdentifikasi(null, formData);

        if (response.Error) {
            return NextResponse.json(response, { status: 400 });
        }

        return NextResponse.json(
            { success: true, data: response },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing POST request:", error);
        return NextResponse.json({ status: 500 });
    }
}
