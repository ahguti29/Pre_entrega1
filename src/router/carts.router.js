/* const {Router} = require ('express'); */
import { Router } from 'express';
import { addProductToCart, createCartController, getCart, deleteOneProduct, updateProducts, updateQuantity, deleteAllProducts } from '../controller/carts.controller.js';

const router = Router();

router.post('/', createCartController);
router.get('/:id', getCart);
router.post('/:cid/products/:id', addProductToCart);
router.delete('/:cid/products/:id', deleteOneProduct);
router.delete('/:cid', deleteAllProducts);
router.put('/:id', updateProducts);
router.put('/:cid/prodcuts/:id', updateQuantity);


export default router;
/* module.exports = router */