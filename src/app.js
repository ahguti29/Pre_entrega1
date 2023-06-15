/* const express = require('express'); */
import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import productsRouter from './router/products.router.js';
import cartsRouter from './router/carts.router.js';
import sessionRouter from './router/session.router.js';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import  config from './config/config.js';
import mockingRouter from './router/mocking.router.js';
import errorHandler from './middlewares/error.js'
import logger from './logger.js';
import loggerRouter from './router/logger.router.js'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'

const app = express();
const uri =config.mongoUrl;
const dbName = config.dbName;
const secret = config.secret;
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.engine('handlebars', handlebars.engine());
app.use(express.static(path.join(__dirname + '/public')));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
	res.render('home', {
		title: 'E-COMMERCE',
	});
});
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: uri,
			dbName: dbName,
		}),
		secret: secret,
		resave: true,
		saveUninitialized: true,
	})
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/session', sessionRouter);
app.use('/mockingproducts', mockingRouter);
app.use('/loggerTest', loggerRouter);
app.use(errorHandler); 

app.listen(config.port, () => logger.info('Server Up!'));
const main = async () => {
	await mongoose.connect(uri);
};

const swaggerOptions = {
	definition:{
		openapi: '3.0.1',
		info: {
			title: 'Documentacion Ecommerce',
			description: 'API ecommerce'
		}
	},
	apis: ['./docs/**/*.yaml']
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

main();


