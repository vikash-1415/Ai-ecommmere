import Navbar from "../components/Navbar";

export default function Signup() {
  return (
    <>
      <Navbar />
      <div className="pt-32 pb-16 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">Create Account</h2>
          <form className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Email</label>
              <input type="email" placeholder="name@example.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-blue-500" />
            </div>
            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
