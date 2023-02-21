const {Router} = require ('express');
const path = require('path')
/* const ProductManager = require('../controller/productManager'); */
const cart = path.join(__dirname, '../data/carts.json');
const CartsManager = require('../controller/cartsManager')
const carts = new CartsManager(cart)
const router = Router();


router.post('/', (req, res) => {
  
    try{
      let myCart = carts.addCart()
     
      if(myCart){
       res.status(200).json({ status: "success", message: "Product created!"})
      }
      console.log(myCart);
    }
     catch (error){
     return res.status(404).send({error})
    }
    
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

router.post('/:cid/products/:id', (req, res) => {
    //TODO
})


module.exports = router