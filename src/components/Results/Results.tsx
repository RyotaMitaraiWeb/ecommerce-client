import { useLoaderData, useSearchParams } from "react-router-dom";
import { Paginator } from "../Paginator/Paginator";
import { IProductResults } from "../../interfaces";
import ProductCard from "../ProductCard/ProductCard";
import Sorter from "../Sorter/Sorter";

/**
 * ```typescript
 * interface IResults {
 *  endpoint: 'search' | 'all';
 * }
 * ```
 */
export interface IResults {
    endpoint: 'search' | 'all';
}

/**
 * This component renders a list of products.
 * Pass ``endpoint`` with ``search`` to render results from a search
 * or ``all`` to render a catalogue of all products.
 * **Note:** this uses pagination.
 */
export default function Results(props: IResults) {
    const data = useLoaderData() as IProductResults;
    const { products, total } = data;

    const [searchParams] = useSearchParams();

    const cards = products.map(product => (
        <ProductCard
            key={product._id}
            _id={product._id}
            image={product.image}
            name={product.name}
            price={product.price}
        />
    ));

    const h1 = props.endpoint === 'search'
        ? <h1>Search results for "{searchParams.get('name')}"</h1>
        : <h1>All products</h1>;

    if (!cards.length) {
        return (
            <section>
                {h1}
                <p className="no-results">No products found!</p>
            </section>
        );
    }

    return (
        <section>
            {h1}
            <Sorter />
            <Paginator total={total} endpoint={props.endpoint} />
            {cards}
            <Paginator total={total} endpoint={props.endpoint} />
        </section>
    );
}