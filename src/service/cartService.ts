import Book from '../model/bookModel';
import User from '../model/userModel';
import Cart, { cartInterface, cartItemInterface } from '../model/cartModel';
import { Types } from 'mongoose';
import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";

export class CartService {
    public static async goToCart(id: string): Promise<object> {
        const cart = await Cart.findOne({ userId: id }).populate('books.book')
        if (!cart) {
            return { message: "Cart Is Empty" };
        }
        return cart
    }


    public static async addToCart(id: string, bookName: string, quantity: number): Promise<object> {
        const book = await Book.findOne({ title: bookName })
        if (!book) {
            return { message: "Book Not Found" };
        }
        const cartItem: cartItemInterface = {
            book: new Types.ObjectId(book._id),
            quantity: quantity
        }
        let cart = await Cart.findOne({ userId: id }).populate('books.book')
        if (!cart) {
            cart = new Cart({ userId: id, books: [cartItem] })

        } else {
            const existingItem = cart.books.find(item => item.book.equals(book._id));
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.books.push(cartItem);
            }
        }
        cart = await cart.save()
        const populatedCart = await Cart.populate(cart, { path: 'books.book', select: 'title' });
        return populatedCart
    }


    public static async decrementBook(id: string, bookName: string): Promise<cartInterface | object> {
        const book = await Book.findOne({ title: bookName });
        if (!book) {
            return { message: "Book not FOund" };
        }
        let cart = await Cart.findOne({ userId: id }).populate('books.book');
        if (!cart) {
            return { message: "Cart Not FOund" };
        }
        const index = cart.books.findIndex(item => item.book._id.equals(book._id));
        if (index === -1) {
            return { message: "Book not Found in the cart" };
        }
        cart.books[index].quantity--;
        if (cart.books[index].quantity === 0) {
            cart.books.splice(index, 1);
        }
        cart = await cart.save();
        return cart
    }


    public static async removeBook(id: string, bookName: string): Promise<cartInterface | object> {
        const book = await Book.findOne({ title: bookName });
        if (!book) {
            return { message: "Book not FOund" };
        }
        let cart = await Cart.findOne({ userId: id }).populate('books.book');
        if (!cart) {
            return { message: "Cart Not FOund" };
        }
        const index = cart.books.findIndex(item => item.book._id.equals(book._id));
        if (index === -1) {
            return { message: "Book not Found in the cart" };
        }
        cart.books.splice(index, 1);
        cart = await cart.save();
        return cart

    }


    public static async emptyCart(id: string): Promise<cartInterface | object> {
        let cart = await Cart.findOne({ userId: id }).populate('books.book');
        if (!cart) {
            return { message: "Cart Not FOund" };
        }
        cart.books = []
        cart = await cart.save()
        return cart
    }


    public static async downloadFile(id: string): Promise<string> {
        const cart = await Cart.findOne({ userId: id });
        if (!cart) {
            return "Cart Not Found";
        }
        const user = await User.findOne({ _id: id });
        const doc = new PDFDocument();
        const fileName = `${user?.username}_cart.pdf`;

        const filePath = path.join("src", "PDF", fileName);

        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(20).text("Cart Details", { align: "center" });
        doc.moveDown();
        doc.fontSize(16).text(`User Name: ${user?.username}`);
        doc.moveDown();
        doc.fontSize(16).text(`Role: ${user?.role}`);
        doc.moveDown();
        doc.fontSize(16).text(`Email: ${user?.email}`);
        doc.moveDown()
        doc.fontSize(16).font("Helvetica-Bold").text("Books:", { underline: true });
        doc.moveDown();


        let Ycod = doc.y;
        doc.font("Helvetica-Bold").text("Book Title", 70, Ycod);
        doc.text("Category", 150, Ycod);
        doc.text("Quantity", 250, Ycod);
        doc.text("Price", 350, Ycod);
        doc.text("Total Price", 450, Ycod);
        doc.moveDown();
        let books = await Book.find({});

        cart.books.forEach((item) => {
            const book = books.find((b) => b._id.equals(item.book));
            if (book) {
                let Ycod = doc.y;
                doc.font("Helvetica").text(book.title, 70, Ycod);
                doc.text(book.categories.toString(), 150, Ycod);
                doc.text(item.quantity.toString(), 250, Ycod);
                doc.text(book.price.toString(), 350, Ycod);
                doc.text(item.totalPrice!.toString(), 450, Ycod);
                doc.moveDown();
            }
        });

        doc.moveDown();
        doc
            .font("Helvetica-Bold")
            .text(`Total Amount: ${cart.totalAmount}`, 350, doc.y);

        doc.end();

        return filePath;
    }
}