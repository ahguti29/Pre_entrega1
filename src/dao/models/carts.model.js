import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    quantity: {
        type: Number,
        default: 1,
        require: true
    }
}
,{_id: false}
)
const cartSchema = new mongoose.Schema({
    products: {
        type: [productSchema],
        default: []
    }
});

cartSchema.pre('findOne', function () {
    this.populate('products.product')
}) 

mongoose.set("strictQuery", false)
const cartsModel = mongoose.model('carts', cartSchema)

export default cartsModel;