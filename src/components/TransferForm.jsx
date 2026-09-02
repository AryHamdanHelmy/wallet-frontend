import { useState } from 'react'
import { walletApi } from '../api/wallet'
import { getErrorMessage, getFieldErrors, isRateLimited } from '../api/errors'
import { formatRupiah } from '../utils/format'

export default function TransferForm({ onSuccess }) {
  const [form, setForm] = useState({ recipient: '', amount: '', description: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    setGeneralError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submitting) return

    setSubmitting(true)
    setFieldErrors({})
    setGeneralError('')
    setSuccess('')

    try {
      const res = await walletApi.transfer(
        form.recipient,
        Number(form.amount),
        form.description || undefined,
      )

      setSuccess(`Transfer of ${formatRupiah(Number(form.amount))} was successful.`)
      setForm({ recipient: '', amount: '', description: '' })
      onSuccess?.(res.data.data)

      setTimeout(() => setSuccess(''), 4000)
    } catch (error) {
      const errors = getFieldErrors(error)
      setFieldErrors(errors)

      if (Object.keys(errors).length === 0) {
        setGeneralError(
          isRateLimited(error)
            ? 'Too many request, please wait.'
            : getErrorMessage(error),
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (error) =>
    `w-full rounded-lg border px-3 py-2.5 text-[15px] outline-none transition focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 ${
      error
        ? 'border-danger focus:border-danger'
        : 'border-line focus:border-primary'
    }`

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h2 className="text-title text-textPrimary">Transfer</h2>

      <form onSubmit={handleSubmit} className="mt-4" noValidate>
        <div className="mb-3">
          <label
            htmlFor="recipient"
            className="mb-1.5 block text-sm font-medium text-textPrimary"
          >
            Recipient
          </label>
          <input
            id="recipient"
            name="recipient"
            type="text"
            value={form.recipient}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Email or phone number"
            className={inputClass(fieldErrors.recipient)}
          />
          {fieldErrors.recipient && (
            <p className="mt-1.5 text-sm text-danger">
              {fieldErrors.recipient}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label
            htmlFor="transfer-amount"
            className="mb-1.5 block text-sm font-medium text-textPrimary"
          >
            Amount
          </label>
          <input
            id="transfer-amount"
            name="amount"
            type="text"
            inputMode="numeric"
            value={form.amount}
            onChange={handleChange}
            disabled={submitting}
            placeholder="0"
            className={inputClass(fieldErrors.amount)}
          />
          {fieldErrors.amount && (
            <p className="mt-1.5 text-sm text-danger">{fieldErrors.amount}</p>
          )}
        </div>

        <div className="mb-3">
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-textPrimary"
          >
            Description <span className="font-normal text-textSecondary">(opsional)</span>
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={form.description}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Add a note"
            className={inputClass(fieldErrors.description)}
          />
        </div>

        {generalError && (
          <div
            role="alert"
            className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger"
          >
            {generalError}
          </div>
        )}
        {success && (
          <div
            role="status"
            className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-success"
          >
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !form.recipient || !form.amount}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[15px] font-medium text-white transition hover:bg-primaryHover disabled:cursor-not-allowed disabled:bg-[#9ec3dd]"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {submitting ? 'Sending...' : 'Send Money'}
        </button>
      </form>
    </div>
  )
}