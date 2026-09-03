import { useEffect, useRef, useState } from 'react'
import { walletApi } from '../api/wallet'
import { getErrorMessage, getFieldErrors, isRateLimited } from '../api/errors'
import { formatRupiah } from '../utils/format'

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000]

export default function TopupForm({ onSuccess }) {
  const [amount, setAmount] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const successTimer = useRef(null)
  useEffect(() => () => clearTimeout(successTimer.current), [])

  const reset = () => {
    setFieldError('')
    setGeneralError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    reset()

    const parsed = Number(amount)
    if (!amount) {
      setFieldError('Enter an amount first.')
      return
    }
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setFieldError('Enter an amount greater than zero.')
      return
    }

    setSubmitting(true)
    try {
      const res = await walletApi.topup(parsed)
      setSuccess(`Top-up of ${formatRupiah(parsed)} was successful.`)
      setAmount('')
      onSuccess?.(res.data.data)

      clearTimeout(successTimer.current)
      successTimer.current = setTimeout(() => setSuccess(''), 4000)
    } catch (error) {
      const errors = getFieldErrors(error)

      if (errors.amount) {
        setFieldError(errors.amount)
      } else if (isRateLimited(error)) {
        setGeneralError('Too many requests. Please wait a moment.')
      } else {
        setGeneralError(getErrorMessage(error))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h2 className="text-title text-textPrimary">Add funds</h2>

      <form onSubmit={handleSubmit} className="mt-4" noValidate>
        <div className="mb-3 grid grid-cols-2 gap-2">
          {QUICK_AMOUNTS.map((nominal) => {
            const selected = amount === String(nominal)
            return (
              <button
                key={nominal}
                type="button"
                aria-pressed={selected}
                disabled={submitting}
                onClick={() => {
                  setAmount(String(nominal))
                  reset()
                }}
                className={`rounded-full border px-3 py-1.5 text-sm tabular-nums transition disabled:opacity-50 ${
                  selected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-line text-textPrimary hover:border-primary hover:text-primary'
                }`}
              >
                {formatRupiah(nominal)}
              </button>
            )
          })}
        </div>

        <label htmlFor="topup-amount" className="sr-only">
          Top-up amount
        </label>
        <input
          id="topup-amount"
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value.replace(/\D/g, ''))
            reset()
          }}
          disabled={submitting}
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? 'topup-amount-error' : undefined}
          placeholder="Input amount"
          className={`w-full rounded-lg border px-3 py-2.5 text-[15px] tabular-nums outline-none transition focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 ${
            fieldError
              ? 'border-danger focus:border-danger'
              : 'border-line focus:border-primary'
          }`}
        />

        {fieldError && (
          <p id="topup-amount-error" className="mt-1.5 text-sm text-danger">
            {fieldError}
          </p>
        )}
        {generalError && (
          <p role="alert" className="mt-1.5 text-sm text-danger">
            {generalError}
          </p>
        )}
        {success && (
          <p role="status" className="mt-1.5 text-sm text-success">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[15px] font-medium text-white transition hover:bg-primaryHover disabled:opacity-60"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {submitting ? 'Processing…' : 'Top-up'}
        </button>
      </form>
    </div>
  )
}