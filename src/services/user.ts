import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma"
import { getPublicUrl } from "../utils/url";

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email }
  });

  if (user) {
    return {
      ...user,
      avatar: getPublicUrl(user.avatar,'avatars', user.slug),
      cover: getPublicUrl(user.cover, 'covers', user.slug)
    }
  }

  return null;
}

export const findUserBySlug = async (slug: string) => {
  const user = await prisma.user.findFirst({
    select:{
      avatar: true,
      bio: true,
      cover: true,
      slug: true,
      name: true,
      like: true
    },
    where:{slug}
  });

  if(user){
    return{
      ...user, 
      avatar: getPublicUrl(user.avatar, 'avatars', user.slug),
      cover: getPublicUrl(user.cover, 'covers', user.slug)
    }
  }
  return null;

}

export const createUser = async (data: Prisma.UserCreateInput) => {
   const newUser = await prisma.user.create({
    data
   });

   if(newUser){
     return {
      ...newUser
     }
   }
}

