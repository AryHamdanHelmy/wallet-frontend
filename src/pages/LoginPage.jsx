import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, getFieldErrors, isRateLimited } from '../api/errors'
import wordMark from '../assets/wordmark-coin.svg'

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
  const inputClass = (error) =>
    `w-full rounded-md border bg-background px-4 py-4 text-[15px] text-textPrimary outline-none transition placeholder:text-textSecondary focus:bg-surface focus:ring-2 focus:ring-primary/15 disabled:opacity-60 ${
        error ? 'border-danger' : 'border-line focus:border-primary'
    }`

    return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-line px-8 py-12 sm:px-14">
        <div className="flex items-center justify-center mb-4">
          <img src={wordMark} alt="Koku" className="h-7 w-auto" />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {generalError && (
            <div
              role="alert"
              className="mb-5 rounded-lg bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
            >
              {generalError}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              className={inputClass(fieldErrors.email)}
              placeholder="Email address"
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-sm text-danger">{fieldErrors.email}</p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              disabled={submitting}
              className={inputClass(fieldErrors.password)}
              placeholder="Password"
            />
            {fieldErrors.password && (
              <p className="mt-1.5 text-sm text-danger">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-bold text-white transition hover:bg-primaryHover disabled:cursor-not-allowed disabled:bg-primary/35"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? 'Processing...' : 'Log In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <span className="text-sm text-textSecondary">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <Link
          to="/register"
          className="block rounded-full border-2 border-textPrimary py-3 text-center text-[15px] font-bold text-textPrimary transition hover:bg-background"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}