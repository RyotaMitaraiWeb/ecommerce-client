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
 * interface IProductDetails {
    image: string;
    price: number;
    _id: string;
    owner: string;
    hasBought: boolean;
    isOwner: boolean;
    isLogged: boolean;
    ```
}
 */
export interface IProductDetails extends IProduct {
    hasBought: boolean;
    isOwner: boolean;
    isLogged: boolean;
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

/**
 * ```typescript
 * interface IButton {
    _id: string;
    children?: React.ReactNode;
}
 * ```
 */
export interface IButton {
    _id: string;
    children?: React.ReactNode;
}