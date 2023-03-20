import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    id: Number,
    products: [],
});

const cartsModel = mongoose.model('carts', cartSchema)

export default cartsModel;