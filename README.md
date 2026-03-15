# Affina — Deployment Guide
## Deploy to Netlify in 5 Minutes (Free)

---

### What's in This Package

```
affina-deploy/
├── public/
│   └── index.html          ← The full Affina app
├── netlify/
│   └── functions/
│       └── chat.js         ← AI proxy (keeps your API key secret)
├── netlify.toml            ← Netlify config + security headers
└── README.md               ← This file
```

---

### Step 1 — Get Your Anthropic API Key

1. Go to **console.anthropic.com**
2. Sign in or create a free account
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`) — save it somewhere safe

---

### Step 2 — Deploy to Netlify

**Option A — Drag & Drop (Easiest, no account needed initially)**

1. Go to **netlify.com** and sign up for a free account
2. From your dashboard, drag the entire `affina-deploy` folder onto the Netlify drop zone
3. Netlify will deploy in ~30 seconds and give you a URL like `https://affina-abc123.netlify.app`

**Option B — GitHub (Best for updates)**

1. Create a free GitHub account at github.com
2. Create a new repository called `affina`
3. Upload all files from `affina-deploy/` to the repo
4. In Netlify: **Add new site → Import from Git → Connect GitHub → Select affina repo**
5. Build settings: leave blank (netlify.toml handles everything)
6. Click **Deploy**

---

### Step 3 — Add Your API Key (Required for AI Chat)

1. In your Netlify dashboard, go to **Site configuration → Environment variables**
2. Click **Add a variable**
3. Key: `ANTHROPIC_API_KEY`
4. Value: paste your key from Step 1 (`sk-ant-...`)
5. Click **Save**
6. Go to **Deploys → Trigger deploy → Deploy site** to redeploy with the key active

**That's it. Your AI chat will now work.**

---

### Step 4 — Custom Domain (Optional)

1. In Netlify: **Domain management → Add custom domain**
2. Enter `affina.app` (or whatever domain you own)
3. Follow DNS instructions — Netlify gives you free SSL automatically

---

### Security Features Included

- ✅ API key never exposed to users (stored server-side only)
- ✅ HTTPS enforced via HSTS header
- ✅ Content Security Policy blocks malicious scripts
- ✅ X-Frame-Options prevents clickjacking
- ✅ Conversation history trimmed to 40 messages max
- ✅ Input validation on all AI requests
- ✅ Microphone permission scoped to your domain only

---

### Updating the App

To update the app in the future:
- **Drag & drop**: re-drag the updated `affina-deploy` folder to Netlify
- **GitHub**: push changes to your repo — Netlify auto-deploys

---

### Costs

- **Netlify free tier**: 100GB bandwidth/month, 125,000 serverless function calls/month — more than enough for a growing user base
- **Anthropic API**: Pay per use (~$0.003 per AI conversation). Free tier available.
- **Custom domain**: ~$12/year from Namecheap or Google Domains

---

### Support

Questions? Email jordan.rabadi@student.shu.edu
