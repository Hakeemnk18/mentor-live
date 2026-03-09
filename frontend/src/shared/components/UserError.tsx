import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function UserError() {
  const error = useRouteError();
  console.error("User Route Error:", error);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-5 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
        Oops! Something went wrong.
      </h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : error instanceof Error
          ? error.message
          : "We're sorry, but the page you were trying to view encountered an unexpected error."}
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-6 py-2.5 rounded-md bg-[#DB313E] text-white font-medium shadow-md hover:bg-[#c42c37] hover:shadow-lg transition-all"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
