import productsModel from '../models/products.model.js';
import ProductManager from '../controller/productManager.js';
const products = new ProductManager()

export const getProducts = async(req, res) => {
        
    const myProducts = await productsModel.find().lean().exec()
    
    res.render('realTimeProducts', {docs: myProducts});
}

export const getProductsController = async(req, res) =>{
    const limit = req.query?.limit || 10
    const page = req.query?.page || 1
    const filter = req.query?.filter || ''
    const order = req.query?.sort || ''
    const sortOrder = req.query?.sortOrder || 'desc'
    
    const search = {}
    if(filter){
        search.title = filter
    }
    const sort = {}
    if(order){
        sort[order]= sortOrder
    }
    const options = {limit, page, sort, lean: true}
    const result = await productsModel.paginate(search, options)
    result.prevLink = result.hasPrevPage ? `/products?limit=${result.limit}&page=${result.prevPage}` : ''
    result.nextLink = result.hasNextPage ? `/products?limit=${result.limit}&page=${result.nextPage}` : ''
    console.log(result);
    res.render('home', result)
}

export const getProductsByCategory = async (req,res) => {
    try{
        const category = req.params.category
        const stock = req.params.stock
        const product = await productsModel.find({category: category}).lean().exec()
        console.log(product)
        res.render('realTimeProducts', {docs: product}) 
    } catch (error){
            res.status(404).send({error})
    }
    }

export const createProductController = async (req, res) =>{
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
}

export const updateProductController = async(req, res) =>{
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
}

export const deleteProductController = async(req, res) => {
    const id = req.params.id;
    const productDelete = await productsModel.deleteOne({_id: id});
    res.json({
        status: "Success",
        message: "Product Deleted",
        productDelete
    })
}