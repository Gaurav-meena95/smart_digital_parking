import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

function UserLayout() {
    return (
        <>
            <Outlet />
            < BottomNav />
        </>
    )
}
export default UserLayout
