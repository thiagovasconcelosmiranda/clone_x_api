import { Response } from "express";
import { getTrending } from "../services/trend";
import { ExtendedRequest } from "../types/extended-request";

export const getTrend = async (req: ExtendedRequest, res: Response) => {
    const trends = await getTrending();
    res.json({trends});
 }