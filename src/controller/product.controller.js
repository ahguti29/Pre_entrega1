import productsModel from '../dao/models/products.model.js';
import logger from '../logger.js';
import CustomError from '../services/errors/custom_error.js';
import EErros from '../services/errors/enums.js';
import { generateErrorInfo } from '../services/errors/info.js';
import ProductManager from '../services/productManager.js';
const products = new ProductManager();

export const getProducts = async (req, res) => {
	const myProducts = await productsModel.find().lean().exec();

	res.render('realTimeProducts', { docs: myProducts });
};

export const getProductsController = async (req, res) => {
	const limit = req.query?.limit || 10;
	const page = req.query?.page || 1;
	const filter = req.query?.filter || '';
	const order = req.query?.sort || '';
	const sortOrder = req.query?.sortOrder || 'desc';

	const search = {};
	if (filter) {
		search.title = filter;
	}
	const sort = {};
	if (order) {
		sort[order] = sortOrder;
	}
	const options = { limit, page, sort, lean: true };
	const result = await productsModel.paginate(search, options);
	result.prevLink = result.hasPrevPage
		? `/products?limit=${result.limit}&page=${result.prevPage}`
		: '';
	result.nextLink = result.hasNextPage
		? `/products?limit=${result.limit}&page=${result.nextPage}`
		: '';
	logger.info(result);
	res.render('home', result);
};

export const getProductById = async (req,res) => {
	try{
		const id = req.params.id;
		const myProduct = await productsModel.findById(id);
		logger.info(myProduct);
		res.render('realTimeProducts', {docs: myProduct})	
	} catch (error){
		res.status(404).send({ error });
	}
}

export const getProductsByCategory = async (req, res) => {
	try {
		const category = req.params.category;
		const stock = req.params.stock;
		const product = await productsModel
			.find({ category: category })
			.lean()
			.exec();
		logger.info(product);
		res.render('realTimeProducts', { docs: product });
	} catch (error) {
		res.status(404).send({ error });
	}
};

export const createProductController = async (req, res) => {
	try {
		const product = req.body;
		if (
			!product.title ||
			!product.description ||
			!product.price ||
			!product.code ||
			!product.stock ||
			!product.category ||
			!product.status
		) {
			/* return res.status(400).json({
				message: 'Error, debe diligenciar todos los datos',
			}); */
			CustomError.createError({
				name: "Product creation error",
				cause: generateErrorInfo(product),
				message: "Error trying to create a product",
				code: EErros.INVALID_TYPES_ERROR
			})
		}

		const newProduct = await productsModel.create(product);
		res.json({
			status: 'Success',
			message: 'Product Added',
			newProduct,
		});
	} catch (error) {
		logger.error(error);
		res.json({ error });
	}
};

export const updateProductController = async (req, res) => {
	try {
		const idProduct = req.params.id;
		const updateProduct = req.body;
		const myProduct = await productsModel.updateOne(
			{
				_id: idProduct,
			},
			updateProduct
		);
		res.json({
			status: 'Success',
			message: 'Product Update',
			myProduct,
		});
	} catch (error) {
		logger.error(error);
		res.json({ error });
	}
};

export const deleteProductController = async (req, res) => {
	const id = req.params.id;
	const productDelete = await productsModel.deleteOne({ _id: id });
	res.json({
		status: 'Success',
		message: 'Product Deleted',
		productDelete,
	});
};
