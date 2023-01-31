import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { ITransaction } from '../../../interfaces';
import './Transactions.scss';

export default function Transactions() {
    const data = useLoaderData() as ITransaction[];
    const transactions = data.map(toTableRow);
    
    return (
        <article>
            <h1>My purchases</h1>
            <TableContainer component={Paper} id="transactions-table">
                <Table>
                    <TableHead sx={{backgroundColor: 'divider'}}>
                        <TableRow>
                            <TableCell align="center">Product</TableCell>
                            <TableCell align="center">Purchase number</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions}
                    </TableBody>
                </Table>
            </TableContainer>
        </article>
    )
}

function toTableRow(transaction: ITransaction) {    
    return (
        <TableRow key={transaction._id}>
            <TableCell align="center" sx={{fontWeight: 'bold'}}>{transaction.product.name}</TableCell>
            <TableCell align="center">#{transaction._id}</TableCell>
            <TableCell align="center">{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
            <TableCell align="center">
                <Button variant="contained" href={`/product/${transaction.product._id}`}>Link to product</Button>
            </TableCell>
        </TableRow>
    );
}