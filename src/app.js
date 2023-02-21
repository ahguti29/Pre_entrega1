const express = require('express');
const path = require('path')
const handlebars = require ('express-handlebars');
const productsRouter = require('./router/products.router');
const cartsRouter = require('./router/carts.router')
const app = express();

app.use(express.json())
app.use(express.urlencoded({extends: true}))
app.engine('handlebars', handlebars.engine())

app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
	res.send('Pagina principal');
});

app.use('/products', productsRouter);
app.use('/carts' , cartsRouter);

app.listen(8080, () => console.log('Server Up!'));