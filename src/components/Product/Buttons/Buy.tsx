import { Button } from '@mui/material';
import { IButton } from '../../../interfaces';
import './Button.scss';

export default function BuyButton(props: IButton) {
    return (
        <Button variant="contained" className="buy-button action-button" href={`/product/${props._id}/buy`}>
            {props.children || (
                <>
                    <span className="fa fa-shopping-cart"></span>
                    Buy
                </>
            )}
        </Button>
    );
}