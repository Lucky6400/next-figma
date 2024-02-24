import { connect } from "@/dbConfig/db";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

connect();

export async function GET(request: NextRequest) {
    try {
        
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://api.liveblocks.io/v2/rooms',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY}`
            }
        };

        const res = await axios.request(config);
        const data = await res.data;

        return NextResponse.json({
            message: "Success",
            success: true,
            rooms: data
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}