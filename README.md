# 🛡️ VigiLynx

> ⚠️ **Group Project** — collaboratively built to enhance cybersecurity awareness and protection.

---

## 🔍 Overview

**VigiLynx** is a next-gen AI-powered cybersecurity platform that empowers users with real-time threat detection, parental controls, community-driven insights, and educational tools. Built using **React** and **Node.js**, it offers a unified dashboard for phishing detection, password safety, cyber awareness, and more — all in one place.

---

## 🚀 Key Features

- 🧠 **Phishing Detection**  
  Detects phishing URLs using machine learning and security heuristics.

- 🛡️ **Malware Detection**  
  Planned functionality to analyze and block malicious code and downloads.

- 👨‍👩‍👧‍👦 **Parental Monitoring**  
  Monitor child activity, screen time, and flag risky behavior online.

- 📰 **Cybersecurity News**  
  Stay up to date with curated cybersecurity articles, news, and updates.

- 💬 **Community Posts**  
  Discuss threats, share experiences, and ask questions in a dedicated community space.

- 🎓 **Cybersecurity Learning Section**  
  Interactive modules, lessons, and quizzes to improve cyber hygiene and literacy.

- 🔑 **Password Checker**  
  Instantly evaluate password strength and receive suggestions for improvement.

- 🔐 **Password Generator**  
  Generate secure, customizable passwords for personal and professional use.

---

## 🛠️ Tech Stack

### 👨‍💻 Frontend
- **React** – Component-based UI
- **JavaScript (ES6+)** – Application logic
- **HTML5 & CSS3** – Structure and styling

### 🖥️ Backend
- **Node.js** – Server runtime
- **Express.js** – RESTful API framework

### ⚙️ Tools & Libraries
- **npm** – Package manager
- **Babel** – Transpiler for modern JavaScript (used in build tools)

---

## 🧪 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Srikara354/-VigiLynx-
cd -VigiLynx-
```
### 2.Set Up Environment Variables
Create a .env file in both the client and server directories based on the following templates:
client/.env
```
VITE_API_URL=your_api_url_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_NEWS_API_KEY=your_news_api_key_here
VITE_DEFAULT_CURRENCY=INR
```
server/.env
```
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_service_role_key_here
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=your_server_port_here
```
### 3. Start the Backend
```bash
cd server
npm install
node index.js
```
### 3. Start the Frontend
```bash
cd client
npm install
npm start
```

## 📈 Future Enhancements
🧠 AI-powered image-based phishing detection

✉️ Email scanner for malicious attachments and links

📲 Mobile app integration

🌐 Real-time cyber threat map

## 📬 Contact
For any questions or issues, feel free to reach out:
Email: srikara354@gmail.com

## 🤝 Contributors
This project is a collaborative group effort developed by a team of cybersecurity enthusiasts and developers as part of an academic initiative.




