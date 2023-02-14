const express = require('express');
const productsRouter = require('./router/products.router');
const cartsRouter = require('./router/carts.router')
const app = express();

app.use(express.json())
app.use(express.urlencoded({extends: true}))

app.get('/', (req, res) => {
	res.send('Pagina principal');
});

app.use('/products', productsRouter);
app.use('/carts' , cartsRouter);

app.listen(8080, () => console.log('Server Up!'));