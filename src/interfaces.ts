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