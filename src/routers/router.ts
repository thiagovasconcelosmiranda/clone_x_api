import { Router } from "express";
import * as pingController from '../controllers/ping';
import * as authController from '../controllers/auth';
import * as tweetController from '../controllers/tweet';
import * as userController from '../controllers/user';
import { verifyJwt } from "../utils/jwt";

export const router = Router();

router.get('/ping', pingController.ping);

router.post('/auth/signin', authController.signin);
router.post('/auth/signup', authController.signup);

router.post('/tweet', verifyJwt, tweetController.addTweet );
router.get('/tweet/:id', verifyJwt, tweetController.getTweet);
router.get('/tweet/:id/answer', verifyJwt, tweetController.getAnswers);
router.post('/tweet/:id/answer', verifyJwt, tweetController.addAnswers);

router.get('/user/:slug', verifyJwt, userController.getUser);
router.get('/user/:slug/tweets', verifyJwt, userController.getUserTweet);