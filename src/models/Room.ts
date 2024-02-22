import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Please provide userId"]
    },
    roomname: {
        type: String,
        required: [true, "Please provide roomname"]
    },
    desc: {
        type: String
    }
}, { timestamps: true })

const Room = mongoose.models.rooms || mongoose.model("rooms", roomSchema);

export default Room;