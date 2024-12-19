import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { findUserBySlug } from "../services/user";
import { userTweetsSchema } from "../schemas/userTweets";
import { findTweetsByUser } from "../services/tweet";

export const getUser = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    const user = await findUserBySlug(slug);
    if (!user){
        res.json({ error: 'Usuario inexistente' });
        return;
    } 
    res.json({user});
}
export const getUserTweet = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;
    const safeData = userTweetsSchema.safeParse(req.query);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    let perPage = 2;
    let currentPage = safeData.data.page ?? 0;
   
    const tweets = await findTweetsByUser(
        slug,
        currentPage,
        perPage
    );
    res.json({tweets: tweets[0], page: currentPage, countTweet: tweets[1], perPage: perPage});
    
    //res.json({ tweets: tweets[0], page: currentPage, countTweet: tweets[1], perPage: perPage });
}
