import { Router } from "express";
import UsersModel from "../models/users.model.js";

const router = Router()

/* Metodo para obtener la vista de registro */
router.get('/register', (req, res) => {
    res.render('register')
})

/* Metodo post para crear usuarios en la BD */
router.post('/register', async(req, res) => {
    const userNew = req.body
    console.log(userNew);

    const user = new UsersModel(userNew)
    await user.save()

    res.redirect('login')
})

/* Ruta con metodo get que permite obtener la vista de login */
router.get('/login', (req, res) => {
    res.render('login')
})

/* Ruta con metodo post que permite realizar un login */
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await UsersModel.findOne({email, password}).lean().exec()
    if(!user) {
        return res.status(401).render('errorE', {
            error: 'Email o password incorrectos'
        })
    }
    req.session.user = user
    res.redirect('/products')
})

/* Ruta con metodo get que permite cerrar una sesión */
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.status(500).render('error', {error: err})
        } else res.redirect('login')
    })
})


export default router