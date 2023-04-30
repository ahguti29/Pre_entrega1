
import dotenv from 'dotenv'
const enviroment = 'DEVELOPMENT'

dotenv.config();

module.exports = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASS
}