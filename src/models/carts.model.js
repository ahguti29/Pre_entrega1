import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            id: {
                type: moongose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: Number
        }],
        default: []
    }
});

moongose.set("strictQuery", false)
const cartsModel = mongoose.model('carts', cartSchema)

export default cartsModel;