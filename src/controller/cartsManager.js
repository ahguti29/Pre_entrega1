const fs = require('fs');
const path = require('path');
class CartsManager {
	constructor() {
		this.path = path.resolve(__dirname, '../data/carts.json');
	}

	readFile = () => {
		return fs.readFileSync(this.path, { encoding: 'utf-8', flag: 'a+' });
	};

	generadorId = () => {
		const jsonFile = this.readFile();
		if (jsonFile) {
			const products = JSON.parse(jsonFile);
			const count = products.length;
			if (count !== 0) {
				return products[count - 1].id + 1;
			}
		}
		return 1;
	};

	getCartById = (id) => {
		const fileJson = this.readFile();
		const carts = JSON.parse(fileJson);
		if (carts) {
			return carts.find((identify) => identify.id === id);
		} else {
			const error = 'Not Found';
			return error;
		}
	};

	addCart = () => {
		let carts = [];
		const jsonFile = this.readFile();
		if (jsonFile) {
			carts = JSON.parse(jsonFile);
		}
		let newCart = { id: this.generadorId(), products: [] };
		carts.push(newCart);
		fs.writeFileSync(this.path, JSON.stringify(carts));
		return carts;
	};

	addProductToCart = (cartId, productId, quantity) => {
		let carts = [];
		const jsonFile = this.readFile();
		if (jsonFile) {
			carts = JSON.parse(jsonFile);
		}
		
		const cartIndex = carts.findIndex((c) => c.id == cartId);
		const productToUpdate = carts[cartIndex].products.findIndex(
			(p) => p.id == productId
		);

		if (productToUpdate !== -1) {
			carts[cartIndex].products[productToUpdate].quantity += quantity;
		} else {
			const product = {
				id: productId,
				quantity,
			};
			carts[cartIndex].products.push(product);
		}

		fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
	};
}

module.exports = CartsManager;
