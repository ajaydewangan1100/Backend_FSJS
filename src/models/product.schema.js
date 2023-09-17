import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ["true", "Please provide a product name"],
        trim: true,
        maxLength: [120, "Product name should not be max than 120 chars"]
    },
    price: {
        type: Number,
        required: ["true", "Please provide a product price"],
        trim: true,
        maxLength: [5, "Product price should be less than 100000"]
    },
    description: {
        type: string
    },
    photos: [
        {
            secure_url: {
                type: String,
                required: true
            }
        }
    ],
    stock: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    collectioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
