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


const app = express();
const uri =config.mongoUrl;

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
			dbName: 'ecommerce',
		}),
		secret: '3com3rce',
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

app.listen(8080, () => console.log('Server Up!'));
const main = async () => {
	await mongoose.connect(uri);
};

main();
