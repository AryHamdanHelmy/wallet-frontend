# Koku — Brand Assets

**Koku** (石) — satuan takaran beras di Jepang feodal, dipakai untuk mengukur
kekayaan. Dibaca orang Indonesia sebagai "koin-ku".

Mark-nya diambil dari koin *mon* Jepang kuno: lingkaran dengan lubang kotak
di tengah. Bentuk yang sama dipakai sebagai huruf "o" di wordmark.

Semua teks sudah di-convert ke path (Plus Jakarta Sans, lisensi OFL).
Tidak butuh font ter-install untuk render.

## Positioning

Koku adalah dompet digital untuk orang yang baru mulai serius sama uangnya
sendiri. Fokus di satu hal: bikin kamu tahu persis berapa saldomu, ke mana
perginya, dan siapa yang kamu kirimi — tanpa fitur yang gak kamu butuhin.

**Tagline:** Uangmu, jelas.
**Tone:** Jujur · Ringkas · Tenang

## File

| File | Pakai untuk |
|---|---|
| `logo-full.svg` | Logo utama. Navbar, header, dokumen. |
| `logo-mono-dark.svg` | Satu warna gelap. Print, invoice, watermark. |
| `logo-mono-white.svg` | Satu warna putih. Background gelap, footer. |
| `wordmark.svg` | Teks saja, "o" biasa. Ruang sempit yang lebar. |
| `wordmark-coin.svg` | Teks dengan "o" jadi koin. Hero, splash screen. |
| `wordmark-white.svg` | Wordmark di background gelap. |
| `mark.svg` | Ikon saja. App icon, avatar, loading state. |
| `mark-white.svg` | Ikon satu warna putih (knockout). |
| `favicon.svg` | Versi disederhanakan untuk 16–32px. |

## Warna

| Nama | Hex | Fungsi |
|---|---|---|
| Brand | `#003087` | Tombol utama, link, mark |
| Brand soft | `#A6B5D1` | Aksen, state disabled |
| Ink | `#1E1B2E` | Teks & angka saldo |
| Ink muted | `#8B89A3` | Teks sekunder |
| Surface | `#FAFAF9` | Background halaman |
| Inflow | `#059669` | Uang masuk (`+Rp 50.000`) |
| Outflow | `#DC2626` | Uang keluar, error |

Saldo utama selalu Ink — jangan hijau. Hijau khusus perubahan positif.

## Contoh copy

| Konteks | Copy |
|---|---|
| Tombol utama | `Kirim` / `Top Up` |
| Belum ada transaksi | Belum ada transaksi. Mulai dari top-up dulu. |
| Saldo nol | Saldo kosong. Wajar, semua mulai dari sini. |
| Saldo kurang | Saldo kamu Rp 50.000, kurang Rp 20.000 dari jumlah ini. |
| Gagal kirim | Gagal kirim. Uangmu aman, gak terpotong. Coba lagi? |
| Sukses transfer | Terkirim ke Budi. Sisa saldo Rp 130.000. |

Selalu sebutkan angka konkret. Di produk uang, ambiguitas bikin panik.

## Aturan pakai

- **Clear space:** sisakan jarak minimal setinggi ikon di semua sisi.
- **Ukuran minimum:** logo lengkap 120px lebar. Di bawah itu pakai `mark.svg`.
- **Jangan** ubah warna, regangkan proporsi, tambah shadow, atau pindahkan
  ikon ke kanan teks.
- **Background foto:** pakai versi mono, jangan yang berwarna.

## Pakai di React

```jsx
import logo from "@/assets/logo-full.svg";

<img src={logo} alt="Koku" className="h-8 w-auto" />
```

Favicon di `index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

## Tailwind v4

Import `brand.css` sebagai pengganti `@import "tailwindcss"` di entry CSS.
Tersedia: `bg-brand`, `text-ink`, `text-ink-muted`, `bg-surface`,
`text-inflow`, `text-outflow`, `font-display`.

Untuk semua angka rupiah tambahkan class `tabular` supaya digitnya rata dan
tidak goyang saat nilainya berubah.

## Sebelum dipakai serius

Nama ini sudah lolos penyaringan web (tidak ada fintech bernama Koku yang
ketemu), tapi **belum** dicek di:

- PDKI DJKI kelas 36 — pdki-indonesia.dgip.go.id
- Ketersediaan domain `koku.com` / `koku.id`

Untuk portfolio aman. Untuk produk komersial, cek dua hal di atas dulu.
