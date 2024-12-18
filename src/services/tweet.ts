import path from "path";
import { prisma } from "../utils/prisma";
import fs, { mkdirSync } from "fs";
//import { getPublicUrl } from "../utils/url";

export const createTweet = async (slug: string, body: string, answer?: number, image?: any) => {
    const dirname = path.join(__dirname, '../../public/posts/');
    var nameImage = null;
    
    if (image !== null) {
        nameImage = image.name;
    }

    const newTweet = await prisma.tweet.create({
        data: {
            body,
            userSlug: slug,
            answerOf: answer ?? 0,
            image: nameImage
        }
    });
    if (image !== null) {
        if (!fs.existsSync(dirname + slug)) {
            mkdirSync(dirname + slug);
        }

        if (fs.existsSync(dirname + slug)) {
            mkdirSync(dirname + slug + '/' + newTweet.id);
        }

        image.mv(dirname + slug + '/' + newTweet.id + '/' + image.name);
    }

    return newTweet;

}

export const findAnswersTweet = async (id: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { answerOf: id }
    });


    return tweets;
}