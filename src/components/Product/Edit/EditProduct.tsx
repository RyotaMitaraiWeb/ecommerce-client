import { FormControl, Button } from '@mui/material';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { openSnackbar } from '../../../features/snackbar/snackbarSlice';
import { IProduct, IError } from '../../../interfaces';
import { put } from '../../../util/requests/requests';
import { splitErrorMessagesIntoMultipleLines } from '../../../util/splitErrorMessagesIntoMultipleLines/splitMessagesIntoMultipleLines';
import ValidationField from '../../ValidationField/ValidationField';
import './EditProduct.scss';

export default function EditProduct() {
    const product: IProduct = useLoaderData() as IProduct;
    
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    function changeName(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        setName(value);
    }

    function changePrice(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = Number(target.value);
        if (!Number.isNaN(value)) {
            const price = Number(value.toFixed(2));
            setPrice(price);

        } else {
            setPrice(1);
        }
    }

    async function editProduct(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { res, data } = await put<IError[]>(`/product/${product._id}`, {
            name, price
        });

        if (res.ok) {
            navigate(`/product/${product._id}`);
        } else {
            const message = splitErrorMessagesIntoMultipleLines(data);
            dispatch(openSnackbar(
                {
                    message,
                    severity: 'error',
                }
            ));
        }
    }

    return (
        <section className="product">
            <h1>Edit {product.name}</h1>
            <FormControl component="form" className="form" onSubmit={editProduct}>
                <ValidationField
                    id="name"
                    name="name"
                    label="Product name"
                    className="field"
                    helperText="Product name must be between 5 and 100 characters"
                    value={name}
                    onChange={changeName}
                    required={[true, 'Product name is required']}
                    minLength={[5, 'Product name must be at least five characters']}
                    maxLength={[100, 'Product name must not be longer than 100 characters']}
                />
                <ValidationField
                    id="price"
                    name="price"
                    label="Price"
                    className="field"
                    helperText="Price must be at least $0.01"
                    value={price}
                    onChange={changePrice}
                    required={[true, 'Price is required']}
                    min={[0.01, 'Price must be at least $0.01']}
                    type="number"
                />
                <Button
                    type="submit"
                    className="submit"
                    variant="contained"
                    disabled={!(name && price)}
                >
                    <span className="fa fa-pencil"></span>
                    Edit Product
                </Button>
            </FormControl>
        </section>
    )
}