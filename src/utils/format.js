const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const tanggal = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatRupiah(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—'
  }
  return rupiah.format(Number(value))
}

export function formatTanggal(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : tanggal.format(d)
}