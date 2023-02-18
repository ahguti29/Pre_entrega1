const fs = require('fs');
let products = []; 
class ProductManager {
	
	constructor(path) {
		this.path = path;
	}
	/* Funcion que permite generar un ID autoincrementable */
	generadorId = () => {
		const products = JSON.parse(fs.readFileSync(this.path,'utf-8'))
		const count = products.length;
		if (count === 0) {
			return 1;
		} else {
			return products[count - 1].id + 1;
		}
	};
	

	/* Funcion que busca mendiante un ID si el producto se encuenta en el array de productos agregados */
	getProductsById = (id) => {
		const product = fs.readFileSync(this.path,'utf-8')
		const products = JSON.parse(product)
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
		const products = JSON.parse(fs.readFileSync(this.path,'utf-8'))
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
		const products = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
		if (limit) {
            return products.slice(0, limit);
        }
		return products
	} 

	/* Función que permite eliminar un producto de acuerdo al ID que sea ingresado */
	deleteProducts = (id) => {
		let product = fs.readFileSync(this.path,'utf-8')
		let products = JSON.parse(product)
		products = products.filter((identify) => identify.id !== id)
		fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
	}
	/* Función que permite actualizar un producto de acuerdo al Id ingresado */
	updateProduct = (id , productA) => {
		let products = fs.readFileSync(this.path, 'utf-8');
		let product = JSON.parse(products);
		let productI = product.findIndex((p) => p.id === id);
		product[productI] = {...product[productI], ...productA}
		fs.writeFileSync(this.path, JSON.stringify(product, null, 2))
		}  
		
	} 

	module.exports = ProductManager;