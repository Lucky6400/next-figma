import { connect } from "@/dbConfig/db";
import Room from "@/models/Room";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
       const rooms = await Room.find();

        return NextResponse.json({
            message: "Success",
            success: true,
            rooms: rooms
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}