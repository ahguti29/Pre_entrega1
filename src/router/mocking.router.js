import { Router } from 'express';
import {getProducts} from '../controller/mocking.controller.js'

const router = Router()

router.get("/", getProducts)

export default router;