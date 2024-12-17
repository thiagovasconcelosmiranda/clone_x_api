import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/addTweet";
import { createTweet } from "../services/tweet";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
    const safeData = addTweetSchema.safeParse(req.body);
    var file = null;
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    
    if (req.files) {
        file = req.files.image
    }

    const newTweet = await createTweet(
         req.userSlug as string,
         safeData.data.body,
        )
        
    res.json(newTweet);
}