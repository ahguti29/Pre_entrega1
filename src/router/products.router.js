/* const {Router} = require ('express'); */
import { Router } from 'express';
import ProductManager from '../controller/productManager.js';
/* const ProductManager = require('../controller/productManager'); */
const products = new ProductManager()
const router = Router();

router.get('/home', (req, res) => {
        const myProducts = products.getProducts(
            req.query.limit
        )
        res.render('home', {myProducts, title: 'List of products', style : 'style.css'});
})

router.get('/', (req, res) => {
    try{
        const myProducts = products.getProducts(
            req.query.limit
        );
        res.send(myProducts);
    } catch (error) {
        res.send({ error });
    }
})
router.get('/:id', (req, res) => {
    try {
        let product = products.getProductsById(parseInt(req.params.id));
       
         if (product) {
          res.send({product});
        } else {
          res.send({error : "Producto no encontrado"});
        } 
      } catch (error) {
        res.status(404).send({ error });
      }
})
router.post('/', (req, res) => {
    try{
        products.addProducts(req.body.title, req.body.description, req.body.code, req.body.price, 
                req.body.thumbnail, req.body.category, req.body.status, req.body.stock)
        res.status(201).json({ status: "success", message: "Product created!"})
    } catch (error){
        res.status(404).send({ error });
    }
    
})
router.put('/:id', (req, res) => {
    try{
        const myProducts = products.updateProduct(parseInt(req.params.id),req.body);
        res.send(myProducts);
    } catch (error) {
        res.send({ error });
    }
})
router.delete('/:id', (req, res) => {
    try{
        const myProducts = products.deleteProducts(parseInt(req.params.id));
        res.send(myProducts);
    } catch (error) {
        res.send({ error });
    }
})


/* module.exports = router */
export default router;