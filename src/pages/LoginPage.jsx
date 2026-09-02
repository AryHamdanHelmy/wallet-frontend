import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, getFieldErrors, isRateLimited } from '../api/errors'

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    setGeneralError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submitting) return

    setSubmitting(true)
    setFieldErrors({})
    setGeneralError('')

    try {
      await login(form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFieldErrors(getFieldErrors(error))

      if (isRateLimited(error)) {
        setGeneralError('Terlalu banyak percobaan login. Tunggu sebentar.')
      } else if (Object.keys(getFieldErrors(error)).length === 0) {
        setGeneralError(getErrorMessage(error))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isDisabled = submitting || !form.email || !form.password

  return (
    <div className="flex min-h-screen flex-col bg-line px-4 py-8 sm:items-center sm:justify-center">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-heading text-primaryDark">MiniWallet</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Sign in to manage your balance.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-line bg-white p-6 shadow-sm"
          noValidate
        >
          {generalError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger"
            >
              {generalError}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-textPrimary"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              className={`w-full rounded-lg border px-3 py-2.5 text-[15px] outline-none transition focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 ${
                fieldErrors.email
                  ? 'border-danger focus:border-danger'
                  : 'border-line focus:border-primary'
              }`}
              placeholder="Email or phone number"
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-sm text-danger">{fieldErrors.email}</p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-textPrimary"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              disabled={submitting}
              className={`w-full rounded-lg border px-3 py-2.5 text-[15px] outline-none transition focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 ${
                fieldErrors.password
                  ? 'border-danger focus:border-danger'
                  : 'border-line focus:border-primary'
              }`}
              placeholder="Enter your password"
            />
            {fieldErrors.password && (
              <p className="mt-1.5 text-sm text-danger">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-[15px] font-medium text-white transition hover:bg-primaryHover disabled:cursor-not-allowed disabled:bg-[#9ec3dd]"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? 'Processing...' : 'Log In'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-textSecondary">
          Don't have account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}