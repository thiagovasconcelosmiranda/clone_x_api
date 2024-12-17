import { prisma } from "../utils/pisma"

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