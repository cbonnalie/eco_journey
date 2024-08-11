import {Outlet, Navigate} from "react-router-dom"

const ProtectedRoutes = ({user}) => {
    if (!user.id || !user.username) {
        return <Navigate to="/login" />
    }
    return <Outlet />
}

export default ProtectedRoutes