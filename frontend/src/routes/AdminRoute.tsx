import AdminBootstrap from "../features/admin/components/AdminBootstrap"
import ClassPage from "../features/admin/pages/ClassTable"
import FacultyPage from "../features/admin/pages/FacultyTable"
import Home from "../features/admin/pages/Home"
import AdminDashboard from "../features/auth/pages/AdminDashboard"
import LoginPage from "../features/auth/pages/LoginPage"


const adminRoutes = [
   {
        path:"login",
        element:(
            
         <LoginPage role="admin" />
            
        )
    },

    {
        path:"dashboard",
        element:(
        <AdminBootstrap>
            <AdminDashboard/>
        </AdminBootstrap>
         
            
        )
    },
    {
        path:"faculty",
        element:(
        <AdminBootstrap>
            <FacultyPage/>
        </AdminBootstrap>
         
            
        )
    },
     {
        path:"class",
        element:(
        <AdminBootstrap>
            <ClassPage/>
        </AdminBootstrap>
         
            
        )
    }
]

export default adminRoutes