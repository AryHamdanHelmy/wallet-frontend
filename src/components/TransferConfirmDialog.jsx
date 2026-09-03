import { useEffect, useRef } from 'react'
import { formatRupiah } from '../utils/format'

export default function TransferConfirmDialog({
  open,
  recipient,
  amount,
  description,
  balance,
  submitting,
  onConfirm,
  onCancel,
}) {
  const panelRef = useRef(null)
  const cancelRef = useRef(null)

  // Focus lands on Cancel, not Confirm. For an irreversible action the safe
  // option should be the one a stray Enter keypress hits.
  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) {
        onCancel()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll(
        'button:not([disabled])',
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open, submitting, onCancel])

  if (!open) return null

  const hasBalance = balance !== null && balance !== undefined
  const remaining = hasBalance ? Number(balance) - amount : null
  const insufficient = remaining !== null && remaining < 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={() => !submitting && onCancel()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg"
      >
        <h2 id="confirm-title" className="text-title text-textPrimary">
          Confirm transfer
        </h2>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-textSecondary">Amount</dt>
            <dd className="text-right text-base font-semibold tabular-nums text-textPrimary">
              {formatRupiah(amount)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="shrink-0 text-textSecondary">To</dt>
            <dd className="break-all text-right font-medium text-textPrimary">
              {recipient}
            </dd>
          </div>
          {description && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="shrink-0 text-textSecondary">Note</dt>
              <dd className="wrap-break-words text-right text-textPrimary">
                {description}
              </dd>
            </div>
          )}
          {hasBalance && (
            <div className="flex items-baseline justify-between gap-4 border-t border-line pt-2.5">
              <dt className="text-textSecondary">Balance after</dt>
              <dd
                className={`text-right tabular-nums ${
                  insufficient ? 'text-danger' : 'text-textPrimary'
                }`}
              >
                {formatRupiah(remaining)}
              </dd>
            </div>
          )}
        </dl>

        {insufficient && (
          <p className="mt-3 text-sm text-danger">
            This is more than your balance. Top up first, or send a smaller
            amount.
          </p>
        )}

        <p className="mt-3 text-xs text-textSecondary">
          Transfers can&apos;t be undone.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 rounded-full border border-line px-4 py-2.5 text-[15px] font-medium text-textPrimary transition hover:border-textSecondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting || insufficient}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[15px] font-medium text-white transition hover:bg-primaryHover disabled:opacity-60"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}