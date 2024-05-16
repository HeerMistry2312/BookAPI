import { PipelineBuilder } from "../utils/imports";

export class UserPipelineBuilder {
  static userPipeline(id: string): any[] {
    const builder = new PipelineBuilder().match({ _id: id }).project({
      _id: 0,
      username: 1,
      email: 1,
      role: 1,
      isApproved: 1,
      token: 1
    });
    return builder.build();
  }

  static deleteCartPipeline(id: string): any[] {
    const builder = new PipelineBuilder()
      .match({ _id: id })
      .lookup("users", "userId", "_id", "user")
      .unwind("$user")
      .unwind("$books")
      .lookup("books", "books.book", "_id", "bookDetails")
      .unwind("$bookDetails")
      .lookup("users", "bookDetails.author", "_id", "author")
      .unwind("$author")
      .lookup("categories", "bookDetails.categories", "_id", "categoryDetails")
      .group({
        _id: "$_id",
        totalAmount: { $first: "$totalAmount" },
        userName: { $first: "$user.username" },
        role: { $first: "$user.role" },
        email: { $first: "$user.email" },
        books: {
          $push: {
            book: "$bookDetails.title",
            author: "$author.username",
            category: "$categories.name",
            quantity: "$books.quantity",
            totalPrice: "$books.totalPrice",
          },
        },
      })
      .project({
        _id:0,
        userName: 1,
        role: 1,
        email: 1,
        books:1,
        totalAmount:1

      });
    return builder.build();
  }
}

