import { useLoaderData } from "react-router-dom";
import { useTitle } from "../../../app/hooks";
import { IProduct, IProductResults } from "../../../interfaces";
import { Paginator } from "../../Paginator/Paginator";
import ProductCard from "../../ProductCard/ProductCard";
import Sorter from "../../Sorter/Sorter";
import Profile from "../ProfileTabs";

export default function OwnProducts() {
    const loaderData = useLoaderData() as IProductResults;
    const { products, total } = loaderData;
    useTitle('My products');

    const productCards = products.map(d => (
        <ProductCard key={d._id} _id={d._id} name={d.name} image={d.image} price={d.price} />
    ));

    return (
        <article className="tab">
            <h1>My products</h1>
            <Sorter />
            <Paginator total={total} endpoint="own" />
            {productCards}
            <Paginator total={total} endpoint="own" />
        </article>
    );
}