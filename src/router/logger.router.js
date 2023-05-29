import {Router} from "express";
import {createLogger} from "../logger.js";

const router = Router();

router.get('/', createLogger);

export default router;