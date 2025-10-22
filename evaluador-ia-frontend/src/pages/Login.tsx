// src/pages/Login.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login(data);
      login(response.access_token, response.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Credenciales inválidas. Por favor, intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Iniciar Sesión</h1>
            <p className="text-slate-400 mt-2">Bienvenido de nuevo</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg border-l-4 bg-red-950 border-red-500 text-red-400 mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                {...register('email')}
                className={`w-full px-4 py-3 rounded-lg border bg-slate-700 text-white placeholder-slate-400 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-600 focus:ring-cyan-500'
                } focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-4 py-3 rounded-lg border bg-slate-700 text-white placeholder-slate-400 ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-600 focus:ring-cyan-500'
                } focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-medium bg-cyan-500 hover:bg-cyan-600 text-white disabled:bg-cyan-700 transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Cargando...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          © 2025 Evaluador IA. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}