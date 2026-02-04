import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/api/auth';
import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/Button';
import { Navbar } from '@/components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });
      login(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">FinTrack</h1>
              <p className="text-muted-foreground mt-2">
                Manage your finances with ease
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <FormInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
              >
                Login
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Register now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
