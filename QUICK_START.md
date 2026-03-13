# 🚀 ParaScore Backend - Quick Start Guide

Everything is ready! Follow these 4 simple steps to get your backend running.

---

## Step 1: Ensure MySQL is Running

### Windows:
```bash
# Start MySQL service
net start MySQL80

# Or check if running
mysql -u root
```

### macOS:
```bash
# Start MySQL
brew services start mysql
```

### Linux:
```bash
# Start MySQL
sudo systemctl start mysql
```

**Verify connection:**
```bash
mysql -u root -p
```
(Just press Enter if no password, then type `EXIT;`)

---

## Step 2: Create Database

```bash
mysql -u root -p
```

In the MySQL prompt, paste this:
```sql
CREATE DATABASE parascore_db;
EXIT;
```

Or as a one-liner:
```bash
mysql -u root -e "CREATE DATABASE parascore_db;"
```

---

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

Wait for it to complete (takes 1-2 minutes).

---

## Step 4: Start the Server

```bash
npm run dev
```

✅ **You should see:**
```
✅ Connected to MySQL database
✅ Database tables initialized
✅ Server running on http://localhost:5000
📊 API available at http://localhost:5000/api
```

---

## Verify Backend is Working

Test the server with this command in a new terminal:

```bash
curl http://localhost:5000/api/health
```

You should get:
```json
{"status":"Server is running"}
```

Or visit in browser:
```
http://localhost:5000/api/health
```

---

## Now Start Frontend

In a different terminal:
```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 🎮 Test the Application

1. **Home Page** - You should see the landing page
2. **Submit Score** - Try submitting a score
3. **Leaderboard** - View scores for different games
4. **Admin Panel** - Log in with:
   - Username: `admin`
   - Password: `deltatime2024`

---

## API Endpoints Ready

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/scores/submit` | Submit a score |
| GET | `/api/scores/leaderboard` | Get all scores |
| GET | `/api/scores/games` | Get all games |
| POST | `/api/admin/login` | Admin login |

---

## Database Reset (If Needed)

To clear all data and restart:

```bash
mysql -u root -p -e "DROP DATABASE parascore_db; CREATE DATABASE parascore_db;"
```

Then restart the server.

---

## Troubleshooting

**MySQL won't start?**
- Check if MySQL is installed correctly
- Try restarting: `net stop MySQL80` then `net start MySQL80` (Windows)

**Port 5000 already in use?**
- Change PORT in `.env` file
- Restart server

**Database connection failed?**
- Check `.env` file credentials match MySQL setup
- Verify MySQL is running
- Check database was created

**Frontend can't reach backend?**
- Ensure backend is running on http://localhost:5000
- Check FRONTEND_URL in `.env` matches where frontend runs
- Try accessing http://localhost:5000/api/health in browser

---

## Full Documentation

For detailed information, see `BACKEND_SETUP.md` in the root folder.

---

**⚠️ Important:** Keep both `npm run dev` terminals running (one for backend, one for frontend).

Happy gaming! 🎉
