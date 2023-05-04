import CartsManager from '../services/cartsManager.js';
import path from 'path';
import cartsModel from '../dao/models/carts.model.js';
import productsModel from '../dao/models/products.model.js';
const cart = path.join('../data/carts.json');
const carts = new CartsManager(cart);

/* Metodo que permite crear un nuevo cart*/
export const createCartController = async (req, res) => {
	const result = {};
	try {
		const cart = await cartsModel.create({});
		result = {
			status: 'success',
			message: 'cart agregado',
			id: cart.id,
		};
		res.status(201).send(result);
	} catch (error) {
		result = {
			status: 'error',
			message: 'cart no agregado',
			id: '0',
		};
		res.status(404).send(result);
	}

	return res;
};

/* Funcion que permite obtener un cart de acuerdo al Id */

export const getCart = async (req, res) => {
	const id = req.params.id;
	console.log(id);
	const result = {};

	if (id === undefined) {
		(result.status = 'error'), (result.message = 'Id del cart no encontrado');
		res.json(result);
	}

	try {
		const cart = await cartsModel.findById(id);
		result.status = 'success';
		result.payload = cart;
		result.message = 'Cart encontrado';
	} catch (error) {
		(result.status = 'error'), (result.payload = []);
		result.message = 'Cart no encontrado';
	}
	return res.json(result);
};

/* Función que permite agregar un producto a un carro. Verificando que exista el carrito y que exista el producto a agregar*/
export const addProductToCart = async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.id;
	const result = {};
	let cartUpdate;

	if (cartId === undefined || productId === undefined) {
		result.status = 'error';
		result.message = 'El id del carro o producto no es correcto.';
		result.added = false;
		return res.json(result);
	}

	try {
    const productExists = await productsModel.exists({ _id: productId });
		if (!productExists) {
			result.status = 'error';
			result.message = 'El id del producto no existe.';
			result.added = false;
			return res.json(result);
		}
	} catch (error) {
		result.status = 'error';
		result.message = 'Producto no consultado';
		result.added = false;
		return res.json(result);
	}

	try {
    const cartExists = await cartsModel.exists({ _id: cartId })
		if (!cartExists) {
			result.status = 'error';
			result.message = 'El id del cart no existe.';
			result.added = false;
			return res.json(result);
		}
	} catch (error) {
		result.status = 'error';
		result.message = 'No consulta el cart.';
		result.added = false;
		return res.json(result);
	}
	try {
		cartUpdate = await cartsModel.updateOne(
			{ _id: cartId, 'products.product': productId },
			{ $inc: { 'products.$.quantity': 1 } }
		);
		if (cartUpdate.modifiedCount > 0) {
			result.status = 'success';
			result.message = 'Cantidad actualizada';
			result.added = true;
			return res.json(result);
		}

		cartUpdate = await cartsModel.updateOne(
			{ _id: cartId },
			{ $addToSet: { products: { product: productId } } }
		);
		if (cartUpdate.modifiedCount > 0) {
			result.status = 'success';
			result.message = 'producto agregado al cart';
			result.added = true;
			return res.json(result);
		}
	} catch (error) {
		result.status = 'error';
		result.message = 'La consulta no se puede realizar';
		result.added = false;
		return res.json(result);
	}
	result.status = 'error';
	result.message = 'Producto no agregado';
	result.added = false;
	return res.json(result);
};

export const deleteOneProduct = async(req, res) => {
  const cartId = req.params.cid;
	const productId = req.params.id;
  const result = {}
  let delProduct

  if(cartId === undefined || productId === undefined){
      result.status = "error"
      result.message = "El cartId o ProductId no existe."
      result.remov = false
      return res.json(result)
  }

  try {
      if(await cartsModel.exists({_id:cartId}) === null){
          result.status = "error"
          result.message = "El id del cart no existe"
          result.remov = false
          return res.json(result)
      }
  } catch (error) {
      console.log(error)
      result.status = "error"
      result.message = "No puede consultar el cart."
      result.remov = false
      return res.json(result)
  }

  try {
      delProduct = await cartsModel.updateOne({_id:cartId},{$pull:{ products:{ product: productId } }})
      
      if(delProduct.modifiedCount > 0){
          result.status = 'success'
          result.message = `producto ${productId} eliminado exitosa`
          result.remov = true
          return res.json(result)
      }

      result.status = 'error'
      result.message = `El producto ${productId} no se encontro en el cart`
      result.remov = false
      return res.json(result)

  } catch (error) {
      console.log(error)
      result.status = "error"
      result.message = "could not be consulted cart."
      result.remov = false
      return res.json(result)
  }
};

/* Funcion que permite eliminar todos los productos del cart */
export const deleteAllProducts = async(req, res) => {
  const cid = req.params.cid
  const result = {}
  let del;

    if(cid === undefined){
        result.status = "error"
        result.message = "the cart id is not a correct number."
        result.modif = -1
        return res.json(result)
    }

    try {
        if(await cartsModel.exists({_id:cid}) === null){
          
            result.status = "error"
            result.message = "the cart id no exists."
            result.modif = -1
            return res.json(result)
        }
    } catch (error) {
      console.log(error)
        result.status = "error"
        result.message = "could not be consulted cart."
        result.modif = -1
        return res.json(result)
    }

    try {
        del = await cartsModel.updateOne({_id:cid},{ products: [] })

        if(del.modifiedCount > 0 && del.matchedCount > 0){
            result.status = "success"
            result.message = `products cart whit ${cid} updated successfully`
            result.modif = 1
            return res.json(result)
        }

        if(del.modifiedCount === 0 && del.matchedCount > 0){
            result.status = "success"
            result.message = `products cart whit ${cid} found but not updated`
            result.modif = 0
            return res.json(result)
        }

        if(del.matchedCount === 0){
            result.status = "error"
            result.message = `cart whit ${cid} not found`
            result.modif = -1
            return res.json(result)
        }
    } catch (error) {
        console.log(error)
        result.status = "error"
        result.message = "could not be consulted cart."
        result.modif = -1
        return res.json(result)
    }
};

/* Funcion que permite actualizar un arreglo de productos */
export const updateProducts = async(req, res) => {
  
    const cid = req.params.cid
    const arrayProducts = req.body
    const result = {}
    let upd;

    if(cid === undefined){
        result.status = "error"
        result.message = "the cart id is not a correct number."
        result.modif = -1
        return res.json(result)
    }

    if(arrayProducts === undefined || !(Array.isArray(arrayProducts))){
        result.status = "error"
        result.message = " the array of products is not valid"
        result.modif = -1
        return res.json(result)
    }

    const auxProducts = arrayProducts.map( prod => {
        return { product : {_id : prod.id}, quantity : prod.quantity }
    })
    try {
        upd = await cartsModel.updateOne({_id:cid},{ products: auxProducts })
        console.log(upd)
        if(upd.modifiedCount > 0 && upd.matchedCount > 0){
            result.status = "success"
            result.message = `products cart whit ${cid} updated successfully`
            result.modif = 1
            return res.json(result)
        }

        if(upd.modifiedCount === 0 && upd.matchedCount > 0){
            result.status = "success"
            result.message = `products cart whit ${cid} found but not updated`
            result.modif = 0
            return res.json(result)
        }

        if(upd.matchedCount === 0){
            result.status = "error"
            result.message = `cart whit ${cid} not found`
            result.modif = -1
            return res.json(result)
        } 

    } catch (error) {
        result.status = "error"
        result.message = `products cart whit ${cid} not updated`
        result.modif = -1
        return res.json(result)
    }
};
/* Función que permite actualizar la cantidad de un producto */
export const updateQuantity = async(req, res) => {
  const {cid,id} = req.params
    let {quantity} = req.body
    const result = {}

    quantity = parseInt(quantity)

    if(cid === undefined || id === undefined){
        result.status = "error"
        result.message = "the cart id or product id is not a correct number."
        result.modif = -1
        return res.json(result)
    }

    if(isNaN(quantity)){
        result.status = "error"
        result.message = "the quantity is not a correct number."
        result.modif = -1
        return res.json(result)
    }

    try {
        if(await cartsModel.exists({_id:cid}) === null){
            result.status = "error"
            result.message = "the cart id no exists."
            result.modif = -1
            return res.json(result)
        }
    } catch (error) {
        result.status = "error"
        result.message = "could not be consulted cart."
        result.modif = -1
        return res.json(result)
    }

    let upd

    try {
        upd = await cartsModel.updateOne({_id:cid , 'products.product':id},{$set:{'products.$.quantity':quantity}})
        if(upd.modifiedCount > 0 && upd.matchedCount > 0){
            result.status = "success"
            result.message = "quantity of product updated."
            result.modif = 1
            return res.json(result)
        }

        if(upd.modifiedCount === 0 && upd.matchedCount > 0){
            result.status = "success"
            result.message = "quantity of product not updated."
            result.modif = 0
            return res.json(result)
        }

        if(upd.matchedCount === 0){
            result.status = "error"
            result.message = "product not found in the cart."
            result.modif = -1
            return res.json(result)
        }
        
        
    } catch (error) {
        result.status = "error"
        result.message = "product not updated"
        result.modif = -1
        return res.json(result)
    }
};
