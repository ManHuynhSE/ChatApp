
import Navbar from '../navbar/navbar.jsx'


function Layout({ children }) {
    return (
        <div>
            <Navbar></Navbar>
            <div >
                {children}
            </div>
        </div>
    )
}

export default Layout