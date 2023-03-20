import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
	id: Number,
	title: String,
	description: String,
	code: Number,
	price: Number,
	thumbnail: String,
	category: {
		type: String,
		modelC: ['Gorras', 'Polos', 'Busos']
	},
	status: Boolean,
	stock: Number,
});

const productsModel = mongoose.model('products', productSchema);
export default productsModel;
