import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { register as registerUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Input from "../components/Input";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((s) => s.auth);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setFormError(null);
    const result = await dispatch(registerUser(data));
    if (registerUser.rejected.match(result)) {
      const msg = (result.payload as string) || "Registration failed";
      setFormError(msg);
      toast.error(msg);
    } else {
      toast.success("Account created!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-2">Join EventHub today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register("name", { required: "Name is required" })}
              label="Full Name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              error={errors.name?.message}
            />

            <Input
              {...register("email", { required: "Email is required" })}
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
            />

            <Input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password?.message}
            />

            <Button type="submit" loading={loading} fullWidth>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
