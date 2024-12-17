import { Router } from "express";
import * as pingController from '../controllers/ping';
import * as authController from '../controllers/auth';
import { verifyJwt } from "../utils/jwt";

export const router = Router();

router.get('/ping', pingController.ping);

router.post('/auth/signin', authController.signin);
router.post('/auth/signup', authController.signup);