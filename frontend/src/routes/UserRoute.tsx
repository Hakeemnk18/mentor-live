import LandingPage from "../features/user/pages/LandingPage";
import BookTutorPage from "../features/user/pages/BookTutorPage";
import FacultyListingPage from "../features/user/pages/FacultyListingPage";
import ChapterListingPage from "../features/user/pages/ChapterListingPage";
import ChapterFacultyPage from "../features/user/pages/ChapterFacultyPage";
import FacultyDetailsPage from "../features/user/pages/FacultyDetailsPage";

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
];

export default userRoutes;

