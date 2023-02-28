const express = require('express');
const { Server } = require('socket.io');
const path = require('path')
const handlebars = require ('express-handlebars');
const productsRouter = require('./router/products.router');
const cartsRouter = require('./router/carts.router');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extends: true}))
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'handlebars')


app.use('/products', productsRouter);
app.use('/carts' , cartsRouter); 
const serverHttp = app.listen(8080, () => console.log('Server Up!'));
app.use(express.static(path.join(__dirname,'/public')))
const serverSocket = new Server(serverHttp);
app.set('socket.io',serverSocket)
serverSocket.on('connection', () =>{
	console.log('Socket  conectado...');
})