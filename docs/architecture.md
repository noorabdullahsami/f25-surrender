## System Architecture

Surrender is a full-stack web application built on a JavaScript-based client–server model. The system enables users to compose encrypted messages that are delivered asynchronously after a scheduled delay. The architecture prioritizes clear separation of concerns, predictable data flow, and secure handling of user content throughout its lifecycle.

---

## Architectural Overview

Client (Browser)
→ Encryption Layer
→ REST API (Node.js / Express)
→ SQLite Persistence
→ Scheduled Worker
→ Email Delivery Service
→ Data Cleanup

The application follows a lightweight service-oriented structure while maintaining a monolithic deployment model for simplicity.

---

## Client Layer

**Responsibilities**

* Capture user input and scheduling metadata
* Perform client-side AES encryption prior to transmission
* Send encrypted payloads to the API

**Technologies**

* HTML / CSS / JavaScript
* CryptoJS

Encryption occurs before any network request, ensuring plaintext is never transmitted during initial submission.

---

## Server Layer (Node.js + Express)

The Express server acts as both an API gateway and orchestration layer.

**Core Responsibilities**

* Validate incoming requests
* Persist encrypted message payloads
* Manage scheduled delivery workflows
* Coordinate email transport

**Key Modules**

* Express: routing and middleware
* SQLite3: lightweight relational storage
* node-cron: background scheduling
* Nodemailer: SMTP email delivery

The server operates statelessly except for database persistence.

---

## Data Persistence

Database: SQLite

Table: `messages`

**Primary Fields**

* `fromName`
* `toName`
* `toEmail`
* `ciphertext`
* `createdAt`
* `scheduledSendAt`
* `sent` (boolean flag)

Messages are stored only for the duration required to complete delivery. After successful transmission, records are removed to reduce long-term data exposure.

---

## Scheduling and Background Processing

A cron-based scheduler runs periodic delivery checks.

Trigger mechanisms:

* Hourly cron execution
* Short-interval loop used during development/testing

The scheduler queries for records where:

* `scheduledSendAt <= current time`
* `sent = 0`

This approach avoids long-running workers while maintaining predictable delivery timing.

---

## Delivery Pipeline

1. Retrieve encrypted payload from database
2. Decrypt using server-managed key
3. Generate HTML email content
4. Send via SMTP transport (Nodemailer)
5. Mark record as sent and delete after confirmation

Each stage is isolated to simplify debugging and monitoring.

---

## Security Model

* Encryption occurs on the client before storage
* Sensitive credentials are loaded through environment variables
* Database contains encrypted text until delivery
* Message retention is minimized through automatic deletion

---

## Deployment Considerations

The current implementation is optimized for local or controlled environments. Production deployment would require:

* Managed environment variables and secrets storage
* Job monitoring and failure handling
* SMTP throughput management
* Logging and observability

---

## Architectural Principles

* Minimal infrastructure complexity
* Transparent data flow
* Privacy-first handling of user content
* Design aligned with delayed communication behavior rather than high-scale throughput