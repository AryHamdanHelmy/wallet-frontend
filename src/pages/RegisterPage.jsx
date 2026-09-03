import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, getFieldErrors, isRateLimited } from '../api/errors'
import wordMark from '../assets/wordmark-coin.svg'

const FIELDS = [
  {
    name: 'name',
    label: 'Full name',
    type: 'text',
    placeholder: 'Your name',
    autoComplete: 'name',
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Username',
    autoComplete: 'username',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Your email',
    autoComplete: 'email',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Your phone number',
    autoComplete: 'tel',
    hint: 'Optional. This helps others transfer funds to your number.',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Minimal 8 Character',
    autoComplete: 'new-password',
  },
  {
    name: 'password_confirmation',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Re-enter password',
    autoComplete: 'new-password',
  },
]

export default function RegisterPage() {
  const { register, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })
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
      const payload = { ...form }
      if (!payload.phone) delete payload.phone

      await register(payload)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const errors = getFieldErrors(error)
      setFieldErrors(errors)

      if (isRateLimited(error)) {
        setGeneralError('Terlalu banyak percobaan. Tunggu sebentar.')
      } else if (Object.keys(errors).length === 0) {
        setGeneralError(getErrorMessage(error))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const requiredFilled =
    form.name &&
    form.username &&
    form.email &&
    form.password &&
    form.password_confirmation

  const inputClass = (error) =>
    `w-full rounded-md border bg-background px-4 py-3.5 text-[15px] text-textPrimary outline-none transition placeholder:text-textSecondary focus:bg-surface focus:ring-2 focus:ring-primary/15 disabled:opacity-60 ${
      error ? 'border-danger' : 'border-line focus:border-primary'
    }`

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-line px-8 py-12 sm:px-14">
        <div className="mb-4 text-center grid justify-items-center">
          <img src={wordMark} alt="Koku" className="h-7 w-auto" />
          <p className="mt-2 text-sm text-textSecondary">
            Join now to start transacting.
          </p>
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

          {FIELDS.map((field) => (
            <div key={field.name} className="mb-4">
              <label
                htmlFor={field.name}
                className="mb-1.5 block text-sm font-medium text-textPrimary"
              >
                {field.label}
                {field.hint && (
                  <span className="font-normal text-textSecondary"> (optional)</span>
                )}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                value={form[field.name]}
                onChange={handleChange}
                disabled={submitting}
                placeholder={field.placeholder}
                className={inputClass(fieldErrors[field.name])}
              />
              {fieldErrors[field.name] ? (
                <p className="mt-1.5 text-sm text-danger">
                  {fieldErrors[field.name]}
                </p>
              ) : field.hint ? (
                <p className="mt-1.5 text-xs text-textSecondary">{field.hint}</p>
              ) : null}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting || !requiredFilled}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-bold text-white transition hover:bg-primaryHover disabled:cursor-not-allowed disabled:bg-primary/35"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? 'Submitting...' : 'Sign Up'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <span className="text-sm text-textSecondary">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <Link
          to="/login"
          className="block rounded-full border-2 border-textPrimary py-3 text-center text-[15px] font-bold text-textPrimary transition hover:bg-background"
        >
          Log In
        </Link>
      </div>
    </div>
  )
}