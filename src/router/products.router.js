/* const {Router} = require ('express'); */
import { Router } from 'express';
import ProductManager from '../controller/productManager.js';
import productsModel from '../models/products.model.js';
/* const ProductManager = require('../controller/productManager'); */
const products = new ProductManager()
const router = Router();

router.get('/view', async(req, res) => {
        
        const myProducts = await productsModel.find().lean().exec()
        
        res.render('realTimeProducts', {docs: myProducts});
}) 

/* router.get('/', (req, res) => {
    try{
        const myProducts = products.getProducts(
            req.query.limit
        );
        res.send(myProducts);
    } catch (error) {
        res.send({ error });
    }
}) */

router.get('/', async(req, res) =>{
    const limit = req.query?.limit || 10
    const page = req.query?.page || 1
    const filter = req.query?.filter || ''
    
    const search = {}
    if(filter){
        search.title = filter
    }
    const options = {limit, page, lean: true}
    const result = await productsModel.paginate(search, options)
    result.prevLink = result.hasPrevPage ? `/products?limit=${result.limit}&page=${result.prevPage}` : ''
    result.nextLink = result.hasNextPage ? `/products?limit=${result.limit}&page=${result.nextPage}` : ''
    console.log(result);
    res.render('home', result)
})

router.get('/:category', async (req,res) => {
try{
    const category = req.params.category
    const stock = req.params.stock
    const product = await productsModel.findOne({category: category})
    console.log(product)
    res.render('home', product) 
} catch (error){
        res.status(404).send({error})
}
});
/* router.get('/:id', (req, res) => {
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
}) */

router.post("/", async (req, res) =>{
    try{
        const product = req.body
        if(!product.title || !product.description || !product.price || !product.code  || !product.stock || !product.category || !product.status){
            return res.status(400).json({
                message: "Error, debe diligenciar todos los datos"
            })
        }

        const newProduct = await productsModel.create(product)
        res.json({
            status: "Success",
            message: "Product Added",
            newProduct
        })
    } catch(error){
        console.log(error)
        res.json({error})
    }
})

/* router.post('/', (req, res) => {
    try{
        products.addProducts(req.body.title, req.body.description, req.body.code, req.body.price, 
                req.body.thumbnail, req.body.category, req.body.status, req.body.stock)
        res.status(201).json({ status: "success", message: "Product created!"})
    } catch (error){
        res.status(404).send({ error });
    }
    
}) */

router.put('/:id', async(req, res) =>{
    try{
        const idProduct = req.params.id
        const updateProduct = req.body
        const myProduct = await productsModel.updateOne({
            _id: idProduct}, updateProduct)
        res.json({
            status: "Success",
            message: "Product Update",
            myProduct
        })
    } catch(error){
        console.log(error);
        res.json({error})
    }
})

/* router.put('/:id', (req, res) => {
    try{
        const myProducts = products.updateProduct(parseInt(req.params.id),req.body);
        res.send(myProducts);
    } catch (error) {
        res.send({ error });
    }
}) */

router.delete('/:id', async(req, res) => {
    const id = req.params.id;
    const productDelete = await productsModel.deleteOne({_id: id});
    res.json({
        status: "Success",
        message: "Product Deleted",
        productDelete
    })
}) 
/* router.delete('/:id', (req, res) => {
    try{
        const myProducts = products.deleteProducts(parseInt(req.params.id));
        res.send(myProducts);
    } catch (error) {
        res.send({ error });
    }
}) */


/* module.exports = router */
export default router;