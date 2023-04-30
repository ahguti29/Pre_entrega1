import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
	id: String,
	title: String,
	description: String,
	code: Number,
	price: Number,
	thumbnail: {
		type: Array,
		default: []
	},
	category: {
		type: String,
		modelC: ['Gorras', 'Polos', 'Busos']
	},
	status: Boolean,
	stock: Number,
});
mongoose.set("strictQuery", false);
productSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model('products', productSchema);
export default productsModel;
