import { IProductCard } from '../src/components/ProductCard/ProductCard';

/**
 * Use this to generate product cards for results pages to test more easily
 */
export function createCardsSeed(amount: number, total = amount) {
    const cards: IProductCard[] = [];
    for (let i = 1; i <= amount; i++) {
        cards.push({
            _id: i.toString(),
            name: i.toString(),
            price: i,
            image: 'a',
        });
    }

    return {
        products: cards,
        total,
    }
}