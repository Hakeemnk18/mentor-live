import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin"; 
import { useForgotPassword } from "../hooks/useForgotPassword";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import GoogleLogin from "../components/GoogleLogin";
//import ForgotPasswordModal from "../components/EmailModal";

interface LoginPageProps {
  role: "user" | "admin";
}

const LoginPage = ({ role }: LoginPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: loginMutate } = useLogin();
//   const { mutateAsync: forgotPasswordMutate } = useForgotPassword();

  const [isForgotPsd, setIsForgotPsd] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true)
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    if (formData.password.trim().length < 6) {
      newErrors.password = "Min 6 characters";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      await loginMutate({ data: formData, role });

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      const fieldErrors = handleApiError(err);
      if (fieldErrors) setErrors(fieldErrors);
    }finally{
      setIsSubmitting(false)
    }
  };

  const handleForgotPassword = async (email: string) => {
    //await forgotPasswordMutate({ email });
    setIsForgotPsd(false);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
      
      {/* Brand */}
      <div className="flex flex-col items-center mb-6">
        <div className="h-12 w-12 rounded-xl bg-[#DB313E] text-white flex items-center justify-center font-bold text-lg">
          ML
        </div>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          Sign in to Mentor Live
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {role === "admin" ? "Admin Panel Access" : "Continue learning"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-[#DB313E]/30"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-[#DB313E]/30"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-3 text-xs text-gray-500 cursor-pointer hover:opacity-80"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Forgot password */}
        {role === "user" && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setIsForgotPsd(true)}
              className="text-xs text-[#DB313E] cursor-pointer hover:opacity-80"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#DB313E] text-white py-2.5 rounded-lg text-sm font-medium 
                     cursor-pointer transition-colors hover:bg-[#c72b36]"
        >
          {isSubmitting?"Signing In...":"Sign In"}
        </button>
      </form>

      {/* Google login */}
      {role === "user" && (
        <>
          <div className="mt-5">
            <GoogleLogin />
          </div>

          <p className="text-xs text-center mt-5 text-gray-600">
            New to Mentor Live?{" "}
            <RouterLink
              to="/signup"
              state={{ from }}
              className="text-[#DB313E] font-medium cursor-pointer hover:opacity-80"
            >
              Create account
            </RouterLink>
          </p>
        </>
      )}
    </div>
  </div>
);

};

export default LoginPage;
