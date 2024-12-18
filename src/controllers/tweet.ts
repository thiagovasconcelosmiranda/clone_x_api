import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/addTweet";
import { createTweet, findAnswersTweet } from "../services/tweet";

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

    res.json(newTweet);
}

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;
    const answers = await findAnswersTweet(parseInt(id));
    res.json({ answers: answers });
}