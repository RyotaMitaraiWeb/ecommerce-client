import { Button, FormControl } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useTitle } from '../../../app/hooks';
import { openSnackbar } from '../../../features/snackbar/snackbarSlice';
import { IError, IProduct } from '../../../interfaces';
import { post } from '../../../util/requests/requests';
import { splitErrorMessagesIntoMultipleLines } from '../../../util/splitErrorMessagesIntoMultipleLines/splitMessagesIntoMultipleLines';
import ValidationField from '../../ValidationField/ValidationField';
import './CreateProduct.scss';

export default function CreateProduct() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(1);
    const [image, setImage] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useTitle('Create a new product');

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

    function changeImage(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        setImage(value);
    }

    async function createProduct(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { res, data } = await post<IProduct | IError[]>('/product', {
            name, price, image
        });

        if (res.ok) {
            const product = data as IProduct;
            navigate(`/product/${product._id}`);
        } else {
            const errors = data as IError[];
            const message = splitErrorMessagesIntoMultipleLines(errors);
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
            <h1>Create a new product</h1>
            <FormControl component="form" className="form" onSubmit={createProduct}>
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
                <ValidationField
                    id="image"
                    name="image"
                    label="Image URL"
                    className="field"
                    value={image}
                    onChange={changeImage}
                    required={[true, 'Image is required']}
                />
                <Button
                    type="submit"
                    className="submit"
                    variant="contained"
                    disabled={!(image && name && price)}
                >
                    <span className="fa fa-plus"></span>
                    Create Product
                </Button>
            </FormControl>
        </section>
    )
}