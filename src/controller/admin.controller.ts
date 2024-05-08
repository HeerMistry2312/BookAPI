import { Request, Response , NextFunction} from "express";
import { adminService } from "../service/admin.service";
import { BookInterface } from "../interfaces/book.interface";
export class adminControl {
    public static async approveAuthor(req: Request, res: Response,next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            let user = await adminService.approveAuthor(id)
            res.status(200).send(user)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async approveAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            let user = await adminService.approveAdmin(id)
            res.status(200).send(user)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const Data: BookInterface = req.body;
            let book = await adminService.createBook(Data)
            res.status(200).send(book)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const body: BookInterface = req.body;
            let update = await adminService.updateBook(id, body)
            res.status(200).send(update)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            let book = await adminService.deleteBook(id)
            res.status(200).send(book)
        }  catch (error:any) {
            next(error)
         }
    }

    public static async listofPendingReq(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, pageSize = 2 } = req.query;
            const un = await adminService.listofPendingReq(+page, +pageSize)
            res.status(200).send(un)
        }  catch (error:any) {
            next(error)
         }
    }

}