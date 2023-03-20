/* const express = require('express'); */
import  express  from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
/* const path = require('path'); */
/* const handlebars = require('express-handlebars'); */
/* const productsRouter = require('./router/products.router');
const cartsRouter = require('./router/carts.router'); */
const app = express();
const uri =
	'mongodb+srv://ecommerce:entrega2@cluster0.1mmujrd.mongodb.net/ecommerce?retryWrites=true&w=majority';
import mongoose from 'mongoose';
import productsModel from './models/products.model.js';
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.engine('handlebars', handlebars.engine());

app.set('views', path.join('/views'));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
	res.render('home', {
		title: 'E-COMMERCE',
		name: 'Gloria',
	});
});

app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.listen(8080, () => console.log('Server Up!'));
const main = async () => {
	await mongoose.connect(uri);
	let result = await productsModel.insertMany(
		[
			{ id: 1, title: "Polo Azul",
				description: "Talla M",
				code: 1,
				price: 25000,
				thumbnail: "www.polo.com",
				category: "Polos",
				status: true,
				stock: 20
			}
		]
	)
	console.log(result);
};

main();

