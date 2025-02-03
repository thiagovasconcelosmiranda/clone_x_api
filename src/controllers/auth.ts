import { Request, Response } from "express";
import { signUpSchema } from "../schemas/signup";
import { signinSchema } from "../schemas/signin";
import { createUser, findUserByEmail } from "../services/user";
import { hashSync, compare } from 'bcrypt';
import { createJwt } from "../utils/jwt";

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

    const verifyPass = await compare(safeData.data.password, user.password);
    if (!verifyPass) {
        res.status(401).json({ err: 'Acesso negado' });
        return;
    }
    const token = await createJwt(user.slug)
    res.json({
        token,
        user: {
            name: user.name,
            slug: user.slug,
            avatar: user.avatar
        }
    });
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
    
    let name = safeData.data.name.charAt(0).toUpperCase() + safeData.data.name.slice(1).toLowerCase();

    const newUser = await createUser({
        slug: safeData.data.name.toLowerCase(),
        name,
        email: safeData.data.email,
        password: hasPassword
    });

    const userSlug: string | any = newUser?.name;
    const token = createJwt(userSlug);

    res.status(201).json({
        token,
        user: {
            name: 'name',
            slug: newUser?.slug,
            avatar: newUser?.avatar
        }
    })
}