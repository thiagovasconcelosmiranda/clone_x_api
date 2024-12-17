import path from "path";

export const createTweet = async (slug: string, body: string, answer?: number, image?: any) => {
    const dirname = path.join(__dirname, '../../public/posts/');
    return dirname;
}