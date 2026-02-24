# Surrender — Delayed Letter Communication Experiment

Surrender is a small experimental communication system that explores uncertainty and time in digital messaging.
Instead of instant delivery, messages are encrypted, stored temporarily, and sent after a random delay.

This project was developed as part of a Communication and Technology course and investigates how technical systems can shape emotional experience.

---

## What This Project Does

* Multi-screen web interface for writing a message
* Client-side AES encryption before storage
* Node.js server with scheduled delivery
* SQLite database for temporary message storage
* Automatic deletion after sending

The system intentionally removes instant feedback and introduces waiting as part of the interaction.

---

## Tech Stack

* Node.js + Express
* SQLite3
* Nodemailer (Gmail SMTP)
* node-cron
* CryptoJS
* HTML / CSS / JavaScript

---

## Run Locally

1. Install dependencies

npm install

2. Create a `.env` file in the root folder:

EMAIL_USER=[your_email@gmail.com](mailto:your_email@gmail.com)
EMAIL_PASS=your_app_password
EMAIL_FROM=[your_email@gmail.com](mailto:your_email@gmail.com)
ENCRYPTION_KEY=your_secret_key

3. Start the server

node server.js

4. Open in browser:

http://localhost:3000

---

## Notes

* This repository is a portfolio and research project, not a production tool.
* Email delivery requires a Gmail App Password and 2FA enabled.
* Messages are encrypted before storage and deleted after sending.

---

## Documentation

Conceptual notes, exhibit material, and process documentation are available in the `/docs` folder.
