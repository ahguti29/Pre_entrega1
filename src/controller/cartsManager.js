const fs = require('fs')
const carts = []

class CartsManager{
    constructor(path){
        this.path = path;
    }
	generadorId = () => {
		const products = JSON.parse(fs.readFileSync(this.path,'utf-8'))
		const count = products.length;
		if (count === 0) {
			return 1;
		} else {
			return products[count - 1].id + 1;
		}
	};

    getCartById = (id) => {
		const cart = fs.readFileSync(this.path,'utf-8')
		const carts = JSON.parse(cart)
		if (carts){
		return carts.find((identify) => identify.id === id)}
		else{
			const error ="Not Found";
			return error;
		}	
	}

	addCart = () => {
		const carts = JSON.parse(fs.readFileSync(this.path,'utf-8'))
		let newCart = {id: this.generadorId(), products: []}
		carts.push(newCart)
		fs.writeFileSync(this.path, JSON.stringify(carts))
		return carts
	}
	
		


}

module.exports = CartsManager;