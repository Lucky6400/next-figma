import { connect } from "@/dbConfig/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
       const users = await User.find();

        return NextResponse.json({
            message: "Success",
            success: true,
            users: users
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}