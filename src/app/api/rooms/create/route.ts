import { connect } from "@/dbConfig/db";
import Room from "@/models/Room";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { userId, roomname, desc } = reqBody;

        const room = new Room({
            userId, desc, roomname
        });

        const savedRoom = await room.save();

        return NextResponse.json({
            message: "Success",
            success: true,
            room: savedRoom
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}