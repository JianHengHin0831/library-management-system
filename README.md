# Full-Stack Library Management System

> **:warning: Project Status Notice**
> Please note that the external authentication service used for user login and registration in this project is no longer active. As a result, the live user-facing features are currently unavailable.
> However, the complete source code for both the frontend and backend is fully accessible in this repository for review. To showcase the project's functionality and user interface, please see the screenshots and GIF demo provided below.

## 🌟 Overview

This is a full-stack web application developed as a major project for my university course, where it received a grade of **80%**. The system is designed to streamline library operations by providing a digital platform for users to browse, borrow, and manage books, while also featuring an administrative interface for librarians.

A key highlight of this project is the integration of a simple NLP-powered chatbot, demonstrating the application of AI concepts within a traditional software engineering context.

✨ Key Features
This application is divided into two primary components: a comprehensive Admin Portal for library staff and a user-friendly Student Portal.
👑 Admin Portal (Core Functionality)
The administrative backend is the heart of the system, equipped with powerful tools for complete library management:
🚀 Efficient Circulation Desk:
Features integrated support for scanning student ID cards and book QR codes for rapid check-in and check-out processes.
Automatically calculates and logs late return fees.
📚 Comprehensive Acquisition & Cataloging:
A complete workflow for registering new acquisitions, from purchase order to shelf-readiness.
Supports scanning book barcodes (ISBN) to auto-populate title information.
Auto-generates unique accession numbers and printable QR codes for every new book, ensuring easy tracking.
Maintains a detailed purchase history for budgeting and reporting.
📊 Analytics Dashboard:
Provides an at-a-glance overview of key library metrics, such as borrowing trends, popular genres, and total fines collected.
⚙️ Robust Management Systems:
Inventory Management: Real-time tracking of book status (available, on loan, overdue, under maintenance) and physical location.
User Management: A central database of all student profiles, including their borrowing history, contact details, and account status.
Circulation Control: A powerful interface to monitor all active loans, easily identify overdue items, and manage reservations.

👤 Personalized Dashboard:
Allows students to view their personal borrowing history, currently checked-out books with due dates, pending reservations, and any outstanding fines.
🤖 NLP-Powered Assistant:
An integrated chatbot designed to answer frequently asked questions about library services (e.g., "What are the library hours?", "How do I reserve a book?").
The chatbot works by extracting keywords from user queries and calculating cosine similarity to provide the most relevant, instant answer.
🔍 Advanced Search & Discovery:
Provides a dedicated portal to access the university's subscribed online journals and other digital resources.

## 🛠️ Tech Stack

*   **Frontend:** HTML, CSS, JavaScript=
*   **Backend:** Node.js, Express.js
*   **Database:** MySQL

## 📸 Screenshots & Demo
Here are some snapshots of the application's interface.

**Login Page:**
<img width="1864" height="787" alt="image" src="https://github.com/user-attachments/assets/f338d5a0-b1ea-4428-b904-d9783a25d816" />

**Student Interface:**
<img width="1855" height="794" alt="image" src="https://github.com/user-attachments/assets/b1b96dd5-cc86-4643-9bd1-77c8b58ee32c" />

**Admin Interface:**
<img width="1860" height="797" alt="image" src="https://github.com/user-attachments/assets/b9faa44a-9079-433b-9e1f-354b213eb1f4" />

**Chatbot Interface:**
<img width="1855" height="803" alt="image" src="https://github.com/user-attachments/assets/5f3aa081-4fcf-4dd0-b4da-840b25931adc" />

