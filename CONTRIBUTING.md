# Contributing to Anuu_Verse

We welcome all contributions! Here's how:

---

## 1️⃣ REPORT A BUG

→ [Open an Issue](https://github.com/anuset89/Anuu_Verse/issues/new) with:
- **What broke:** Clear description
- **How to reproduce:** Step-by-step
- **Your setup:** OS, Python version, GPU

---

## 2️⃣ SUGGEST A FEATURE

→ [Open a Discussion](https://github.com/anuset89/Anuu_Verse/discussions) with:
- **What's missing:** Feature description
- **Why it matters:** Use case
- **How you'd use it:** Example workflow

---

## 3️⃣ IMPROVE DOCS

→ Edit files in `/docs` directly on GitHub:
- Fix typos
- Add examples
- Clarify confusing sections
- Translate content

---

## 4️⃣ ADD CODE

→ Fork → Create Branch → Submit PR

```bash
# 1. Fork the repo on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Anuu_Verse.git
cd Anuu_Verse

# 3. Create a branch
git checkout -b feature/your-feature-name

# 4. Make changes
# ... edit files ...

# 5. Commit
git add .
git commit -m "feat: add [description]"

# 6. Push
git push origin feature/your-feature-name

# 7. Open Pull Request on GitHub
```

**Before submitting:**
- [ ] Code follows existing style
- [ ] Added tests if applicable
- [ ] Updated docs if needed
- [ ] Tested locally

---

## 5️⃣ SUPPORT THE PROJECT

**No code? No problem:**
- ⭐ **Star it** on GitHub
- 🐦 **Share it** on Twitter/X
- 💬 **Talk about it** in communities
- 📧 **Sign up** for updates

---

## 📋 Development Setup

### Backend
```bash
cd Anuu_Verse
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python systems/EXECUTION/agents/companion_local/main.py
```

### Frontend
```bash
cd web
npm install
npm run dev
```

---

## 🎨 Code Style

- **Python:** Follow PEP 8
- **TypeScript:** Use the existing Prettier config
- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation
  - `refactor:` Code refactoring

---

## 🏷️ Good First Issues

Look for labels:
- `good-first-issue` — Perfect for new contributors
- `help-wanted` — Need community help
- `documentation` — Doc improvements

---

## 💬 Questions?

Ask in [Discussions](https://github.com/anuset89/Anuu_Verse/discussions) or open an issue.

**Welcome aboard!** 🟣

---

*Made with 🟣 by [@anuset89](https://github.com/anuset89)*
