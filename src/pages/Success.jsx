import { CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Success() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || '';
  const message = state?.message || 'Your account has been created successfully!';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-5 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center backdrop-blur-lg bg-white/70">
          <CheckCircle className="mx-auto text-green-500" size={80} />
          <h1 className="mt-6 text-3xl font-bold text-gray-800">Success!</h1>
          <p className="mt-4 text-lg text-gray-600">{message}</p>
          {email && (
            <p className="mt-2 text-sm text-gray-500">A confirmation has been sent to <span className="font-medium text-gray-700">{email}</span>.</p>
          )}
          <button
            onClick={() => navigate('/')}
            className="mt-8 inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition transform hover:scale-[1.02]"
          >
            Go to Home
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
