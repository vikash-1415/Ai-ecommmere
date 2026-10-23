import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [result, setResult] = useState(null);
  const status = !email || !token ? "error" : result?.status || "verifying";
  const message = !email || !token
    ? "This verification link is incomplete."
    : result?.message || "Verifying your email...";

  useEffect(() => {
    let cancelled = false;

    if (!email || !token) {
      return undefined;
    }

    api.verifyEmail(email, token)
      .then((result) => {
        if (!cancelled) {
          setResult({ status: "success", message: result.message });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({ status: "error", message: error.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [email, token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-5 py-28">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-950">
            {status === "success" ? "Email verified" : "Email verification"}
          </h1>
          <p className="mt-3 text-sm text-slate-600">{message}</p>
          {status !== "verifying" && (
            <Link
              to="/login"
              state={{
                message:
                  status === "success"
                    ? "Email verified. You can now sign in."
                    : "",
              }}
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Go to sign in
            </Link>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
