import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/addTweet";
import { createAnswers, createTweet, findAnswersTweet, findTweet, checkIfAnswerIsByUser, unlikeTweet, likeTweet } from "../services/tweet";
import { AddAnswerSchema } from "../schemas/addAnswer";
import { addHashtag } from "../services/trend";

export const getTweet = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;
    const tweet = await findTweet(parseInt(id));
    if (!tweet){
        res.json({ error: 'Tweet inexistente' });
      return;
    } 
    res.json(tweet);
}

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
        safeData.data.answer ? parseInt(safeData.data.answer) : 0,
        file
    );
    
    const hashtags = safeData.data.body.match(/#[a-zA-Z0-r9_]+/g);
    if(hashtags){
      for(let hashtag of hashtags){
         if(hashtag.length >= 2){
             await addHashtag(hashtag);
         }
      }
    }

    res.json(newTweet);
}

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;
    const answers = await findAnswersTweet(parseInt(id));
    res.json({ answers: answers });
}

export const addAnswers = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;
    const safeData = AddAnswerSchema.safeParse(req.body);

    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    let file = null;

    if (req.files) {
        file = req.files.image;
    }

    const answer = await createAnswers(
        req.body.body,
        file,
        req.userSlug as string,
        parseInt(id)
    )

    res.json(answer);
}

export const likeToggle = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const liked = await checkIfAnswerIsByUser(
        req.userSlug as string,
        parseInt(id)
    )
    let like: boolean = false;

    if (liked) {
        unlikeTweet(
            req.userSlug as string,
            parseInt(id)
        );
        like = false;

    } else {
        likeTweet(
            req.userSlug as string,
            parseInt(id)
        );
        like = true;
    }
    res.json({ like: like });
}
