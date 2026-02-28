import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    data: {
        type: Object,
        default: ""
    }
})

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;