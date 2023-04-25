/* const {Router} = require ('express'); */
import { Router } from 'express';
import { addProductToCart, createCartController, getCart } from '../controller/carts.controller.js';

const router = Router();

router.post('/', createCartController);
router.get('/:id', getCart);
router.post('/:cid([0-9]+)/products/:id([0-9]+)', addProductToCart)

export default router;
/* module.exports = router */