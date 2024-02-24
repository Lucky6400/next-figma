import { connect } from "@/dbConfig/db";
import { getDataFromToken } from "@/helper/tokenVerify";
import User from "@/models/User";
import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";

const liveblocks = new Liveblocks({
    secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!,
});

connect();

export async function POST(request: NextRequest) {
    // Get the current user from your database
    try {
        console.log(request.cookies.get("token"))
        const user = await getDataFromToken(request);

        const userData = await User.findById(user.id);
        // Identify the user and return the result
        const { status, body } = await liveblocks.identifyUser(
            {
                userId: user.id as string,
                groupIds: []
            },
            { userInfo: { ...user, userData } },
        );

        return new Response(body, { status });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}