const {Router} = require ('express');
const path = require('path')
const ProductManager = require('../controller/productManager');
const product = path.join(__dirname, '../data/products.json');
const products = new ProductManager(product)
const router = Router();

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
        let productA = products.addProducts(req.body.title, req.body.description, req.body.code, req.body.price, req.body.thumbnail, req.body.category, req.body.status, req.body.stock )
        if(productA){
            res.json({product})
        } else{
            res.send({error : "Producto no agregado"})
        }
    } catch (error){
        res.status(404).send({ error });
    }
    
})
router.put('/', (req, res) => {
    //TODO
})
router.delete('/', (req, res) => {
    //TODO
})

module.exports = router