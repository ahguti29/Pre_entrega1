import {generateProducts} from '../services/mockingManager.js'

export const getProducts = (req, res) => {
    const products = []
    for(let i=0; i<100; i++){
        products.push(generateProducts())
    }
    res.render('products',{docs: products})
}