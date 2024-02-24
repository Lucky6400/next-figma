import { connect } from "@/dbConfig/db";
import Room from "@/models/Room";
import axios from "axios";
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


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        console.log(id);

        const res = await axios.delete(`https://api.liveblocks.io/v2/rooms/${id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY}`
            }
        });
        const data = await res.data;
        console.log(data);
        return NextResponse.json({
            message: "Success",
            success: true
        }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}