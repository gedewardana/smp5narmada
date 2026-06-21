import { NextResponse } from "next/server";
import { getUserDashboardData } from "@/services/user/dashboard/DasboardServices";

// GET /api/user/dashboard?id_pengguna=1
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id_pengguna = searchParams.get("id_pengguna");

        if (!id_pengguna) {
            return NextResponse.json(
                { success: false, message: "id_pengguna diperlukan" },
                { status: 400 }
            );
        }

        const data = await getUserDashboardData(Number(id_pengguna));

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
