import { prisma } from "../utils/pisma"
import { getPublicUrl } from "../utils/url";

export  const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findMany({
    where:{email}
  });

  if(user){
    return {
        ...user,
    }
  }
}