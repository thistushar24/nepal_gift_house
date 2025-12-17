import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Gift, AlertCircle, CheckCircle } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;

        navigate('/admin');
      } else {
        const { error, needsEmailConfirmation } = await signUp(
          email,
          password,
          fullName,
          phone
        );

        if (needsEmailConfirmation) {
          setSuccess(
            'Account created successfully. Please check your email and confirm your account before logging in.'
          );
          return;
        }

        if (error) throw error;

        setSuccess('Account created successfully. You can now log in.');
        setIsLogin(true);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-600 via-pink-500 to-orange-400 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Gift className="w-16 h-16 text-rose-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Nepal Gift House</h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading
                ? 'Please wait...'
                : isLogin
                ? 'Sign In'
                : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-rose-600 font-medium text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t text-center">
            <Link to="/" className="text-gray-600 text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
