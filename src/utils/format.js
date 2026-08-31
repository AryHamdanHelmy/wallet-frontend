export function formatRupiah(value) {
  return 'Rp' + new Intl.NumberFormat('id-ID').format(value ?? 0)
}

export function formatTanggal(iso) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}