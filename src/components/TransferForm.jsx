import { useEffect, useRef, useState } from 'react'
import { walletApi } from '../api/wallet'
import { getErrorMessage, getFieldErrors, isRateLimited } from '../api/errors'
import { formatRupiah } from '../utils/format'
import TransferConfirmDialog from './TransferConfirmDialog'

const EMPTY = { recipient: '', amount: '', description: '' }

export default function TransferForm({ balance, onSuccess }) {
  const [form, setForm] = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const successTimer = useRef(null)
  useEffect(() => () => clearTimeout(successTimer.current), [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? value.replace(/\D/g, '') : value,
    }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    setGeneralError('')
    setSuccess('')
  }

  const validate = () => {
    const errors = {}
    if (!form.recipient.trim()) {
      errors.recipient = 'Enter an email or phone number.'
    }
    const parsed = Number(form.amount)
    if (!form.amount) {
      errors.amount = 'Enter an amount first.'
    } else if (!Number.isFinite(parsed) || parsed <= 0) {
      errors.amount = 'Enter an amount greater than zero.'
    }
    return errors
  }

  // Submitting the form only opens the confirmation. Nothing leaves the
  // account until the user confirms in the dialog.
  const handleSubmit = (e) => {
    e.preventDefault()
    if (submitting) return

    setFieldErrors({})
    setGeneralError('')
    setSuccess('')

    const invalid = validate()
    if (Object.keys(invalid).length > 0) {
      setFieldErrors(invalid)
      return
    }

    setConfirming(true)
  }

  const handleConfirm = async () => {
    const parsed = Number(form.amount)
    setSubmitting(true)

    try {
      const res = await walletApi.transfer(
        form.recipient.trim(),
        parsed,
        form.description || undefined,
      )

      setConfirming(false)
      setSuccess(`Transfer of ${formatRupiah(parsed)} was successful.`)
      setForm(EMPTY)
      onSuccess?.(res.data.data)

      clearTimeout(successTimer.current)
      successTimer.current = setTimeout(() => setSuccess(''), 4000)
    } catch (error) {
      // Close the dialog so the error is visible against the form fields it
      // refers to, rather than stranded behind an overlay.
      setConfirming(false)

      const errors = getFieldErrors(error)
      setFieldErrors(errors)

      if (Object.keys(errors).length === 0) {
        setGeneralError(
          isRateLimited(error)
            ? 'Too many requests. Please wait a moment.'
            : getErrorMessage(error),
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (error, extra = '') =>
    `w-full rounded-lg border px-3 py-2.5 text-[15px] outline-none transition focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 ${extra} ${
      error
        ? 'border-danger focus:border-danger'
        : 'border-line focus:border-primary'
    }`

  const labelClass = 'mb-1.5 block text-sm font-medium text-textPrimary'

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h2 className="text-title text-textPrimary">Transfer</h2>

      <form onSubmit={handleSubmit} className="mt-4" noValidate>
        <div className="mb-3">
          <label htmlFor="recipient" className={labelClass}>
            Recipient
          </label>
          <input
            id="recipient"
            name="recipient"
            type="text"
            value={form.recipient}
            onChange={handleChange}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.recipient)}
            aria-describedby={fieldErrors.recipient ? 'recipient-error' : undefined}
            placeholder="Email or phone number"
            className={inputClass(fieldErrors.recipient)}
          />
          {fieldErrors.recipient && (
            <p id="recipient-error" className="mt-1.5 text-sm text-danger">
              {fieldErrors.recipient}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="transfer-amount" className={labelClass}>
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
            aria-invalid={Boolean(fieldErrors.amount)}
            aria-describedby={fieldErrors.amount ? 'transfer-amount-error' : undefined}
            placeholder="0"
            className={inputClass(fieldErrors.amount, 'tabular-nums')}
          />
          {fieldErrors.amount && (
            <p id="transfer-amount-error" className="mt-1.5 text-sm text-danger">
              {fieldErrors.amount}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className={labelClass}>
            Description{' '}
            <span className="font-normal text-textSecondary">(optional)</span>
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={form.description}
            onChange={handleChange}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={fieldErrors.description ? 'description-error' : undefined}
            placeholder="Add a note"
            className={inputClass(fieldErrors.description)}
          />
          {fieldErrors.description && (
            <p id="description-error" className="mt-1.5 text-sm text-danger">
              {fieldErrors.description}
            </p>
          )}
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
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[15px] font-medium text-white transition hover:bg-primaryHover disabled:opacity-60"
        >
          Review transfer
        </button>
      </form>

      <TransferConfirmDialog
        open={confirming}
        recipient={form.recipient.trim()}
        amount={Number(form.amount)}
        description={form.description}
        balance={balance}
        submitting={submitting}
        onConfirm={handleConfirm}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}