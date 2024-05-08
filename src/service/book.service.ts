import Book from '../model/book.model';
import User from '../model/user.model';
import { Role } from '../interfaces/user.interface';
import { InternalServerError } from '../error/errorHandler';
import Category from '../model/category.model';
import { Types } from 'mongoose';

export class bookService {
    public static async showBook(id: string, page: number, pageSize: number): Promise<Object> {
        const totalCount = await Book.countDocuments({ title: id });
        const totalPages = Math.ceil(totalCount / pageSize);
        if (page < 1 || page > totalPages) {
            throw new InternalServerError('Invalid page number');
        }
        const skip = (page - 1) * pageSize;
        let book = await Book.find({ title: id }).skip(skip).limit(pageSize).populate({ path: 'author', select: ['username','-_id'] }).populate({
            path: 'categories',
            select: ['name','-_id']
        }).select('-_id')
        if (!book) {
            throw new InternalServerError('Book not Found');
        }
        return {
            books: book,
            totalBooks: totalCount,
            totalPages: totalPages,
            currentPage: page
        };
    }


    public static async showAllBooks(page: number, pageSize: number): Promise<Object> {
        const totalCount = await Book.countDocuments();
        const totalPages = Math.ceil(totalCount / pageSize);
        if (page < 1 || page > totalPages) {
            throw new InternalServerError('Invalid page number');
        }
        const skip = (page - 1) * pageSize;
        let book = await Book.find().skip(skip).limit(pageSize).populate({ path: 'author', select: ['username','-_id'] }).populate({
            path: 'categories',
            select: ['name','-_id']
        }).select('-_id')
        if (!book) {
            throw new InternalServerError('Book not Found');
        }
        return {
            books: book,
            totalBooks: totalCount,
            totalPages: totalPages,
            currentPage: page
        };
    }


    public static async showByCategory(category: string, page: number, pageSize: number): Promise<Object> {
        const findCategory = await Category.findOne({ name: category })
        let categoryid: Types.ObjectId = findCategory!._id
        const totalCount = await Book.countDocuments({ categories: categoryid });
        const totalPages = Math.ceil(totalCount / pageSize);
        if (page < 1 || page > totalPages) {
            throw new InternalServerError('Category Not FOund');
        }
        const skip = (page - 1) * pageSize;
        const book = await Book.find({ categories: categoryid }).skip(skip).limit(pageSize).populate({ path: 'author', select: ['username','-_id'] }).populate({
            path: 'categories',
            select: ['name','-_id']
        }).select('-_id');
        if (!book) {
            throw new InternalServerError('Book not Found');
        }
        return {
            books: book,
            totalBooks: totalCount,
            totalPages: totalPages,
            currentPage: page
        };
    }


    public static async showByAuthor(id: string, page: number, pageSize: number): Promise<Object> {
        let author = await User.findOne({ username: id, role: Role.Author })
        if (!author) {
            throw new InternalServerError(`No Author found with name of ${id}`);
        }
        const totalCount = await Book.countDocuments({ author: author._id });
        const totalPages = Math.ceil(totalCount / pageSize);
        if (page < 1 || page > totalPages) {
            throw new InternalServerError('Author Not FOund');
        }
        const skip = (page - 1) * pageSize;
        const book = await Book.find({ author: author._id }).skip(skip).limit(pageSize).populate({ path: 'author', select:  ['username','-_id'] }).populate({
            path: 'categories',
            select: ['name','-_id']
        }).select('-_id')
        if (!book) {
            throw new InternalServerError(`No Book found with name of author as ${id}`);
        }
        return {
            books: book,
            totalBooks: totalCount,
            totalPages: totalPages,
            currentPage: page
        };
    }
}