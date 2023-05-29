import winston from 'winston';
import dotenv from 'dotenv';
dotenv.config()
const customLevels = {
    levels:{
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'magenta',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'orange',
        fatal: 'red'
    }
}

winston.addColors(customLevels.colors);

export const createLogger = env =>{
    if(env === 'PROD'){
        return winston.createLogger({
            level: 'info',
            transports: [
                new winston.transports.File({
                    filename: 'error.log',
                    format: winston.format.simple()
                })
            ]
        })
    } else{
        return winston.createLogger({
            level: 'debug',
            transports: [
                new winston.transports.Console({
                   
                    format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                    )
                })
            ]
        })
    }
}
const logger = createLogger(process.env.ENVIROMENT)

export default logger;