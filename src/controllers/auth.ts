import { Request, Response } from "express";
import { signUpSchema } from "../schemas/signup";
import { signinSchema } from "../schemas/signin";
import { createUser, findUserByEmail } from "../services/user";
import { hashSync } from 'bcrypt';

export const signin = async (req: Request, res: Response) => {
    const safeData = signinSchema.safeParse(req.body);

    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    
    const user = await findUserByEmail(safeData.data.email);
    if (!user) {
        res.status(401).json({ error: 'Acesso negado' });
        return;
    } 
    res.json({});
}

export const signup = async (req: Request, res: Response) => {
    const safeData = signUpSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    const hasEmail = await findUserByEmail(safeData.data.email);

    if (hasEmail) {
        res.json({ error: 'E-mail já existe!' });
        return;
    }

    const hasPassword = await hashSync(safeData.data.password, 10);

    const newUser = await createUser({
        slug: safeData.data.name,
        name: safeData.data.name,
        email: safeData.data.email,
        password: hasPassword
    });

    res.json(newUser);
}