import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function AdminError() {
  const error = useRouteError();
  console.error("Admin Route Error:", error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
        <div className="bg-red-50 p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Dashboard Error</h2>
          <p className="text-sm text-gray-600">
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText} - ${error.data}`
              : error instanceof Error
              ? error.message
              : "An unexpected runtime error crashed this section of the dashboard."}
          </p>
        </div>

        <div className="p-6 bg-white space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Don't worry, the rest of the application is still running. You can navigate safely to the dashboard overview.
          </p>

          <a
            href="/admin"
            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#DB313E] hover:bg-[#c42c37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DB313E] transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
