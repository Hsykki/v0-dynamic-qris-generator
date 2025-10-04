# Deploy ke Heroku

## Cara Deploy

1. Install Heroku CLI:
   \`\`\`bash
   npm install -g heroku
   \`\`\`

2. Login ke Heroku:
   \`\`\`bash
   heroku login
   \`\`\`

3. Buat aplikasi Heroku baru:
   \`\`\`bash
   heroku create nama-app-anda
   \`\`\`

4. Deploy aplikasi:
   \`\`\`bash
   git push heroku main
   \`\`\`

5. Buka aplikasi:
   \`\`\`bash
   heroku open
   \`\`\`

## File yang Diperlukan

- ✅ `Procfile` - Menjalankan aplikasi dengan `npm start`
- ✅ `package.json` - Sudah ada script `build`, `start`, dan `heroku-postbuild`
- ✅ `app.json` - Konfigurasi aplikasi Heroku
- ✅ `.slugignore` - File yang diabaikan saat deploy

## Troubleshooting

Jika ada error, cek logs dengan:
\`\`\`bash
heroku logs --tail
