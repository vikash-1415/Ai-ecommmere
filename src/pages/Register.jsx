import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const result = await register(
        form.name,
        form.email,
        form.password
      );

      navigate("/login", {
        state: { message: result.message },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex min-h-[80vh] items-center justify-center px-5 pb-16 pt-28">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Join WeatherCart
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Get personalized weather-aware recommendations.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
            >
              <AuthInput
                icon={User}
                label="Full Name"
                value={form.name}
                onChange={(value) =>
                  update("name", value)
                }
                placeholder="Your name"
              />

              <AuthInput
                icon={Mail}
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) =>
                  update("email", value)
                }
                placeholder="you@example.com"
              />

              <AuthInput
                icon={LockKeyhole}
                label="Password"
                type="password"
                value={form.password}
                onChange={(value) =>
                  update("password", value)
                }
                placeholder="Minimum 8 characters"
              />

              <button
                disabled={submitting}
                className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {submitting
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-slate-950 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function AuthInput({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold">
        {label}
      </span>

      <div className="relative mt-2">
        <Icon
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          required
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-950"
        />
      </div>
    </label>
  );
}
