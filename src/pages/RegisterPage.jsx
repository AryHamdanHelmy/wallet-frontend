import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, getFieldErrors, isRateLimited } from '../api/errors'

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
    form.name && form.username && form.email && form.password && form.password_confirmation

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-8 sm:items-center sm:justify-center">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-heading text-primaryDark">MiniWallet</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Join now to start transacting.
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
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-dangerborder-danger"
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
                className={`w-full rounded-lg border px-3 py-2.5 text-[15px] outline-none transition focus:ring-2 focus:ring-primaryborder-primary/20 disabled:bg-slate-50 ${
                  fieldErrors[field.name]
                    ? 'border-danger focus:border-danger'
                    : 'border-line focus:border-primary'
                }`}
              />
              {fieldErrors[field.name] ? (
                <p className="mt-1.5 text-sm text-dangerborder-danger">
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
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-primaryborder-primary px-4 py-3 text-[15px] font-medium text-white transition hover:bg-primaryHover disabled:cursor-not-allowed disabled:bg-[#9ec3dd]"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? 'Submitting...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-textSecondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primaryborder-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}