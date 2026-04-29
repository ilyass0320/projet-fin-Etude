import { Link } from "react-router-dom"
export default function NotFound() {
    return (
        <div>
            <div>404 Not Found</div>
            <Link to="/"><button>Go Home</button></Link>
        </div>
    )
}
