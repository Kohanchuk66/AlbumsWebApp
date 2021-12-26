import { verify } from "jsonwebtoken";

export function checkAuth (req: any, res: any, next?: (err?: any) => any): any {
    try {
        const token = req.headers?.authorization?.split(' ')[1];

        verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Unauthorized.'
                })
            }
            req.headers['id'] = decoded.userID;
            next();
        })

    } catch (e) {
        return res.status(400).json({
            message: 'Something went wrong.'
        })
    }
}