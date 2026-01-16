import AdminBootstrap from "../features/admin/components/AdminBootstrap"
import ChapterPage from "../features/admin/pages/ChapterTable"
import ClassPage from "../features/admin/pages/ClassTable"
import FacultyPage from "../features/admin/pages/FacultyTable"
import Home from "../features/admin/pages/Home"
import SubjectPage from "../features/admin/pages/SubjectTable"
import SyllabusPage from "../features/admin/pages/SyllabusTable"
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
    },
    {
        path:"syllabus",
        element:(
        <AdminBootstrap>
            <SyllabusPage/>
        </AdminBootstrap>
         
            
        )
    },
    {
        path:"subjects",
        element:(
        <AdminBootstrap>
            <SubjectPage/>
        </AdminBootstrap>
         
            
        )
    },
    {
        path:"chapters",
        element:(
        <AdminBootstrap>
            <ChapterPage/>
        </AdminBootstrap>
         
            
        )
    }
]

export default adminRoutes