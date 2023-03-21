/* const fs = require('fs');
const path = require('path'); */
import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js'
class ProductManager {
	
	constructor() {
		this.path = path.resolve(__dirname, "../data/products.json");
	}

	readFile = () => {
		return fs.readFileSync(this.path, { encoding: 'utf-8', flag: 'a+' });
	};

	/* Funcion que permite generar un ID autoincrementable */
	generadorId = () => {
		const jsonFile = this.readFile();
		if(jsonFile){
			const products = JSON.parse(jsonFile);
			const count = products.length;
			if (count !== 0) {
				return products[count - 1].id + 1;
			} 	
		}
		return 1;
	};
	

	/* Funcion que busca mendiante un ID si el producto se encuenta en el array de productos agregados */
	getProductsById = (id) => {
		const jsonFile = this.readFile();
		const products = JSON.parse(jsonFile)
		if (products){
			return products.find((identify) => identify.id === id)}
		else{
			const error ="Not Found";
			return error;
		}		
	}
		
	/* Función que permite agregar productos validando que se ingresen todos los parametros 
	y que no se encuentre un code repetido */
	addProducts = ( title, description, code, price, thumbnail, category, status, stock) => {
		let products = [];
		const jsonFile = this.readFile();
		if(jsonFile){
			products = JSON.parse(jsonFile)
		}
		const id = this.generadorId();
		
		//Validación del ingreso de parametros
        if(!title || !description || !price || !code  || !stock || !category || !status){
            console.error ("El producto no fue agregado, completar todos los datos")
            return
        }
		//validación del ID
	 	let productId = products.find((element) => element.id === id)
		if(productId){	
			return console.error(`El producto con id ${id} ya existe`)
		} 
		//Validación del code ingresado
		if (products.find((element) => element.code === code)) {
			console.error(`El producto con code ${code} ya existe`);
            return;
		}
		//Se agrega  el producto al array
		products.push({id, title, description, price, thumbnail, code, stock, category, status});
		fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
	};
		/* Funcion que permite obtener todos los productos */
	getProducts = (limit) => {
		const products = JSON.parse(this.readFile())
		if (limit) {
            return products.slice(0, limit);
        }
		return products
	} 

	/* Función que permite eliminar un producto de acuerdo al ID que sea ingresado */
	deleteProducts = (id) => {
		let jsonFile = this.readFile()
		let products = JSON.parse(jsonFile)
		products = products.filter((identify) => identify.id !== id)
		fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
	}
	/* Función que permite actualizar un producto de acuerdo al Id ingresado */
	updateProduct = (id , productA) => {
		let jsonFile = this.readFile()
		let products = JSON.parse(jsonFile);
		let productIndex = products.findIndex((p) => p.id === id);
		products[productIndex] = {...products[productIndex], ...productA}
		fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
		}  
		
	} 

	/* module.exports = ProductManager; */
	export default ProductManager;