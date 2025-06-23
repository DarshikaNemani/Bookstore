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

export interface User {
  _id: string;
  fullName: string;
}

export interface Feedback {
  approveComment: boolean;
  _id: string;
  user_id: User;
  product_id: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  result: Feedback[];
}

export interface WishlistItem {
  _id: string;
  user_id: string;
  product_id: Book;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  result: WishlistItem[];
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_quantity: number;
  product_price: number;
}

export interface OrderRequest {
  orders: OrderItem[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  result?: any;
}