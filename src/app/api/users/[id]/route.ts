import User from "@/models/User";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        console.log(id);

        const deletedUser = await User.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Success",
            success: true,
            user: deletedUser
        }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await request.json();

        console.log(id);

        await User.findByIdAndUpdate(id, body);

        return NextResponse.json({
            message: "Success",
            success: true
        }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;

        console.log(id);

        const user = await User.findById(id);

        return NextResponse.json({
            message: "Success",
            success: true,
            user
        }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}