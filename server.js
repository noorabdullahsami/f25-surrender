require('dotenv').config();

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const CryptoJS = require('crypto-js');
const path = require('path');

const app = express();
const PORT = 3000;

// encryption key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fromName TEXT NOT NULL,
        toName TEXT NOT NULL,
        toEmail TEXT NOT NULL,
        ciphertext TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        scheduledSendAt TEXT NOT NULL,
        sent INTEGER DEFAULT 0
      )
    `);
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

app.post('/send', (req, res) => {
  const { fromName, toName, toEmail, ciphertext } = req.body;
  
  if (!fromName || !toName || !toEmail || !ciphertext) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const createdAt = new Date().toISOString();
  
  // Random delay between 1-7 days
  const randomDays = Math.floor(Math.random() * 7) + 1;
  // randomDays = 0 // degbugging purpose. sends message quicker to see if server is working 
  const scheduledSendAt = new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000).toISOString();

  const sql = `INSERT INTO messages (fromName, toName, toEmail, ciphertext, createdAt, scheduledSendAt) VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [fromName, toName, toEmail, ciphertext, createdAt, scheduledSendAt], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to store message' });
    }
    
    console.log(`Message stored. ID: ${this.lastID}, will send on: ${scheduledSendAt}`);
    res.json({ success: true, scheduledFor: scheduledSendAt });
  });
});

// Function to check and send due messages
function checkAndSendMessages() {
  const now = new Date().toISOString();
  
  db.all('SELECT * FROM messages WHERE sent = 0 AND scheduledSendAt <= ?', [now], (err, rows) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return;
    }
    
    rows.forEach(msg => {
      // Decrypt message
      const decrypted = CryptoJS.AES.decrypt(msg.ciphertext, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      
      // Compose email
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: msg.toEmail,
        subject: `A message for ${msg.toName}`,
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <p style="color: #6B7280; font-size: 14px; font-style: italic; margin-bottom: 30px;">
              This message was sent through "Surrender," an experimental communication project 
              exploring uncertainty and time in the age of instant messaging. It was written several days ago 
              and delayed intentionally to restore the experience of waiting.
            </p>
            
            <div style="background: #FAF9F6; border-left: 3px solid #4A5568; padding: 30px; margin: 20px 0;">
              <p style="font-size: 16px; margin-bottom: 15px;">Dear ${msg.toName},</p>
              <p style="font-size: 16px; line-height: 1.8; white-space: pre-wrap;">${decrypted}</p>
              <p style="font-size: 16px; margin-top: 20px;">Yours,<br>${msg.fromName}</p>
            </div>
            
            <p style="color: #9CA3AF; font-size: 12px; margin-top: 40px;">
              This message was encrypted before being stored and has now been deleted from our server.
            </p>
          </div>
        `
      };
      
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Failed to send message ${msg.id}:`, error);
        } else {
          console.log(`Message ${msg.id} sent to ${msg.toEmail}`);
          
          // Mark as sent and delete from database
          db.run('DELETE FROM messages WHERE id = ?', [msg.id], (err) => {
            if (err) {
              console.error('Error deleting message:', err);
            } else {
              console.log(`Message ${msg.id} deleted from database`);
            }
          });
        }
      });
    });
  });
}

// Run checker
cron.schedule('0 * * * *', () => {
  console.log('Checking for messages to send...');
  checkAndSendMessages();
});

// Also check on startup and every 5 minutes (for testing)
checkAndSendMessages();
// setInterval(checkAndSendMessages, 5 * 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Message checker is active.');
});