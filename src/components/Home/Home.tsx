import { Button } from "@mui/material";
import { useAppSelector, useTitle } from "../../app/hooks";
import './Home.scss';

export default function Home() {
    useTitle('Home');
    
    return (
        <section className="home">
            <h1>Welcome!</h1>
            <p>To get started:</p>
            <div className="quick-links">
                <QuickLinks />
            </div>
        </section>
    )
}

function QuickLinks() {
    const user = useAppSelector(state => state.user);
    if (user._id) {
        return (
            <>
                <Button className="action-button user-action" variant="contained" href="/product/all">Explore all products</Button>
                <Button className="action-button user-action" variant="contained" href="/product/create">Create your own products</Button>
                <Button className="action-button user-action" variant="contained" href="/profile/settings">Customize the app's appearance</Button>
            </>
        );
    } else {
        return (
            <>
                <Button className="action-button" variant="contained" href="/login">Log in to your profile</Button>
                <Button className="action-button" variant="contained" href="/register">Create an account</Button>
            </>
        );
    }
}