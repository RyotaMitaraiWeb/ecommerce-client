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
        <section className="product">
            <div className="table">
                <h1 style={{ background: theme.palette.primary.main }}>{product.name}</h1>
                <img src={product.image} alt={product.name} />
                <Divider />
                <p className="price">Price: ${product.price.toFixed(2)}</p>
                <div className="actions">
                    {product.isOwner
                        ? (
                            <>
                                <EditButton _id={product._id} />
                                <DeleteButton _id={product._id} />
                            </>
                        )
                        : null
                    }
                    {!product.hasBought && !product.isOwner && product.isLogged
                        ? <BuyButton _id={product._id} />
                        : null
                    }
                    {product.hasBought
                        ? <p>You have already bought this product!</p>
                        : null
                    }
                    {!product.isLogged
                        ? <p>Log in to interact with this product!</p>
                        : null
                    }
                </div>
            </div>
        </section>
    )
}