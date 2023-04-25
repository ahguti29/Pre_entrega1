import CartsManager from '../services/cartsManager.js'
import path from 'path';
const cart = path.join('../data/carts.json');
const carts = new CartsManager(cart);

export const createCartController = (req, res) => {
  
    let myCart = carts.addCart()
    console.log(myCart);
    res.status(200).json({ status: "success", message: "Product created!"})
}

export const getCart = (req, res) => {
    try {
        let cart = carts.getCartById(parseInt(req.params.id));
         if (cart) {
          res.send({cart});
        }
        else {
          res.status(400).send({
            status:"error",
            message : "Producto no encontrado"
          });
        } 
      } catch (error) {
        res.status(404).send({ error });
      }
}

export const addProductToCart = (req, res) => {
    carts.addProductToCart(req.params.cid, req.params.id, req.body.quantity)  
    res.status(200).send({
            status:"ok",
              message : "Producto encontrado"
      })
  }