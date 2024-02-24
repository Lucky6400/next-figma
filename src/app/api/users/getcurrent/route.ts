import { connect } from "@/dbConfig/db";
import { getDataFromToken } from "@/helper/tokenVerify";
import User from "@/models/User";
import { UserInfo } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function GET(request: NextRequest) {
    try {

        // Extract user ID from the authentication token
        const userId = await getDataFromToken(request) as UserInfo;
        console.log(userId)
        // Find the user in the database based on the user ID
        const user = await User.findOne({ _id: userId.id }).
            select("-password");

        console.log(user._doc);
        return NextResponse.json({
            message: "User found",
            success: true,
            data: user._doc
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })

    }
}