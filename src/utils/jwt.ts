import { NextFunction, Response } from "express";
import Jwt from 'jsonwebtoken';
import { ExtendedRequest } from "../types/extended-request";
import { findUserBySlug } from "../services/user";


export const createJwt = (slug: string) => {
    return Jwt.sign({ slug }, process.env.JWT_SECRET as string)
}

export const verifyJwt = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ error: 'Acesso negado!' });
        return;
    }
    const token = authHeader.split(' ')[1];
    Jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        async (error, decoded: any) => {
            if (error) {
                res.status(401).json({ error: 'Acesso negado!' });
                return;
            }
            const user = await findUserBySlug(decoded.slug);
            if (!user) {
                res.status(401).json({ error: 'Acesso negado!' });
                return;
            }
            req.userSlug = user?.slug;
            next();
        }
    )
}