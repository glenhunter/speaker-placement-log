import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { signIn, signUp, migrating } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Basic client-side validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate("/");
      } else {
        await signUp(email, password);
        setMessage("Account created successfully!");
        setEmail("");
        setPassword("");
        setTimeout(() => setIsLogin(true), 1500);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-sky_blue_light-900">
      <div className="w-full max-w-sm">
        <Card className="p-6 border-2 border-sky_blue_light-700 shadow-lg">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-deep_space_blue">
                {isLogin ? "Welcome back" : "Create an account"}
              </h1>
              <p className="text-sm text-blue_green-300">
                {isLogin
                  ? "Enter your email to sign in to your account"
                  : "Enter your email below to create your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => navigate("/reset-password")}
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              {message && (
                <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
                  {message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-deep_space_blue hover:bg-deep_space_blue-600 active:bg-deep_space_blue-700 text-white transition-all"
                disabled={loading || migrating}
              >
                {migrating
                  ? "Migrating data..."
                  : loading
                  ? "Loading..."
                  : isLogin
                  ? "Sign in"
                  : "Sign up"}
              </Button>

              {migrating && (
                <div className="text-sm text-muted-foreground text-center">
                  Syncing your local data to the cloud...
                </div>
              )}
            </form>

            <div className="text-center text-sm text-blue_green-300">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setMessage("");
                }}
                className="underline underline-offset-4 hover:text-princeton_orange active:text-princeton_orange-700 text-princeton_orange-600 font-medium transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
