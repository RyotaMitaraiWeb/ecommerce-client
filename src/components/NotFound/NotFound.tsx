import { Link } from "react-router-dom";
import { useTitle } from "../../app/hooks";

export default function NotFound() {
    useTitle('Not found');
    
    return (
        <section className="not-found" style={{ textAlign: 'center' }}>
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist!</p>
            <p><Link to="/">Back to home page</Link></p>
        </section>
    )
}