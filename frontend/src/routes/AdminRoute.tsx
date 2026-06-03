import AdminBootstrap from "../features/admin/components/AdminBootstrap"
import LeadsPage from "../features/admin/pages/LeadsPage"
import ChapterPage from "../features/admin/pages/ChapterTable"
import ClassPage from "../features/admin/pages/ClassTable"
import FacultyPage from "../features/admin/pages/FacultyTable"
import FacultyDetailPage from "../features/admin/pages/FacultyDetailPage"
import Home from "../features/admin/pages/Home"
import SubjectPage from "../features/admin/pages/SubjectTable"
import SyllabusPage from "../features/admin/pages/SyllabusTable"
import BookingsPage from "../features/admin/pages/BookingsPage"
import TestimonialsPage from "../features/admin/pages/TestimonialsPage"
import BlogsPage from "../features/admin/pages/BlogsPage"
import BannersPage from "../features/admin/pages/BannersPage"
import StudentsPage from "../features/admin/pages/StudentsPage"
import UsersPage from "../features/admin/pages/UsersPage"
import AdminDashboard from "../features/admin/pages/AdminDashboard"
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
        path:"faculty/:id",
        element:(
        <AdminBootstrap>
            <FacultyDetailPage/>
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
    },
    {
        path: "bookings",
        element: (
            <AdminBootstrap>
                <BookingsPage />
            </AdminBootstrap>
        )
    },
    {
        path: "testimonials",
        element: (
            <AdminBootstrap>
                <TestimonialsPage />
            </AdminBootstrap>
        )
    },
    {
        path: "blogs",
        element: (
            <AdminBootstrap>
                <BlogsPage />
            </AdminBootstrap>
        )
    },
    {
        path: "banners",
        element: (
            <AdminBootstrap>
                <BannersPage />
            </AdminBootstrap>
        )
    },
    {
        path: "students",
        element: (
            <AdminBootstrap>
                <StudentsPage />
            </AdminBootstrap>
        )
    },
    {
        path: "users",
        element: (
            <AdminBootstrap>
                <UsersPage />
            </AdminBootstrap>
        )
    },
    {
        path: "leads",
        element: (
            <AdminBootstrap>
                <LeadsPage />
            </AdminBootstrap>
        )
    },
]
export default adminRoutes