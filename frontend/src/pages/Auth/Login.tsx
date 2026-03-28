// pages/Auth/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api';
import { useAuth, useUI } from '@/store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const { showNotification } = useUI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      setToken(response.data.token);
      setUser(response.data.user);
      showNotification('success', 'Login successful!');
      navigate('/');
    } catch (error: any) {
      showNotification('error', error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md w-full mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-center text-textSecondary mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-medium">
          Sign up
        </Link>
      </p>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-surface rounded-lg">
        <p className="text-xs text-textSecondary mb-2">Demo Credentials:</p>
        <p className="text-xs">admin@yemelink.test</p>
        <p className="text-xs">Yemelink123!</p>
      </div>
    </div>
  );
}
