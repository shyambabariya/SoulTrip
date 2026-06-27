#  SoulTrip

> An online platform to discover and book hotels, beach houses, villas, and unique stays around the world.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-soultrip--ocy2.onrender.com-blue?style=for-the-badge)](https://soultrip-nine.vercel.app)


---

##  Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installing Node.js](#installing-nodejs)
- [Local Setup & Installation](#local-setup--installation)
- [Environment Variables](#environment-variables)
- [Running the App Locally](#running-the-app-locally)
- [Database Setup (MongoDB)](#database-setup-mongodb)
- [Scripts](#scripts)

---

##  About the Project

**SoulTrip** is a full-stack web application that lets users browse, list, and book unique accommodations — hotels, beach houses, villas, and more. Users can register, log in, create their own property listings with photos, leave reviews, and explore stays on an interactive map powered by Mapbox. Images are stored and served via Cloudinary.

---

## Features

- 🏨 Browse and search property listings (hotels, villas, beach houses, etc.)
- 📸 Upload multiple images per listing via Cloudinary
- 🗺️ Interactive Mapbox map showing property locations
- 🔐 User authentication — register, login, logout (Passport.js + Local Strategy)
- ✍️ Create, edit, and delete your own listings
- ⭐ Leave and manage reviews on listings
- 🛡️ Authorization — only listing owners can edit or delete their listings
- 💬 Flash messages for user feedback (success / error)
- 📱 Responsive EJS-rendered views
- 🔒 Session-based authentication with MongoDB session store

---

## Tech Stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Runtime      | Node.js 22.x                                    |
| Framework    | Express.js 5.x                                  |
| Templating   | EJS + EJS-Mate (layouts)                        |
| Database     | MongoDB (Mongoose ODM)                          |
| Auth         | Passport.js (Local Strategy + passport-local-mongoose) |
| File Upload  | Multer + multer-storage-cloudinary              |
| Image Storage| Cloudinary                                      |
| Maps         | Mapbox SDK (`@mapbox/mapbox-sdk`)               |
| Validation   | Joi                                             |
| Sessions     | express-session + connect-mongo                 |
| Misc         | dotenv, method-override, connect-flash, cookie-parser |

---

## Project Structure

```
SoulTrip/
├── controllers/        # Route handler logic (separated by feature)
├── init/               # Database seed / initialization scripts
├── models/             # Mongoose schemas and models
├── public/             # Static assets (CSS, JS, images)
├── routes/             # Express route definitions
├── utils/              # Utility/helper functions (e.g., error wrapper)
├── views/              # EJS templates (pages + partials)
├── app.js              # Main Express application entry point
├── cloudConfig.js      # Cloudinary configuration
├── middleware.js       # Custom middleware (auth checks, validation)
├── schema.js           # Joi validation schemas
├── package.json        # Project metadata and dependencies
├── .gitignore
└── README.md
```

---

**Detailed User Journey:**

1. **Visitor** lands on `/listings` → sees all available properties on cards and a map.
2. **Register/Login** → session created and stored in MongoDB via `connect-mongo`.
3. **Create Listing** → form submits with images → Multer picks up files → uploads to Cloudinary → geocodes address via Mapbox → saves document to MongoDB.
4. **View Listing** → `show.ejs` renders details, image carousel, Mapbox map, and reviews.
5. **Review** → logged-in user submits a review → saved and associated with the listing.
6. **Edit/Delete** → only the listing owner can edit or delete; middleware enforces this.
7. **Logout** → session destroyed.

---

##  Prerequisites

Before you begin, make sure you have the following:

- **Node.js** v22.x (see installation instructions below)
- **npm** v10+ (comes with Node.js)
- **MongoDB** — either a local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Cloudinary** account — [cloudinary.com](https://cloudinary.com) (free tier is sufficient)
- **Mapbox** account and access token — [mapbox.com](https://www.mapbox.com)
- **Git** — [git-scm.com](https://git-scm.com)

---

## Installing Node.js

### Windows

1. Go to [https://nodejs.org](https://nodejs.org) and download the **LTS** or **v22.x** installer.
2. Run the `.msi` installer and follow the setup wizard.
3. Verify installation:

```bash
node -v   # Should print v22.x.x
npm -v    # Should print 10.x.x
```

### macOS

Using **Homebrew** (recommended):

```bash
brew install node@22
```

Or download the `.pkg` installer from [nodejs.org](https://nodejs.org).

Verify:

```bash
node -v
npm -v
```

### Linux (Ubuntu / Debian)

```bash
# Install Node.js 22.x via NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node -v
npm -v
```

### Using NVM (All platforms — recommended for managing Node versions)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Restart your terminal, then:
nvm install 22
nvm use 22

node -v   # v22.x.x
```

---

##  Local Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shyambabariya/SoulTrip.git
cd SoulTrip
```

### 2. Install Dependencies

```bash
npm install
```

This will install all packages listed in `package.json`, including Express, Mongoose, Passport, Cloudinary, Multer, Mapbox SDK, EJS, and more.

---

##  Environment Variables

Create a `.env` file in the **root** of the project:

```bash
touch .env
```

Add the following variables:

```env
# MongoDB Connection String
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/soultrip?retryWrites=true&w=majority

# Session Secret (any long random string)
SECRET=your_super_secret_session_key_here

# Cloudinary Credentials
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Mapbox Access Token
MAP_TOKEN=pk.eyJ1IjoiLi4uIiwiYSI6Ii4uLiJ9.xxxxxxxxxxxxxx
```

> ⚠️ **Never commit your `.env` file to Git.** It is already listed in `.gitignore`.

### Where to get these values:

| Variable | Where to get it |
|---|---|
| `ATLASDB_URL` | [MongoDB Atlas](https://cloud.mongodb.com) → Connect → Drivers → Node.js |
| `SECRET` | Any random string (e.g., run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` | [Cloudinary Dashboard](https://cloudinary.com/console) |
| `MAP_TOKEN` | [Mapbox Account](https://account.mapbox.com) → Access Tokens |

---

##  Database Setup (MongoDB)

### Option A — MongoDB Atlas (Cloud, Recommended)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new **Free Tier** cluster.
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, add `0.0.0.0/0` to allow connections from anywhere (for local dev).
5. Click **Connect** → **Drivers** → copy the connection string.
6. Replace `<username>` and `<password>` in the string, and paste it as `ATLASDB_URL` in your `.env`.

### Option B — Local MongoDB

1. Install MongoDB Community Edition: [docs.mongodb.com/manual/installation](https://docs.mongodb.com/manual/installation/)
2. Start the MongoDB service:

```bash
# macOS / Linux
sudo systemctl start mongod
# or
mongod

# Windows (run as Administrator)
net start MongoDB
```

3. Set `ATLASDB_URL` in `.env` to:

```env
ATLASDB_URL=mongodb://127.0.0.1:27017/soultrip
```

---

##  Running the App Locally

```bash
node app.js
```

The server will start and you'll see:

```
Server is listening on port 8080
Connected to DB
```

Open your browser and visit:

```
http://localhost:8080/listings
```

### Development Mode with Auto-Restart (Optional)

Install `nodemon` for automatic restarts on file changes:

```bash
npm install -g nodemon
nodemon app.js
```

---

##  Scripts

| Command | Description |
|---|---|
| `node app.js` | Start the application |
| `nodemon app.js` | Start with auto-restart on changes |

---

##  Live Demo

The application is deployed on Render:

👉 [https://soultrip-nine.vercel.app](https://soultrip-nine.vercel.app)

---

##  Author

**Shyam Babariya**
- GitHub: [@shyambabariya](https://github.com/shyambabariya)
