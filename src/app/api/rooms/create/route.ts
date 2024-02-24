import { connect } from "@/dbConfig/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { roomid } = reqBody;

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.liveblocks.io/v2/rooms',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY}`
            },
            data: {
                "id": roomid,
                "defaultAccesses": [
                    "room:write"
                ],
                "metadata": {
                    "color": "blue"
                },
                "usersAccesses": {
                    "alice": [
                        "room:write"
                    ]
                },
                "groupsAccesses": {
                    "product": [
                        "room:write"
                    ]
                }
            }
        };

        const res = await axios.request(config);
        const data = await res.data;

        return NextResponse.json({
            message: "Success",
            success: true,
            createdRoom: data
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}