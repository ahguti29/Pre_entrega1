import passport from "passport";
import local from "passport-local"
import UsersModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils.js"
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy
const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await UsersModel.findOne({ email: username })
            if (user) {
                console.log('User already exists')
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            const result = await UsersModel.create(newUser)

            return done(null, result)

        } catch(err) {
            return done('Error al obtener user')
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try{    
            const user = await UsersModel.findOne({ email: username })
            if(!user) {
                console.log('User doesn\'t exists')
                return done(null, user)
            }
            if(!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch(err) {

        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.30e2b5f00374fde5",
        clientSecret: "d011b3d14b1864cf999e13e3039ca366344e7ee9",
        callbackURL: "http://localhost:8080/session/githubcallback"
    }, async(accessToken, refreshToken, profile, done) => {
        console.log(profile)
        
        try {
            const user = await UsersModel.findOne({ email: profile._json.email})
            if (user) {
                return done(null, user)
            }
            const newUser = await UsersModel.create({
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email
            })
            return done(null, newUser)
        } catch(error) {
            return done('Error to login with github')
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UsersModel.findById(id)
        done(null, user)
    })
}

export default initializePassport

