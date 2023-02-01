import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <section className="not-found" style={{ textAlign: 'center' }}>
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist!</p>
            <p><Link to="/">Back to home page</Link></p>
        </section>
    )
}