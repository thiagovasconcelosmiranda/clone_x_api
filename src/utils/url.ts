export const getPublicUrl = (url: string, dir: string, slug: string) => {
    //let BASE_URL = window.location.href;
    return `${process.env.BASE_URL}/${dir}/${slug}/${url}`;
}