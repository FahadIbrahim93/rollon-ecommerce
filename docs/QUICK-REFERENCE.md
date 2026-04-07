# 🚀 RollON Quick Reference – Developer Cheat Sheet

## ⚡ START HERE

### App is Running ✅
```
http://localhost:5173/
```

### Stop App
```
Ctrl+C in terminal (where npm run dev is running)
```

### Restart App
```bash
cd /workspaces/rollon-ecommerce/rollon-app
npm run dev
```

---

## 👤 LOGIN CREDENTIALS

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@rollon.com | admin123 |
| **Customer** | customer@example.com | password123 |
| **Test** | test@example.com | test1234 |

---

## 🗂️ KEY FILES (Where to Edit)

| Feature | File | What to Change |
|---------|------|---|
| **Authentication** | `src/store/authStore.ts` | Login/logout logic |
| **Routes** | `src/App.tsx` | Add/remove pages |
| **Admin Dashboard** | `src/pages/admin/AdminDashboard.tsx` | Admin UI |
| **Products** | `src/pages/Shop.tsx` | Product grid |
| **Cart** | `src/store/cartStore.ts` | Cart logic |
| **Database** | `src/store/databaseStore.ts` | Mock data |
| **Components** | `src/components/` | Reusable UI pieces |
| **Styles** | `src/App.css` or Tailwind | Global styles |

---

## 🛠️ COMMON COMMANDS

```bash
# Navigate to app
cd /workspaces/rollon-ecommerce/rollon-app

# Check code quality
npm run lint

# Auto-fix linting issues
npm run lint -- --fix

# Run tests
npm test -- --run          # Once
npm test -- --watch        # Watch mode

# Build for production
npm run build

# Preview production build
npm run preview

# Check for security issues
npm audit
```

---

## 📁 FOLDER STRUCTURE

```
rollon-app/
├── src/
│   ├── pages/          ← Add new pages here
│   ├── components/     ← Reusable UI
│   ├── store/          ← State management (Zustand)
│   ├── lib/            ← Utilities & helpers
│   └── App.tsx         ← Routes go here
├── public/             ← Static files
├── package.json        ← Dependencies
└── vite.config.ts      ← Build config
```

---

## 🧪 HOW TO DEBUG

### Browser Console (F12)
```javascript
// Check if logged in
localStorage.getItem('auth-state')

// Check cart items
localStorage.getItem('cart-state')

// Check database
localStorage.getItem('database-state')
```

### Check Current Page Route
```javascript
// In console
window.location.pathname
```

### See Component Props
```
F12 → React DevTools → Select component
```

---

## 📝 FILE EDITING WORKFLOW

1. **Edit file** in VS Code
2. **Save** (Ctrl+S)
3. **Vite auto-reloads** (watch for changes)
4. **Refresh browser** if needed (F5)
5. **Check console** (F12) for errors

---

## ✅ DAILY CHECKLIST

- [ ] App running? `http://localhost:5173/`
- [ ] Can login with test account?
- [ ] Admin dashboard loads?
- [ ] No red errors in console (F12)?
- [ ] Changed files auto-reload?
- [ ] Tests pass? `npm test -- --run`

---

## 🆘 QUICK FIXES

### "Module not found" error
```bash
npm install
npm run dev
```

### Styles not loading
```bash
npm run dev
# Tailwind auto-compiles
```

### Auth not working
```javascript
// F12 Console:
localStorage.clear()
// Refresh page and try login again
```

### Build fails
```bash
npm run build
# Check error in terminal output
```

---

## 📊 TESTING PATHS

| Feature | URL | Expected |
|---------|-----|----------|
| Home | `/` | Hero + featured products |
| Shop | `/shop` | Product grid |
| Product | `/product/[slug]` | Product details |
| Cart | `/cart` (via icon) | Cart items list |
| Checkout | `/checkout` | Checkout form |
| Login | `/login` | Login form |
| Profile | `/account` | User profile (if logged in) |
| Admin | `/admin` | Admin dashboard (if admin) |
| Orders | `/admin/orders` | Orders list |
| Products | `/admin/products` | Products management |

---

## 🔄 GIT WORKFLOW

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Feature: What you did"

# Push
git push origin master

# Check log
git log --oneline -5
```

---

## 📚 DOCUMENTATION

| Doc | Use When |
|-----|----------|
| `DEVELOPMENT-SETUP.md` | Setting up environment |
| `SPRINT-1-DAY-1-ACTION-PLAN.md` | Working on T1.1 |
| `10-10-EXECUTION-ROADMAP-SPRINT-TRACKER.md` | Checking sprint tasks |
| `OPERATIONAL-RUNBOOK.md` | Production deployment |
| `CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md` | Understanding codebase state |

---

## 🎯 TODAY'S GOAL

1. ✅ Start dev server
2. ✅ Test home page
3. ✅ Test login flow
4. ✅ Access admin dashboard
5. 🚀 Fix any issues

---

## 💡 TIP: AUTO-SAVE IN VS CODE

Settings → Format on Save → Enable
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

**Questions?** Check DEVELOPMENT-SETUP.md or ask in team chat!
