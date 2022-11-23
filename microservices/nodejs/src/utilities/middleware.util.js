import config from "../config.js";
import { ResponseData } from "./responseData.util.js";
import jwt from "jsonwebtoken"

export const validateToken = async (req, res, next) => {
    try {
        let tokenB = req.header('authorization') || req.cookies.token;
        let split = tokenB.split(' ')
        let token = split[1]
        jwt.verify(token, config.jwtKey, (err, decoded) => {
            req.decoded = decoded;
            if (err) {
                if (err.message === 'jwt expired') {
                    next();
                } else {
                    res.status(401).json(new ResponseData(false, null, 'Token cannot validate'));
                }
            } else {
                next();
            }
        })
    } catch {
        res.status(401).json(new ResponseData(false, null, 'Token cannot validate'));
    }
};

