/* const {Router} = require ('express'); */
import { Router } from 'express';
import { createProductController, deleteProductController, getProducts, getProductsByCategory, getProductById, getProductsController, updateProductController } from '../controller/product.controller.js';

const router = Router();
const auth = (req, res, next) => {
    if(req.session?.user) return next()
    return res.status(401).send('Auth error')
}

router.get('/view', getProducts); 
router.get('/', auth, getProductsController);
router.get('/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.post("/", createProductController);
router.put('/:id', updateProductController);
router.delete('/:id', deleteProductController); 

export default router;