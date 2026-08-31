export function getErrorMessage(error) {
  const res = error.response

  if (!res) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi Anda.'
  }

  if (res.status === 422 && res.data?.errors) {
    const first = Object.values(res.data.errors)[0]
    return Array.isArray(first) ? first[0] : first
  }

  return res.data?.message ?? 'Terjadi kesalahan. Coba lagi.'
}

export function getFieldErrors(error) {
  if (error.response?.status !== 422) return {}

  const errors = error.response.data?.errors ?? {}
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : messages,
    ]),
  )
}

export function isRateLimited(error) {
  return error.response?.status === 429
}