import { Link } from "react-router-dom";
function Navbar() {
    return (
        <nav style={{ marginBottom: "20px" }}>
            <Link to="/" style={{ marginRight: "10px" }}>
            Login
            </Link>
            <Link to="/dashboard" style={{ marginRight: "10px" }}>
            Dashboard
            </Link>
            <Link to="/groups" style={{ marginRight: "10px" }}>
            Groups
            </Link>
            <Link to="/profile" style={{ marginRight: "10px" }}>
            Profile
            </Link>
            </nav>
    );
}
export default Navbar;