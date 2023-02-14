const {Router} = require ('express');
const path = require('path')
const ProductManager = require('../controller/productManager');
const cart = path.join(__dirname, '../data/carts.json');
const carts = new ProductManager(cart)
const router = Router();


router.post('/', (req, res) => {
    //TODO
})

router.get('/:id', (req, res) => {
    try {
        let cart = carts.getProductsById(parseInt(req.params.id));
         if (cart) {
          res.send({cart});
        }
        else {
          res.send({error : "Producto no encontrado"});
        } 
      } catch (error) {
        res.status(404).send({ error });
      }
})

router.post('/:cid/products/:id', (req, res) => {
    //TODO
})


module.exports = router