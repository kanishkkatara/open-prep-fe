import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useUser } from "../../context/UserContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, registerWithGoogle } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await login(email, password);
      navigate("/onboarding/welcome");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (res: CredentialResponse) => {
    if (!res.credential) {
      setError("Google sign-in failed");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      // Use the same Google handler from context
      await registerWithGoogle(res.credential);
      navigate("/onboarding/welcome");
    } catch {
      setError("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleError = () => {
    setError("Google sign-in was unsuccessful.");
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Log in / Sign up
        </h2>
        {/* <p className="text-gray-600 mt-2">
          Welcome back! Please enter your details.
        </p> */}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* <Input
          label="Email"
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={18} className="text-gray-500" />}
          required
        />

        <Input
          label="Password"
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={18} className="text-gray-500" />}
          required
        /> */}

        {/* <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </a>
          </div>
        </div> */}

        {/* <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          leftIcon={<LogIn size={18} />}
        >
          Sign in
        </Button>

        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-600 text-sm">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div> */}

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
        </div>

        {/* <p className="text-center text-sm text-gray-600 mt-2">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Create an account
          </Link>
        </p> */}
      </form>
    </div>
  );
};

export default Login;
