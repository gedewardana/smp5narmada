import { getUserSummary } from "@/services/users/userServices";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const summary = await getUserSummary();
        return NextResponse.json(summary);
    } catch (error) {
        console.error("GET USER SUMMARY ERROR:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
