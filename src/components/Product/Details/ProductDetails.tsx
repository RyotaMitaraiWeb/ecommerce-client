import { Box, Button, ButtonGroup, Divider, useTheme } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { IProductDetails } from '../../../interfaces';
import BuyButton from '../Buttons/Buy';
import DeleteButton from '../Buttons/Delete';
import EditButton from '../Buttons/Edit';
import './ProductDetails.scss';

export default function ProductDetails() {
    const product = useLoaderData() as IProductDetails;

    const theme = useTheme();
    return (
        <section className="product details">
            <div className="table">
                <h1 style={{ background: theme.palette.primary.main }}>{product.name}</h1>
                <img src={product.image} alt={product.name} />
                <Divider />
                <p className="price">Price: ${product.price.toFixed(2)}</p>
                <div className="actions">
                    <Actions product={product} />
                </div>
            </div>
        </section>
    )
}


function Actions({ product }: { product: IProductDetails }) {
    if (product.isOwner) {
        return (
            <>
                <EditButton _id={product._id} />
                <DeleteButton _id={product._id} />
            </>
        );
    } else if (product.hasBought) {
        return <p>You have already bought this product!</p>;
    } else if (product.isLogged) {
        return <BuyButton _id={product._id} />;
    } else {
        return <p>Log in to interact with this product!</p>;
    }
}