import { Response } from "express";
import { feedSchema } from "../schemas/feed";
import { ExtendedRequest } from "../types/extended-request";
import { getUserFollower } from "../services/user";
import { countTweetFeed, findTweetFeed } from "../services/tweet";

export const getFeed = async (req: ExtendedRequest, res: Response) => {
    const safeData = feedSchema.safeParse(req.query);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    let perPage = 4;
    let currentPage = safeData.data.page ?? 0;
    const following = await getUserFollower(req.userSlug as string);
    const countTweet = await countTweetFeed(following);

    const tweets = await findTweetFeed(following, currentPage, perPage);
    res.json({ tweets, page: currentPage, countTweet, perPage, following });
}