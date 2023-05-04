import CartsManager from '../services/cartsManager.js';
import path from 'path';
import cartsModel from '../dao/models/carts.model.js';
import productsModel from '../dao/models/products.model.js';
import { log } from 'console';
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
      result.message = "No se puede consultar el cart."
      result.remov = false
      return res.json(result)
  }
};

/* Funcion que permite eliminar todos los productos del cart */
export const deleteAllProducts = async (req, res) => {
  const cid = req.params.cid;
  const result = {};

  if (cid === undefined) {
    result.status = "error";
    result.message = "El id del carro no es correcto.";
    result.modif = -1;
    return res.json(result);
  }

  try {
    const cartExists = await cartsModel.exists({ _id: cid });
    if (!cartExists) {
      result.status = "error";
      result.message = "El carro no existe.";
      result.modif = -1;
      return res.json(result);
    }
  } catch (error) {
    result.status = "error";
    result.message = "No se pudo consultar el carro.";
    result.modif = -1;
    return res.json(result);
  }

  try {
    let del = await cartsModel.updateOne({ _id: cid }, { products: [] });
    console.log(del.modifiedCount)
    if (del.modifiedCount > 0) {
      result.status = "success";
      result.message = `Se eliminaron todos los productos del carro ${cid} exitosamente.`;
      result.modif = 1;
    } else if (del.modifiedCount === 0 && del.matchedCount > 0) {
      result.status = "success";
      result.message = `El carro ${cid} no contenía productos para eliminar.`;
      result.modif = 0;
    } else {
      result.status = "error";
      result.message = `El carro ${cid} no fue encontrado.`;
      result.modif = -1;
    }
    return res.json(result);
  } catch (error) {
    result.status = "error";
    result.message = "No se pudo actualizar el carro.";
    result.modif = -1;
    return res.json(result);
  }
};

/* Funcion que permite actualizar un arreglo de productos */
export const updateProducts = async (req, res) => {
  const cid = req.params.id;
  const arrayProducts = req.body;
  const result = {};

  if (cid === undefined) {
    console.log(cid)
    result.status = "error";
    result.message = "El id del carro no es un número válido.";
    result.modif = -1;
    return res.json(result);
  }
  console.log(arrayProducts)
  console.log(cid)

  if (arrayProducts === undefined || !(Array.isArray(arrayProducts))) {
    result.status = "error";
    result.message = "El arreglo de productos no es válido.";
    result.modif = -1;
    return res.json(result);
  }

  const auxProducts = arrayProducts.map((prod) => ({
    product: { _id: prod.id },
    quantity: prod.quantity,
  }));

  try {
    let upd = await cartsModel.updateOne({ _id: cid }, { products: auxProducts });

    if (upd.modifiedCount > 0 && upd.matchedCount>0) {
      result.status = "success";
      result.message = `Los productos del carro ${cid} se actualizaron exitosamente.`;
      result.modif = 1;
    } else if (upd.modifiedCount === 0) {
      result.status = "success";
      result.message = `El carro ${cid} se encontró, pero no se realizaron actualizaciones.`;
      result.modif = 0;
    } else {
      result.status = "error";
      result.message = `No se encontró el carro ${cid}.`;
      result.modif = -1;
    }

    return res.json(result);
  } catch (error) {
    console.log(error);
    result.status = "error";
    result.message = `No se pudo actualizar el carro ${cid}.`;
    result.modif = -1;
    return res.json(result);
  }
};

/* Función que permite actualizar la cantidad de un producto */
export const updateQuantity = async(req, res) => {
  const {cartId,productId} = req.params
    let {quantity} = req.body
    const result = {}

    quantity = parseInt(quantity)

    if(cartId === undefined || producId === undefined){
        result.status = "error"
        result.message = "the id del carro no es correcto"
        result.modif = -1
        return res.json(result)
    }

    if(isNaN(quantity)){
        result.status = "error"
        result.message = "La cantidad no es un numero correcto."
        result.modif = -1
        return res.json(result)
    }

    try {
        if(await cartsModel.exists({_id:cartId}) === null){
            result.status = "error"
            result.message = "tEl cartId no existe."
            result.modif = -1
            return res.json(result)
        }
    } catch (error) {
        result.status = "error"
        result.message = "No puede consultar el cart."
        result.modif = -1
        return res.json(result)
    }

    try {
        const upd = await cartsModel.updateOne({_id:cardId , 'products.product':productId},{$set:{'products.$.quantity':quantity}})
        if(upd.modifiedCount > 0 && upd.matchedCount > 0){
            result.status = "success"
            result.message = "cantidad Actualizada."
            result.modif = 1
            return res.json(result)
        }

        if(upd.modifiedCount === 0 && upd.matchedCount > 0){
            result.status = "success"
            result.message = "cantidad de productos no actualizada."
            result.modif = 0
            return res.json(result)
        }

        if(upd.matchedCount === 0){
            result.status = "error"
            result.message = "product no encontrado en el cart."
            result.modif = -1
            return res.json(result)
        }
        
    } catch (error) {
        result.status = "error"
        result.message = "producto no actualizado"
        result.modif = -1
        return res.json(result)
    }
};
