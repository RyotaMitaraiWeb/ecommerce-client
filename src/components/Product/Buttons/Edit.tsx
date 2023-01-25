import { Button } from '@mui/material';
import { IButton } from '../../../interfaces';
import './Button.scss';

export default function EditButton(props: IButton) {
    return (
        <Button variant="contained" className="edit-button action-button" href={`/product/${props._id}/edit`}>
            {props.children || (
                <>
                    <span className="fa fa-pencil"></span>
                    Edit
                </>
            )}
        </Button>
    );
}