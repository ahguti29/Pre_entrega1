import mongoose from "mongoose";
const rolesCollection = 'roles';
const rolesSchema = new mongoose.Schema({
   role: {
    type : String,
    enum : ['admin', 'user']
   }
})

const rolesModel = mongoose.model(rolesCollection, rolesSchema)

export default rolesModel