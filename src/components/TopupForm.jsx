import { useState } from 'react'
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

  const reset = () => {
    setFieldError('')
    setGeneralError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submitting) return

    setSubmitting(true)
    reset()

    try {
      const res = await walletApi.topup(Number(amount))
      setSuccess(`Top-up of ${formatRupiah(Number(amount))} was successful.`)
      setAmount('')
      onSuccess?.(res.data.data)

      setTimeout(()=> setSuccess(''), 4000)
    } catch (error) {
      const errors = getFieldErrors(error)

      if (errors.amount) {
        setFieldError(errors.amount)
      } else if (isRateLimited(error)) {
        setGeneralError('Too many request. Please wait.')
      } else {
        setGeneralError(getErrorMessage(error))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#e3e7eb] bg-white p-5">
      <h2 className="text-base font-medium text-[#2c2e2f]">Add funds</h2>

      <form onSubmit={handleSubmit} className="mt-4" noValidate>
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((nominal) => (
            <button
              key={nominal}
              type="button"
              disabled={submitting}
              onClick={() => {
                setAmount(String(nominal))
                reset()
              }}
              className="rounded-full border border-[#e3e7eb] px-3 py-1.5 text-sm text-[#2c2e2f] transition hover:border-[#0070ba] hover:text-[#0070ba] disabled:opacity-50"
            >
              {formatRupiah(nominal)}
            </button>
          ))}
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
            setAmount(e.target.value)
            reset()
          }}
          disabled={submitting}
          placeholder="Input amount"
          className={`w-full rounded-lg border px-3 py-2.5 text-[15px] outline-none transition focus:ring-2 focus:ring-[#0070ba]/20 disabled:bg-slate-50 ${
            fieldError
              ? 'border-[#d20000] focus:border-[#d20000]'
              : 'border-[#e3e7eb] focus:border-[#0070ba]'
          }`}
        />

        {fieldError && (
          <p className="mt-1.5 text-sm text-[#d20000]">{fieldError}</p>
        )}
        {generalError && (
          <p role="alert" className="mt-1.5 text-sm text-[#d20000]">
            {generalError}
          </p>
        )}
        {success && (
          <p role="status" className="mt-1.5 text-sm text-[#00a67e]">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !amount}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0070ba] px-4 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#005ea6] disabled:cursor-not-allowed disabled:bg-[#9ec3dd]"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {submitting ? 'Processsing...' : 'Top-up'}
        </button>
      </form>
    </div>
  )
}