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
      avatar: getPublicUrl(user.avatar, 'avatars', user.slug),
      cover: getPublicUrl(user.cover, 'covers', user.slug)
    }
  }

  return null;
}

export const findUserBySlug = async (slug: string) => {
  const user = await prisma.user.findFirst({
    select: {
      avatar: true,
      bio: true,
      cover: true,
      slug: true,
      name: true,
      like: true
    },
    where: { slug }
  });

  if (user) {
    return {
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

  if (newUser) {
    return {
      ...newUser
    }
  }
}

export const getUserFollower = async (slug: string) => {
  const followers = [];
  const reqFollow = await prisma.follow.findMany({
    select: { userSlug: true, user2Slug: true },
    where: { user2Slug: slug }
  });

  for (let reqItem of reqFollow) {
    followers.push(reqItem.userSlug);

  }
  return followers;
}

export const getUserFollowing = async (slug: string) => {
  const following = [];
  const reqFollow = await prisma.follow.findMany({
    select: { user2Slug: true },
    where: { userSlug: slug }
  });

  for (let reqItem of reqFollow) {
    following.push(reqItem.user2Slug);

  }
  return following;
}

export const getUserSuggestions = async (slug: string) => {
  const following = await getUserFollowing(slug);

  const followingPlusMe = await [...following, slug];

  console.log(followingPlusMe);

  type Suggestion = Pick<Prisma.UserGetPayload<Prisma.UserDefaultArgs>,
    "name" | "avatar" | "slug"
  >;

  const suggestions: Suggestion[] = await prisma.$queryRaw`
   SELECT
    name, avatar, slug
    FROM "User"
    WHERE slug NOT IN (${followingPlusMe.join(',')})
    ORDER BY  RANDOM()
    LIMIT 2;
   `;

  for (let sugIndex in suggestions) {
    suggestions[sugIndex].avatar = getPublicUrl(
      suggestions[sugIndex].avatar,
      'avatars',
      suggestions[sugIndex].slug);
  }
  return suggestions;
}

export const updateUserInfo = async (slug: string, data: Prisma.UserUpdateInput) => {

}

export const checkIfFollows = async (userSlug: string, user2Slug: string) => {
  const follows = await prisma.follow.findFirst({
    where: { userSlug, user2Slug }
  });
  return follows ? true : false;
}

export const follow = async (userSlug: string, user2Slug: string) => {
  await prisma.follow.create({
    data: { userSlug, user2Slug }
  });
}

export const unfollow = async (userSlug: string, user2Slug: string) => {
  await prisma.follow.deleteMany({
    where: { userSlug, user2Slug }
  });
}
export const getUserFollowingCount = async (slug: string) => {
  const reqFollow = await prisma.follow.count({
    where: { userSlug: slug }
  });
  return reqFollow;
}

export const getUserFollowersCount = async (slug: string) => {
  const reqFollow = await prisma.follow.count({
    where: { user2Slug: slug }
  });

  return reqFollow;
}

