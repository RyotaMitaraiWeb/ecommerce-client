import { Button } from '@mui/material';
import { IButton } from '../../../interfaces';
import './Button.scss';

export default function DeleteButton(props: IButton) {
    return (
        <Button variant="contained" className="delete-button action-button" href={`/product/${props._id}/delete`}>
            {props.children || (
                <>
                    <span className="fa fa-trash"></span>
                    Delete
                </>
            )}
        </Button>
    )
}