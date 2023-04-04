import { Router } from "express";
import UsersModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router()

/* Metodo para obtener la vista de registro */
router.get('/register', (req, res) => {
    res.render('register')
})

/* Metodo post para crear usuarios en la BD */
router.post('/register', passport.authenticate('register', {failureRedirect:'/failRegister'}), async(req, res) => {
    res.redirect('login')
})

router.get('/fileRegister', (req,res) => {
    res.send({error: 'failRegister'})
})
/* Ruta con metodo get que permite obtener la vista de login */
router.get('/login', (req, res) => {
    res.render('login')
})

/* Ruta con metodo post que permite realizar un login */
router.post('/login', passport.authenticate('login', {failureRedirect: 'failLogin'}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentiales' })
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }
    res.redirect('/products')
})

router.get('/failLogin', (req, res) => {
    res.send({ error: 'Fail Login' })
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