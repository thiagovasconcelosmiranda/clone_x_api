import { Router } from "express";
import * as pingController from '../controllers/ping';
import * as authController from '../controllers/auth';
import * as tweetController from '../controllers/tweet';
import * as userController from '../controllers/user';
import * as feedController from '../controllers/feed';
import * as trendController from '../controllers/trend';
import * as suggestionController from '../controllers/suggestion';
import * as searchController from '../controllers/search';
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
router.post('/tweet/:id/like', verifyJwt, tweetController.likeToggle);
router.put('/user', verifyJwt, userController.updateUser);

router.get('/feed', verifyJwt, feedController.getFeed);
router.get('/search', verifyJwt, searchController.searchTweets);
router.get('/trending', verifyJwt, trendController.getTrend);
router.get('/suggestions', verifyJwt, suggestionController.getSuggestions);