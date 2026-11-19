import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Bear from "../../features/user/components/ui/Bear";

export default function UserError() {
  const error = useRouteError();
  console.error("User Route Error:", error);

  return (
    // Rendered in place of the user layout, so it applies the .ml-site theme itself
    <div className="ml-site min-h-[80vh] flex flex-col items-center justify-center p-5 text-center gap-3">
      <div className="w-[130px] mb-2">
        <Bear pose="lost" eager />
      </div>

      <h1 className="m-0 font-display font-extrabold text-[clamp(28px,4vw,40px)] text-ml-deep tracking-[-0.03em]">
        Oops! Something went wrong.
      </h1>
      <p className="m-0 text-ml-muted max-w-md mx-auto mb-5 leading-relaxed">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : error instanceof Error
          ? error.message
          : "We're sorry, but the page you were trying to view encountered an unexpected error."}
      </p>

      <div className="flex flex-wrap justify-center items-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="h-[52px] px-6 rounded-full border-2 border-ml-line bg-white text-ml-deep font-extrabold cursor-pointer transition hover:border-ml-violet"
        >
          Try Again
        </button>
        <a
          href="/"
          className="h-[52px] px-6 rounded-full bg-ml-violet text-white font-extrabold inline-flex items-center transition hover:-translate-y-0.5 hover:text-white"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
