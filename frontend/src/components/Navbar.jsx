import { Link } from 'react-router-dom';

const NavBar = () => {
    const linkStyle = {
        color: '#61dafb',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '5px 10px',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
        marginRight: '5rem'
    };

    return (
        <nav style={{ 
            position: 'fixed',
            top: '0',
            left: '0',
            backgroundColor: '#16191f', 
            display: 'flex', 
            gap: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            alignItems: 'center',
            height: '10vh',
            width: '100%'
        }}>
            <h2 style={{ color: 'white', margin: '0',marginLeft: '5rem', marginRight: 'auto' }}>Nimap Machine Test</h2>
            
            <Link to="/categories" style={linkStyle}>Categories</Link>
            <Link to="/products" style={linkStyle}>Products</Link>
        </nav>
    );
};

export default NavBar;