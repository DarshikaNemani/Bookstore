export interface Book {
  _id: string;
  bookName: string;
  author: string;
  description: string;
  price: number;
  discountPrice: number;
  bookImage: string | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  result: Book[];
}

export interface BookResponse {
  success: boolean;
  message: string;
  result: Book;
}