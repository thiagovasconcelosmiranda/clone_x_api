import { Request, Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { findUserBySlug, updateUserInfo } from "../services/user";
import { userTweetsSchema } from "../schemas/userTweets";
import { findTweetsByUser } from "../services/tweet";
import { updateUserSchema } from "../schemas/update-user";

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
    
}


export const updateUser = async (req: ExtendedRequest, res: Response) => {
    const safeData = updateUserSchema.safeParse(req.body);

    if (!safeData.success) {
         res.json({ error: safeData.error.flatten().fieldErrors });
         return;
    }
    await updateUserInfo(
        req.userSlug as string,
        safeData.data
    )
    res.json({});  
}
