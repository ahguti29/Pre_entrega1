/* const {Router} = require ('express'); */
import { Router } from 'express';
import path from 'path';
import CartsManager from '../controller/cartsManager.js'
/* const path = require('path') */
const cart = path.join('../data/carts.json');
/* const CartsManager = require('../controller/cartsManager') */
const carts = new CartsManager(cart)
const router = Router();


router.post('/', (req, res) => {
  
    let myCart = carts.addCart()
    console.log(myCart);
    res.status(200).json({ status: "success", message: "Product created!"})
})

router.get('/:id', (req, res) => {
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
})

router.post('/:cid([0-9]+)/products/:id([0-9]+)', (req, res) => {
  carts.addProductToCart(req.params.cid, req.params.id, req.body.quantity)  
  res.status(200).send({
          status:"ok",
            message : "Producto encontrado"
    })
})

export default router;
/* module.exports = router */