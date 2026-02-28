import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        previewImage: {
            type: String,
            default: "",
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Template = mongoose.model("Template", templateSchema);
export default Template;
