import { Request, Response, NextFunction } from 'express';
import { userService } from "../service/user.service";
import { Types } from "mongoose";
import { appError, errorHandlerMiddleware } from "../error/errorHandler";
export class userControl {


    public static async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, password, email, role } = req.body;

            let newUser = await userService.signUp(username, password, email, role)

            res.status(200).send(newUser)
        } catch (error:any) {
            next(error)
         }
    }


    public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, password } = req.body;
            let user = await userService.login(username, password)
            const sessionUser = req.session as unknown as { user: any }
            if (user) {
                sessionUser.user = user
                console.log(sessionUser.user)
                res.status(200).send(user);
            } else {
                throw new appError('Incorrect Credentials',401);
            }
        }catch (error:any) {
            next(error)
         }
    }

    public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: Types.ObjectId | undefined = req.id
            await userService.logout(id);
            req.session.destroy((err) => {
                if (err) {
                    throw new appError('Failed To logout',401);
                }
                res.status(200).json({ message: 'Logout successful' });
            });

        } catch (error:any) {
            next(error)
         }
    }

    public static async editAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: Types.ObjectId | undefined = req.id
            const { username, email } = req.body;

            let newUser = await userService.editAccount(id, username, email)
            res.status(200).json(newUser);
        } catch (error:any) {
            next(error)
         }
    }


    public static async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: Types.ObjectId | undefined = req.id
            let deletedAccount = await userService.deleteAccount(id)
            if(!deletedAccount){
                throw new appError('Book not found',404)
            }
            res.status(200).json(deletedAccount);

        } catch (error:any) {
            next(error)
         }
    }

}