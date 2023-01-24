import { IUserState } from "./features/user/userSlice";
import { palette } from "./themes";

/**
 * ```typescript
 * interface IProduct {
 *  name: string;
    image: string;
    price: number;
    _id: string;
    owner: string;
 * }
 * ```
 */
export interface IProduct {
    name: string;
    image: string;
    price: number;
    _id: string;
    owner: string;
}

/**
 * ```typescript
 * interface IProductResults {
 *  products: IProduct[],
    total: number
 * }
 * ```
 */
export interface IProductResults {
    products: IProduct[],
    total: number
}

/**
 * ```typescript
 * interface IError {
 *  msg: string;
 * }
 * ```
 */
export interface IError {
    msg: string,
}

/**
 * ```typescript
 * interface IAuthResponse {
 *  _id: string;
    username: string;
    palette: palette;
    theme: 'light' | 'dark'
    accessToken: string;
 * }
 * ```
 */
export interface IAuthResponse extends IUserState {
    accessToken: string;
}