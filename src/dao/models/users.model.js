import mongoose from "mongoose";

const usersCollection = 'users'
const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles'
    }
})

mongoose.set("strictQuery", false)
const UsersModel = mongoose.model(usersCollection, usersSchema)

export default UsersModel