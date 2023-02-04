import { IProductDetails } from '../../src/interfaces';
import { HttpStatus } from '../../src/util/httpstatus.enum';

/**
 * Creates a product seed for details page, which you can use when testing. The created object has the following structure:
 * ```typescript
 * data = {
    _id: '1',
    name: '1',
    price: 1,
    image: 'a',
    isOwner: status === 'owner',
    hasBought: status === 'bought',
    isLogged: status === 'user',
 * }
 * ```
 */
export function createProductsSeed(status: 'owner' | 'bought' | 'guest' | 'user') {
    const data: IProductDetails = {
        _id: '1',
        name: '1',
        price: 1,
        image: 'a',
        owner: 'a',
        isOwner: status === 'owner',
        hasBought: status === 'bought',
        isLogged: status === 'user',
    }

    return {
        status: HttpStatus.OK,
        contentType: 'application/json',
        body: JSON.stringify(data),
    };
}