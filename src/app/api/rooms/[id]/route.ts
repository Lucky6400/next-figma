import { connect } from "@/dbConfig/db";
import Room from "@/models/Room";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextApiRequest) {
    try {
        const { id } = request.query;

        const room = await Room.findById(id);

        if (!room) {
            return NextResponse.json({
                message: "Room not found",
                success: false
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Success",
            success: true,
            room: room
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
