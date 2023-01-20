import { Button, Card, CardActions, CardHeader, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";
import './ProductCard.scss';

/**
 * ```typescript
 * interface IProductCard {
 *  _id: string;
    name: string;
    image: string;
    price: number;
 * }
 * ```
 */
export interface IProductCard {
    _id: string;
    name: string;
    image: string;
    price: number;
}


/**
 * This component renders details about a product in the context of a list of products.
 * This is typically used in search results or a catalogue of products.
 * **Note:** the price displayed is rounded to the second decimal.
 */
export default function ProductCard(props: IProductCard) {
    return (
        <Card variant="outlined" key={props._id} component="article" className="card">
            <CardHeader className="card-title" title={props.name} subheader={`Price: $${props.price.toFixed(2)}`} sx={{ backgroundColor: 'primary.main' }} />
            <CardMedia component="img" image={props.image} alt="" />
            <CardActions className="actions">
                <Button variant="contained" href={`/product/${props._id}`}>More Details</Button>
            </CardActions>
        </Card>
    );
}