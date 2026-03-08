import LandingPage from "../features/user/pages/LandingPage";
import BookTutorPage from "../features/user/pages/BookTutorPage";
import FacultyListingPage from "../features/user/pages/FacultyListingPage";
import ChapterListingPage from "../features/user/pages/ChapterListingPage";
import ChapterFacultyPage from "../features/user/pages/ChapterFacultyPage";
import FacultyDetailsPage from "../features/user/pages/FacultyDetailsPage";
import BlogsPage from "../features/user/pages/BlogsPage";
import BlogDetailsPage from "../features/user/pages/BlogDetailsPage";

const userRoutes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/book-tutor",
    element: <BookTutorPage />,
  },
  {
    path: "/faculty",
    element: <FacultyListingPage />,
  },
  {
    path: "/chapters",
    element: <ChapterListingPage />,
  },
  {
    path: "/chapter-faculty",
    element: <ChapterFacultyPage />,
  },
  {
    path: "/faculty-details",
    element: <FacultyDetailsPage />,
  },
  {
    path: "/blogs",
    element: <BlogsPage />,
  },
  {
    path: "/blogs/:id",
    element: <BlogDetailsPage />,
  },
];

export default userRoutes;

