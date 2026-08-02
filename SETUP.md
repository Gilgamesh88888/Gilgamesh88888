# 🚀 Setup Guide — Profile README

Panduan singkat agar seluruh elemen di `README.md` tampil sempurna di halaman profil GitHub.

## 1. Buat Repo Khusus Profile

Repo harus memiliki **nama yang sama persis** dengan username kamu:

```
https://github.com/Gilgamesh88888/Gilgamesh88888
```

Kalau repo belum ada, buat baru → centang **"Add a README file"** lalu ganti isinya dengan file `README.md` dari folder ini.

## 2. Upload File-file Ini

Struktur akhir di repo `Gilgamesh88888/Gilgamesh88888`:

```
.
├── .github/
│   └── workflows/
│       └── snake.yml
├── assets/
│   └── divider.svg
├── .gitignore
├── LICENSE
├── README.md
└── SETUP.md   (opsional, boleh dihapus setelah setup)
```

## 3. Fix Snake Animation Error

Kalau workflow gagal dengan error **`Cannot find module 'canvas'`**, itu bug di action
`Platane/snk/svg-only@v3` yang sudah tidak di-maintain. Solusinya sudah diterapkan di
workflow ini — pakai `Platane/snk@master` yang masih aktif.

### Langkah aktivasi:

1. Push semua file ke branch `main`.
2. Buka tab **Actions** di repo → cari workflow **"Generate Snake Animation"**.
3. Klik **"Run workflow"** manual sekali (biar tidak menunggu jadwal cron 12 jam).
4. Setelah selesai (~1–2 menit), branch `output` akan otomatis dibuat dan berisi:
   - `github-contribution-grid-snake.svg` (light)
   - `github-contribution-grid-snake-dark.svg` (dark)
   - `ocean.gif`
5. Snake akan langsung muncul di README karena `<picture>` sudah auto-switch light/dark.

> ⚠️ Kalau workflow gagal dengan error **"Resource not accessible by integration"**, buka
> **Settings → Actions → General → Workflow permissions** dan pilih **"Read and write permissions"**.

## 4. Ganti Link Sosial (opsional)

Edit bagian **Let's Connect** di `README.md` bila link default tidak sesuai:

| Badge     | URL yang perlu diganti                                   |
|-----------|----------------------------------------------------------|
| Email     | `mailto:agil.gilgamesh88888@gmail.com`                   |
| LinkedIn  | `https://www.linkedin.com/in/gilgamesh88888`             |
| Twitter   | `https://twitter.com/Gilgamesh88888`                     |
| Discord   | `https://discord.com/users/Gilgamesh88888`               |

## 5. Verifikasi

- ✅ Buka `https://github.com/Gilgamesh88888` — banner, typing SVG, badge, stats, dan snake harus muncul.
- ✅ Aktifkan dark/light system theme untuk cek `<picture>` auto-switch.
- ✅ Kalau divider tidak muncul, pastikan file `assets/divider.svg` sudah ter-push ke branch `main`.

---

Happy coding! ☕
