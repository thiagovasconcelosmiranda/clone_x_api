import { Request, Response } from "express";
import { signUpSchema } from "../schemas/signup";
import { signinSchema } from "../schemas/signin";
import { findUserByEmail } from "../services/user";
import slug from 'slug';

export const signin = async (req: Request, res: Response) => {
    const safeData = signinSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
   
}

export const signup = async (req: Request, res: Response) => {
    const safeData = signUpSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    const hasEmail = await findUserByEmail( safeData.data.email);
    if(hasEmail){
        res.json({ error: 'E-mail já existe' });
        return;
    }
    let genSlug = true;
    //const userSlug = slug(safeData.data.name);
    
    
 }