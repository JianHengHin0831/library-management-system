const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); 
const path = require('path');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const { Client, Config, CheckoutAPI } = require('@adyen/api-library');
const { type } = require('os');
const axios = require('axios');


const app = express(); 
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library_system',
};

const transporter = nodemailer.createTransport({ 
    service: 'Outlook',
    auth: {
        user: '', //need to change
        pass: '' //need to change
    }
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = mysql.createPool(dbConfig);


// const config();
//config.apiKey = 'AQExhmfxLo7PYhdGw0m/n3Q5qf3VYI5BAZxpV2hGx3ayyjEY7nWgrC+dOyvmgQk/gU2ElBDBXVsNvuR83LVYjEgiTGAH-uktYRwJ3LAhJsb2tGDiBJiI7e3f6VPqbgULxMaG8P6Y=-*^#C)c7vP~keNF]u';
// config.merchantAccount = 'HelloCompany473ECOM';
// const client = new Client({ config });
// client.setEnvironment("TEST");
const client = new Client({apiKey: "AQExhmfxLo7PYhdGw0m/n3Q5qf3VYI5BAZxpV2hGx3ayyjEY7nWgrC+dOyvmgQk/gU2ElBDBXVsNvuR83LVYjEgiTGAH-uktYRwJ3LAhJsb2tGDiBJiI7e3f6VPqbgULxMaG8P6Y=-*^#C)c7vP~keNF]u", environment: "TEST"});
//const checkout = new CheckoutAPI(client);


app.post('/payFines', async (req, res) => {
    const finesAmount = req.query.finesAmount;

    try {
        const paymentRequest = {
            xapikey: 'AQExhmfxJ4nKbh1Cw0m/n3Q5qf3VYI5BAZxpV2hGx3ayyjEYqzPhSBS0AMkxMXVHOg3+ZBDBXVsNvuR83LVYjEgiTGAH-wqaYTr0ERLOgIm06zgcvZuX3g1g19oDV1xKHjo7BSDw=-+#h9Ya*nncEK+Qw9',
            merchantAccount: "HelloCompany473ECOM",
            reference: "YOUR_ORDER_NUMBER",
            amount: {
                currency: "MYR",
                value: 10
            },
            paymentMethod: {
                type: "touchngo"
            },
            returnUrl: "https://google.com",
            additionalData: {
                acquirerAccountCode: "TestPmmAcquirerAccount",
                authorisationMid: "1009"
            }
        };
        
           
          const checkoutAPI = new CheckoutAPI(client);
          const response = checkoutAPI.PaymentsApi.payments(paymentRequest, { idempotencyKey: "UUID" });
          
        if (response.resultCode === "RedirectShopper" && response.action) {
  
            res.redirect(response.action.url);
        } else {
            res.status(400).json({ success: false, message: 'Payment initiation failed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/paymentResult', async (req, res) => {
    const redirectResult = req.query.redirectResult;

    try {
        const detailResponse = await checkout.paymentsDetails({
            details: {
                redirectResult: redirectResult
            }
        });
        if (detailResponse.resultCode === "Authorised") {
            res.json({ success: true, message: 'Payment successful' });
        } else {
            res.json({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/paymentMethods', async (req, res) => {
    try {
      const response = await fetch('https://checkout-test.adyen.com/v71/paymentMethods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'AQExhmfxJ4nKbh1Cw0m/n3Q5qf3VYI5BAZxpV2hGx3ayyjEYqzPhSBS0AMkxMXVHOg3+ZBDBXVsNvuR83LVYjEgiTGAH-wqaYTr0ERLOgIm06zgcvZuX3g1g19oDV1xKHjo7BSDw=-+#h9Ya*nncEK+Qw9'
        },
        body: JSON.stringify(req.body),
      });
  
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT user_id, user_role, password_hash FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            const hashedPassword = rows[0].password_hash;
    

            const isPasswordCorrect = await bcrypt.compare(password,hashedPassword);
          
            if (isPasswordCorrect) {
                const userRole = rows[0].user_role;
                const userId = rows[0].user_id;
                res.json({ success: true, role: userRole, userId: userId });
                
            } else {
                res.json({ success: false, message: 'Invalid credentials' });
                
            }
        } else {
            res.json({ success: false, message: 'User not found' });

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



app.post('/view', async (req, res) => {
    const { userId } = req.body; 

    try {
        let query =
            "SELECT f.user_id, f.accession_number, f.fines_price, b.processing_fee " +
            "FROM fines f " +
            "JOIN copies c ON f.accession_number = c.accession_number " +
            "JOIN book b ON c.ISBN = b.ISBN " +
            "WHERE f.status='Overdue'";

        if (userId && userId.trim() !== "") {
            query += " AND f.user_id = ?";
        }

        const [rows] = await pool.query(query, [userId]);

        let totalFines = parseFloat(0.0)

        for (const row of rows) {
            const finesPrice = row.fines_price;
            const processingFee = row.processing_fee;
          
            totalFines += parseFloat(finesPrice) + parseFloat(processingFee);
        }

        res.json({ success: true, totalFines: totalFines });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/viewBorrowed', async (req, res) => {
    const { userId } = req.body; 

    try {
        let query =
            "SELECT f.user_id, f.accession_number, f.fines_price, b.processing_fee " +
            "FROM fines f " +
            "JOIN copies c ON f.accession_number = c.accession_number " +
            "JOIN book b ON c.ISBN = b.ISBN " +
            "WHERE f.status='Overdue'";

        if (userId && userId.trim() !== "") {
            query += " AND f.user_id = ?";
        }

        const [rows] = await pool.query(query, [userId]);

        let totalFines = parseFloat(0.0)

        for (const row of rows) {
            totalFines+=1
        }

        res.json({ success: true, totalFines: totalFines });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/countBorrowedBooks', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = "SELECT COUNT(*) AS borrowedBooksCount FROM circulation WHERE user_id = ? AND borrow_status != 'Return'";
        const [rows] = await pool.query(query, [userId]);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getBorrowedBooks', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = `
            SELECT br.borrow_id, b.book_cover, b.title, b.authors, b.isbn, br.accession_number, br.check_out_date, br.due_date, br.renewal_count
            FROM circulation br
            JOIN copies c ON c.accession_number = br.accession_number
            JOIN book b ON b.ISBN = c.ISBN
            WHERE br.user_id = ? AND br.borrow_status != 'Return'`;

        const [rows] = await pool.query(query, [userId]);

        const borrowedBooks = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.book_cover, { encoding: 'base64' });
                return { 
                    borrowId: row.borrow_id,
                    title: row.title,
                    authors: row.authors,
                    isbn: row.isbn,
                    accessionNumber: row.accession_number,
                    borrowDate: row.check_out_date,
                    returnDate: row.due_date,
                    renewalCount: row.renewal_count,
                    book_cover_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching book cover:', error);
                return { 
                    borrowId: row.borrow_id,
                    title: row.title,
                    authors: row.authors,
                    isbn: row.isbn,
                    accessionNumber: row.accession_number,
                    borrowDate: row.check_out_date,
                    returnDate: row.due_date,
                    renewalCount: row.renewal_count,
                    book_cover_base64: null
                };
            }
        }));

        res.json({ success: true, borrowedBooks: borrowedBooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getFavouriteBooks', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = `
            SELECT b.book_cover, b.authors, b.title, b.ISBN
            FROM favourite f
            JOIN book b ON f.ISBN = b.ISBN
            WHERE f.user_id = ?`;

        const [rows] = await pool.query(query, [userId]);

        const favouriteBooks = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.book_cover, { encoding: 'base64' });
                return { 
                    authors: row.authors,
                    title: row.title,
                    book_cover_base64: base64data,
                    isbn: row.ISBN
                };
            } catch (error) {
                console.error('Error fetching book cover:', error);
                return { 
                    authors: row.authors,
                    title: row.title,
                    book_cover_base64: null
                };
            }
        }));


        res.json({ success: true, favouriteBooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/getMostBorrowedBooks', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = `
        SELECT b.book_cover, b.title, b.authors,b.ISBN, COUNT(*) AS borrow_count
        FROM circulation AS c
        JOIN copies AS co ON c.accession_number = co.accession_number
        JOIN book AS b ON co.ISBN = b.ISBN
        GROUP BY b.ISBN
        ORDER BY borrow_count DESC;`;

        const [rows] = await pool.query(query);

        const borrowedBooks = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.book_cover, { encoding: 'base64' });
                return { 
                    ISBN: row.ISBN,
                    authors: row.authors,
                    title: row.title,
                    book_cover_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching book cover:', error);
                return { 
                    ISBN: row.ISBN,
                    authors: row.authors,
                    title: row.title,
                    book_cover_base64: null
                };
            }
        }));


        res.json({ success: true, borrowedBooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getTodayBorrowedBooks', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = `
        SELECT b.book_cover, b.title, b.authors,c.user_id
      FROM circulation AS c
      JOIN copies AS co ON c.accession_number = co.accession_number
      JOIN book AS b ON co.ISBN = b.ISBN
      WHERE DATE(c.check_out_date) = CURDATE()
      LIMIT 4`;

        const [rows] = await pool.query(query);

        const borrowedBooks = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.book_cover, { encoding: 'base64' });
                return { 
                    authors: row.authors,
                    title: row.title,
                    userId:row.user_id,
                    book_cover_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching book cover:', error);
                return { 
                    authors: row.authors,
                    title: row.title,
                    userId:row.user_id,
                    book_cover_base64: null
                };
            }
        }));


        res.json({ success: true, borrowedBooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getTodayReturnedBooks', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = `
        SELECT b.book_cover, b.title, b.authors,c.user_id
      FROM circulation AS c
      JOIN copies AS co ON c.accession_number = co.accession_number
      JOIN book AS b ON co.ISBN = b.ISBN
      WHERE DATE(c.returned_date) = CURDATE()
      LIMIT 4`;

        const [rows] = await pool.query(query);

        const borrowedBooks = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.book_cover, { encoding: 'base64' });
                return { 
                    authors: row.authors,
                    title: row.title,
                    userId:row.user_id,
                    book_cover_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching book cover:', error);
                return { 
                    authors: row.authors,
                    title: row.title,
                    userId:row.user_id,
                    book_cover_base64: null
                };
            }
        }));


        res.json({ success: true, returnedBooks: borrowedBooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/getRecommendedBooks', async (req, res) => {
    try {
        const query = `
        SELECT 
        b.book_cover, 
        b.title, 
        b.authors, 
        b.ISBN,
        IFNULL(AVG(CASE WHEN r.rating_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) THEN r.rating ELSE NULL END), 0) AS average_rating, 
        CASE 
            WHEN COUNT(CASE WHEN r.rating = 5 THEN u.name END) = 1 THEN GROUP_CONCAT(CASE WHEN r.rating = 5 THEN u.name END)
            WHEN COUNT(CASE WHEN r.rating = 5 THEN u.name END) = 2 THEN GROUP_CONCAT(CASE WHEN r.rating = 5 THEN u.name END)
            WHEN COUNT(CASE WHEN r.rating = 5 THEN u.name END) > 2 THEN CONCAT(SUBSTRING_INDEX(GROUP_CONCAT(CASE WHEN r.rating = 5 THEN u.name END), ',', 2), ', and others')
            ELSE 'admin'
        END AS recommended_by
    FROM 
        book b
    LEFT JOIN 
        rating r ON b.ISBN = r.ISBN
    LEFT JOIN 
        users u ON r.user_id = u.user_id
    GROUP BY  
        b.ISBN
    HAVING 
        IFNULL(AVG(CASE WHEN r.rating_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) THEN r.rating ELSE NULL END), 0) >= 3
    ORDER BY 
        average_rating DESC;
        `;
        const [rows] = await pool.query(query);

        const recommendedBooks = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.book_cover, { encoding: 'base64' });
                return { 
                    ISBN:row.ISBN,
                    title: row.title,
                    authors:row.authors,
                    rating:row.average_rating,
                    recommended_by: row.recommended_by,
                    book_cover_base64: base64data ,
                    
                };
            } catch (error) {
                console.error('Error fetching book cover:', error);
                return { 
                    ISBN:row.ISBN,
                    title: row.title,
                    authors:row.authors,
                    rating:row.average_rating,
                     recommended_by: row.recommended_by,
                    book_cover_base64: null
                };
            }
        }));

        res.json({ success: true, recommendedBooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/average-rating', async (req, res) => {
    try {
        const ISBN = req.body.isbn;
        const query = `
            SELECT IFNULL(ROUND(AVG(r.rating), 1), 0.0) AS average_rating
            FROM book b
            LEFT JOIN rating r ON b.ISBN = r.ISBN
            WHERE b.ISBN = ?
            GROUP BY b.ISBN
        `; 

        const [rows] = await pool.query(query, [ISBN]);
        if (rows.length > 0) {
            res.json({ success: true, averageRating: rows[0].average_rating });
        } else {
            res.json({ success: false, message: 'No average rating found for the specified ISBN.' });
        }
    } catch (error) {
        console.error('Error fetching average rating:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

app.post('/ratings', async (req, res) => {
    try {
        const ISBN = req.body.isbn;
        const query = `
        SELECT u.department, u.name, u.profile_pic, r.rating, r.comments
        FROM rating r 
        JOIN users u ON r.user_id = u.user_id
        WHERE r.ISBN = ?;
        `; 

        const [rows] = await pool.query(query, [ISBN]);

        const borrowedBooks = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.profile_pic, { encoding: 'base64' });
                return { 
                    department:row.department,
                    name:row.name,
                    comments:row.comments,
                    rating:row.rating,
                    book_cover_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching book cover:', error);
                return { 
                    department:row.department,
                    name:row.name,
                    comments:row.comments,
                    rating:row.rating,
                    book_cover_base64: null
                };
            }
        }));

        if (rows.length > 0) {
            res.json({ success: true, ratings: borrowedBooks});
        } else {
            res.json({ success: false, message: 'No average rating found for the specified ISBN.' });
        }
    } catch (error) {
        console.error('Error fetching average rating:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

app.post('/getBorrowedHistory', async (req, res) => {
    const userId = req.body.userId;
    const searchInput = req.body.searchInput;

    try {
        let query = `
            SELECT br.borrow_id, b.title, b.authors, b.isbn, br.accession_number, br.check_out_date, br.due_date, br.borrow_status
            FROM circulation br
            JOIN copies c ON c.accession_number = br.accession_number
            JOIN book b ON b.ISBN = c.ISBN
            WHERE br.user_id = ?`;

        const queryParams = [userId];

        if (searchInput) {
            query += ` AND (
                br.borrow_id LIKE '%${searchInput}%' OR
                b.title LIKE '%${searchInput}%' OR
                b.authors LIKE '%${searchInput}%' OR
                b.ISBN LIKE '%${searchInput}%' OR
                br.accession_number LIKE '%${searchInput}%' OR
                br.check_out_date LIKE '%${searchInput}%' OR
                br.due_date LIKE '%${searchInput}%' OR
                br.borrow_status LIKE '%${searchInput}%'
            )`;
        }

        const [rows] = await pool.query(query, queryParams);

        const borrowedBooks = rows.map(row => ({
            borrowId: row.borrow_id,
            title: row.title,
            authors: row.authors,
            isbn: row.isbn,
            accessionNumber: row.accession_number,
            borrowDate: row.check_out_date,
            returnDate: row.due_date,
            status: row.borrow_status
        }));

        res.json({ success: true, borrowedBooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// app.post('/getBorrowedHistory', async (req, res) => {
//     const userId = req.body.userId;

//     try {
//         const query = `
//             SELECT br.borrow_id, b.title, b.authors, b.isbn, br.accession_number, br.check_out_date, br.due_date, br.borrow_status
//             FROM circulation br
//             JOIN copies c ON c.accession_number = br.accession_number
//             JOIN book b ON b.ISBN = c.ISBN
//             WHERE br.user_id = ? `;

//         const [rows] = await pool.query(query, [userId]);

//         const borrowedBooks = rows.map(row => ({
//             borrowId: row.borrow_id,
//             title: row.title,
//             authors: row.authors,
//             isbn: row.isbn,
//             accessionNumber: row.accession_number,
//             borrowDate: row.check_out_date,
//             returnDate: row.due_date,
//             status: row.borrow_status
//         }));

//         res.json({ success: true, borrowedBooks });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });

// app.post('/getFines', async (req, res) => {
//     const userId = req.body.userId;
//     const searchInput = req.body.searchInput;

//     try {
//         const query = `
//         SELECT f.fines_id, f.borrow_id, b.title, b.authors, b.ISBN, f.accession_number, b.price, f.fines_price, DATEDIFF( br.due_date,CURDATE()) AS days_late, f.status
//         FROM fines f
//         JOIN circulation br ON br.borrow_id = f.borrow_id
//         JOIN copies c ON f.accession_number = c.accession_number
//         JOIN book b ON c.ISBN = b.ISBN
//         WHERE f.status != 'Completed' AND f.user_id = ?
//         `;

//         const [rows] = await pool.query(query, [userId]);

//         const fine = rows.map(row => ({
//             finesId: row.fines_id,
//             borrowId: row.borrow_id,
//             title: row.title,
//             authors: row.authors,
//             isbn: row.ISBN,
//             accessionNumber: row.accession_number,
//             price: row.price,
//             finesPrice: row.fines_price,
//             daysLate: row.days_late,
//             status: row.status,
//         }));
//         res.json({ success: true, fine });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });

app.post('/getFines', async (req, res) => {
    const userId = req.body.userId;
    const searchInput = req.body.searchInput;

    try {
        let query = `
        SELECT f.fines_id, f.borrow_id, b.title, b.authors, b.ISBN, f.accession_number, b.price, f.fines_price, DATEDIFF(br.due_date, CURDATE()) AS days_late, f.status
        FROM fines f
        JOIN circulation br ON br.borrow_id = f.borrow_id
        JOIN copies c ON f.accession_number = c.accession_number
        JOIN book b ON c.ISBN = b.ISBN
        WHERE f.status != 'Completed' AND f.user_id = ?`;

        const queryParams = [userId];

        if (searchInput) {
            query += ` AND (
                f.fines_id LIKE ? OR
                f.borrow_id LIKE ? OR
                b.title LIKE ? OR
                b.authors LIKE ? OR
                b.ISBN LIKE ? OR
                f.accession_number LIKE ? OR
                b.price LIKE ? OR
                f.fines_price LIKE ? OR
                f.status LIKE ?
            )`;
            queryParams.push(...Array(10).fill(`%${searchInput}%`));
        }

        const [rows] = await pool.query(query, queryParams);

        const fines = rows.map(row => ({
            finesId: row.fines_id,
            borrowId: row.borrow_id,
            title: row.title,
            authors: row.authors,
            isbn: row.ISBN,
            accessionNumber: row.accession_number,
            price: row.price,
            finesPrice: row.fines_price,
            daysLate: row.days_late,
            status: row.status,
        }));
        res.json({ success: true, fines });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/getFinesC', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = `
        SELECT f.fines_id, f.borrow_id, b.title, f.fines_price, DATEDIFF( br.due_date,CURDATE()) AS days_late, b.processing_fee
        FROM fines f
        JOIN circulation br ON br.borrow_id = f.borrow_id
        JOIN copies c ON f.accession_number = c.accession_number
        JOIN book b ON c.ISBN = b.ISBN
        WHERE f.status != 'Completed' AND f.user_id = ?
        `;

        const [rows] = await pool.query(query, [userId]);

        let total = 0;
        const fine = rows.map(row => {
            total += parseFloat(row.fines_price)+ parseFloat(row.processing_fee);

            return {
                finesId: row.fines_id,
                borrowId: row.borrow_id,
                title: row.title,
                finesPrice: row.fines_price,
                daysLate: row.days_late,
                processingFee: row.processing_fee
            };
        });
        res.json({ success: true, fine,total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getFinesB', async (req, res) => {
    const searchInput = req.body.searchInput;
    try {
        var query = `
        SELECT f.fines_id, f.user_id, f.borrow_id, b.title, b.authors, b.ISBN, f.accession_number, b.price, f.fines_price, DATEDIFF( br.due_date,CURDATE()) AS days_late, f.status
        FROM fines f
        JOIN circulation br ON br.borrow_id = f.borrow_id
        JOIN copies c ON f.accession_number = c.accession_number
        JOIN book b ON c.ISBN = b.ISBN
        WHERE f.status != 'Completed'
        `;

        const queryParams = [];

    if (searchInput) {
        query += ` AND (
                    f.fines_id LIKE ? OR
                    f.borrow_id LIKE ? OR
                    f.user_id LIKE ? OR
                    b.title LIKE ? OR
                    b.ISBN LIKE ? OR
                    b.authors LIKE ? OR
                    f.accession_number LIKE ? OR
                    b.price LIKE ? OR
                    f.fines_price LIKE ? OR
                    DATEDIFF( br.due_date,CURDATE()) LIKE ? OR
                    f.status LIKE ? 
                    
                )`;
        queryParams.push(
            ...Array(11).fill(`%${searchInput}%`), 
        );
    }

        const [rows] = await pool.query(query,queryParams);

        const fine = rows.map(row => ({
            finesId: row.fines_id,
            borrowId: row.borrow_id,
            userId: row.user_id,
            title: row.title,
            authors: row.authors,
            isbn: row.ISBN,
            accessionNumber: row.accession_number,
            price: row.price,
            finesPrice: row.fines_price,
            daysLate: row.days_late,
            status: row.status,
        }));
        res.json({ success: true, fine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/pendingPayment', async (req, res) => {
    const searchInput = req.body.searchInput;
    try {
        var query = `
        SELECT f.fines_id, f.user_id, f.borrow_id, b.title, f.accession_number, f.fines_price,f.temp_files
        FROM fines f
        JOIN circulation br ON br.borrow_id = f.borrow_id
        JOIN copies c ON f.accession_number = c.accession_number
        JOIN book b ON c.ISBN = b.ISBN
        WHERE f.status = 'Pending'
        `;

        const queryParams = [];

    if (searchInput) {
        query += ` AND (
                    f.fines_id LIKE ? OR
                    f.borrow_id LIKE ? OR
                    f.user_id LIKE ? OR
                    b.title LIKE ? OR
                    f.accession_number LIKE ? OR
                    f.fines_price LIKE ?
                    
                )`;
        queryParams.push(
            ...Array(6).fill(`%${searchInput}%`), 
        );
    }

        const [rows] = await pool.query(query,queryParams);

        const fine = rows.map(row => ({
            finesId: row.fines_id,
            borrowId: row.borrow_id,
            userId: row.user_id,
            title: row.title,
            authors: row.authors,
            accessionNumber: row.accession_number,
            finesPrice: row.fines_price,
            temp_files: row.temp_files,
        }));
        res.json({ success: true, fine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.put('/confirmPayment/:finesId', async (req, res) => {
    const { finesId } = req.params;
  
    try {
      const connection = await pool.getConnection();
      await connection.query('UPDATE fines SET status = "Completed" WHERE fines_id = ?', [finesId]);
      connection.release();
      res.status(200).json({ success: true, message: 'Payment confirmed successfully.' });
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });

  app.put('/payFinesA/:finesId', async (req, res) => {
    const { finesId } = req.params;
  
    try {
      const connection = await pool.getConnection();
      await connection.query('UPDATE fines SET status = "Completed" WHERE user_id = ?', [finesId]);
      connection.release();
      res.status(200).json({ success: true, message: 'Payment confirmed successfully.' });
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
  

// app.post('/getReservation', async (req, res) => {
//     const userId = req.body.userId;

//     try {
//         const query = `
//         SELECT
//         b.title,
//         b.authors,
//         b.ISBN,
//         c.accession_number,
//         b.subject_area,
//         b.location,
//         CASE WHEN r.reserve_status = 'Confirmed' THEN 'Available' ELSE 'Unavailable' END AS availability,
//         r.reserve_status
//     FROM
//         reservation r
//     JOIN
//         copies c ON r.accession_number = c.accession_number
//     JOIN
//         book b ON b.ISBN = c.ISBN
//     WHERE
//         r.user_id = ?;
//         `;

//         const [rows] = await pool.query(query, [userId]);

//         const fine = rows.map(row => ({
//             title: row.title,
//             authors: row.authors,
//             isbn: row.ISBN,
//             accessionNumber: row.accession_number,
//             subjectArea: row.subject_area,
//             location: row.location,
//             availability: row.availability,
//             status: row.reserve_status,
//         }));
//         res.json({ success: true, fine });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });

app.post('/getReservation', async (req, res) => {
    const userId = req.body.userId;
    const searchInput = req.body.searchInput;

    try {
        let query = `
        SELECT
            r.reserve_id,
            b.title,
            b.authors,
            b.ISBN,
            c.accession_number,
            b.subject_area,
            b.location,
            CASE WHEN r.reserve_status = 'Confirmed' THEN 'Available' ELSE 'Unavailable' END AS availability,
            r.reserve_status
        FROM
            reservation r
        JOIN
            copies c ON r.accession_number = c.accession_number
        JOIN
            book b ON b.ISBN = c.ISBN
        WHERE
            r.user_id = ?`;

        const queryParams = [userId];

        if (searchInput) {
            query += ` AND (
                b.title LIKE ? OR
                b.authors LIKE ? OR 
                b.ISBN LIKE ? OR
                c.accession_number LIKE ? OR
                b.subject_area LIKE ? OR
                b.location LIKE ? OR
                r.reserve_status LIKE ? OR
                CASE WHEN r.reserve_status = 'Confirmed' THEN 'Available' ELSE 'Unavailable' END LIKE ?
            )`;
            queryParams.push(...Array(8).fill(`%${searchInput}%`));
        }

        const [rows] = await pool.query(query, queryParams);

        const reservations = rows.map(row => ({
            reserve_id: row.reserve_id,
            title: row.title,
            authors: row.authors,
            isbn: row.ISBN,
            accessionNumber: row.accession_number,
            subjectArea: row.subject_area,
            location: row.location,
            availability: row.availability,
            status: row.reserve_status,
        }));
        res.json({ success: true, reservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/getReservationA', async (req, res) => {

    try {
        const query = `
        SELECT
    r.reserve_id,
    r.user_id,
    b.title,
    b.authors,
    b.ISBN,
    c.accession_number,
    b.subject_area,
    b.location,
    CASE WHEN r.reserve_status = 'Confirmed' THEN 'Available' ELSE 'Unavailable' END AS availability,
    r.reserve_status
FROM
    reservation r
JOIN
    copies c ON r.accession_number = c.accession_number
JOIN
    book b ON b.ISBN = c.ISBN
        `;

        const [rows] = await pool.query(query);

        const fine = rows.map(row => ({
            reserve_id: row.reserve_id,
            user_id:row.user_id,
            title: row.title,
            authors: row.authors,
            isbn: row.ISBN,
            accessionNumber: row.accession_number,
            subjectArea: row.subject_area,
            location: row.location,
            availability: row.availability,
            status: row.reserve_status,
        }));
        res.json({ success: true, fine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.post('/getReservationB', async (req, res) => {
    try {
        let query = `
            SELECT
                r.reserve_id,
                r.user_id,
                b.title,
                b.authors,
                b.ISBN,
                c.accession_number,
                b.subject_area,
                b.location,
                CASE WHEN r.reserve_status = 'Confirmed' THEN 'Available' ELSE 'Unavailable' END AS availability,
                r.reserve_status
            FROM
                reservation r
            JOIN
                copies c ON r.accession_number = c.accession_number
            JOIN
                book b ON b.ISBN = c.ISBN
            WHERE 1=1`;

        const queryParams = [];

        const searchInput = req.body.searchTerm;

        if (searchInput) {
            query += ` AND (
                        r.user_id LIKE ? OR
                        b.title LIKE ? OR
                        b.authors LIKE ? OR
                        b.ISBN LIKE ? OR
                        c.accession_number LIKE ? OR
                        b.subject_area LIKE ? OR
                        b.location LIKE ? OR
                        r.reserve_status LIKE ?
                    )`;
            queryParams.push(...Array(8).fill(`%${searchInput}%`));
        }

        const [rows] = await pool.query(query, queryParams);

        const reservations = rows.map(row => ({
            reserve_id: row.reserve_id,
            user_id: row.user_id,
            title: row.title,
            authors: row.authors,
            isbn: row.ISBN,
            accessionNumber: row.accession_number,
            subjectArea: row.subject_area,
            location: row.location,
            availability: row.availability,
            status: row.reserve_status,
        }));
        res.json({ success: true, reservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/cancelReservation', async (req, res) => {
    const { reserveId } = req.body;
    try {
        const updateQuery = 'DELETE FROM reservation WHERE reserve_id = ?';
        await pool.execute(updateQuery, [reserveId]);
        res.json({ success: true, message: 'Renewal successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error during renewal' });
    }
});

app.post('/countReturnedBooksA', async (req, res) => {

    try {
        const query = "SELECT COUNT(*) AS borrowedBooksCount FROM circulation WHERE borrow_status = 'Return'";
        const [rows] = await pool.query(query);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/countOverdueBooksA', async (req, res) => {

    try {
        const query = "SELECT COUNT(*) AS borrowedBooksCount FROM circulation WHERE borrow_status = 'Overdue'";
        const [rows] = await pool.query(query);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/countBorrowedBooksA', async (req, res) => {

    try {
        const query = "SELECT COUNT(*) AS borrowedBooksCount FROM circulation WHERE borrow_status = 'Borrowing'";
        const [rows] = await pool.query(query);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/countBorrowedBooksA', async (req, res) => {

    try {
        const query = "SELECT COUNT(*) AS borrowedBooksCount FROM circulation WHERE borrow_status = 'Borrowing'";
        const [rows] = await pool.query(query);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/findNameA', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = "SELECT name AS borrowedBooksCount FROM users WHERE user_id = ?";
        const [rows] = await pool.query(query, [userId]);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/contactNumberA', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = "SELECT contact_number AS borrowedBooksCount FROM users WHERE user_id = ?";
        const [rows] = await pool.query(query, [userId]);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/emailA', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = "SELECT email AS borrowedBooksCount FROM users WHERE user_id = ?";
        const [rows] = await pool.query(query, [userId]);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/roleA', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = "SELECT user_role AS borrowedBooksCount FROM users WHERE user_id = ?";
        const [rows] = await pool.query(query, [userId]);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/departmentA', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = "SELECT department AS borrowedBooksCount FROM users WHERE user_id = ?";
        const [rows] = await pool.query(query, [userId]);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/countBooksA', async (req, res) => {

    try {
        const query = "SELECT COUNT(*) AS borrowedBooksCount FROM copies";
        const [rows] = await pool.query(query);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/countUsersA', async (req, res) => {

    try {
        const query = "SELECT COUNT(*) AS borrowedBooksCount FROM users";
        const [rows] = await pool.query(query);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/countReservedA', async (req, res) => {

    try {
        const query = "SELECT COUNT(*) AS borrowedBooksCount FROM reservation where reserve_status='Confirmed'";
        const [rows] = await pool.query(query);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/countReservedB', async (req, res) => {
    const { userId } = req.body;
    try {
        const query = "SELECT COUNT(*) AS borrowedBooksCount FROM reservation where reserve_status='Confirmed' And user_id=?";
        const [rows] = await pool.query(query,[userId]);

        const borrowedBooksCount = rows[0].borrowedBooksCount;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/countUniqueA', async (req, res) => {

    try {
        const query = "SELECT COUNT(DISTINCT user_id) AS unique_user_count FROM circulation where borrow_status=\"Overdue\"; ";
        const [rows] = await pool.query(query);

        const borrowedBooksCount = rows[0].unique_user_count;

        res.json({ success: true, borrowedBooksCount: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});





app.post('/viewOverdueA', async (req, res) => {

    try {
        let query =
            "SELECT f.user_id, f.accession_number, f.fines_price, b.processing_fee " +
            "FROM fines f " +
            "JOIN copies c ON f.accession_number = c.accession_number " +
            "JOIN book b ON c.ISBN = b.ISBN " +
            "WHERE f.status='Overdue'";

        const [rows] = await pool.query(query);

        let totalFines = parseFloat(0.0)

        for (const row of rows) {
            const finesPrice = row.fines_price;
            const processingFee = row.processing_fee;
            totalFines += parseFloat(finesPrice) + parseFloat(processingFee);
        }

        res.json({ success: true, totalFines: totalFines });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getFinesA', async (req, res) => {

    try {
        const query = `
        SELECT f.user_id, f.accession_number, b.title, DATEDIFF(br.due_date,CURDATE()) AS days_late,f.fines_price 
        FROM fines f
        JOIN circulation br ON br.borrow_id = f.borrow_id
        JOIN copies c ON f.accession_number = c.accession_number
        JOIN book b ON c.ISBN = b.ISBN
        WHERE f.status != 'Completed' 
        `;

        const [rows] = await pool.query(query);

        const fine = rows.map(row => ({
            userId: row.user_id,
            accessionNumber: row.accession_number,
            title: row.title,
            daysLate: row.days_late,
            finesPrice: row.fines_price
        }));
        res.json({ success: true, fine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getCirculationA', async (req, res) => {

    try {
        const query = `
        SELECT br.user_id, br.accession_number, b.title, br.borrow_status
        FROM circulation br
        JOIN copies c ON br.accession_number = c.accession_number
        JOIN book b ON c.ISBN = b.ISBN;

        `;

        const [rows] = await pool.query(query);

        const fine = rows.map(row => ({
            userId: row.user_id,
            accessionNumber: row.accession_number,
            title: row.title,
            daysLate: row.borrow_status,
        }));
        res.json({ success: true, fine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/getCirculationB', async (req, res) => {
    try {
        const searchInput = req.body.searchInput;
        console.log(searchInput)
        let query = `
            SELECT br.user_id, br.accession_number, b.title, br.borrow_status,br.check_out_date,br.returned_date
            FROM circulation br
            JOIN copies c ON br.accession_number = c.accession_number
            JOIN book b ON c.ISBN = b.ISBN
            WHERE 1=1`;

        const queryParams = [];

        if (searchInput) {
            query += ` AND (
                        br.user_id LIKE ? OR
                        br.accession_number LIKE ? OR
                        b.title LIKE ? OR
                        br.borrow_status LIKE ? OR
                        br.check_out_date LIKE ? OR
                        br.returned_date LIKE ? 
                    )`;
            queryParams.push(...Array(6).fill(`%${searchInput}%`));
        }
        console.log(query)
        const [rows] = await pool.query(query, queryParams);

        const fine = rows.map(row => ({
            userId: row.user_id,
            accessionNumber: row.accession_number,
            title: row.title,
            check_out_date: row.check_out_date,
            returned_date: row.returned_date,
            daysLate: row.borrow_status,
        }));
        res.json({ success: true, fine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



// Your main function or route handler
app.post('/borrowBook', async (req, res) => {
    const { accession_number,  user_id } = req.body;
    if (!accession_number&&!user_id) {
        return res.status(400).json({ success: false, message: 'Please provide accession number and user id ' });
    }
    try {
        const result = await borrowBook(accession_number, user_id);
      
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server' });
    }
});

async function getLimitation() {
    const [rows] = await pool.query('SELECT * FROM setting WHERE setting_name = "Limitation of book"');
    return rows[0].limitation;
}

async function checkUserExist(user_id) {
    console.log("Checking user existence for user_id:", user_id);
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
        console.log("Query result:", rows);
        return rows.length > 0;
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
}

async function getDuration() {
    const [rows] = await pool.query('SELECT * FROM setting WHERE setting_name = "duration"');
    return rows[0].limitation;
}

async function checkAccessionExist(accession_number) {
    const [rows] = await pool.query('SELECT * FROM copies WHERE accession_number = ?', [accession_number]);
    return rows.length > 0;
}

async function checkisRed(accession_number) {
    const [rows] = await pool.query('SELECT b.is_Red FROM book b JOIN copies c ON b.ISBN = c.ISBN WHERE c.accession_number = ?;', [accession_number]);
    return rows[0].is_Red == 1;
}

// Function to handle borrowing logic
async function borrowBook(accession_number,  user_id) {
    let a = null;
    try {
        // Check if user has overdue books or has reached the limitation
        const [overdueRows] = await pool.query('SELECT * FROM circulation WHERE user_id = ? AND borrow_status = "Overdue"', [user_id]);
        const [activeRows] = await pool.query('SELECT * FROM circulation WHERE user_id = ? AND borrow_status = "Borrowing"', [user_id]);

      
        console.log(user_id)
        const [rows1] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
        const isUserExist =  rows1.length > 0;
   
        const isAccessionExist = await checkAccessionExist(accession_number);

        const isRed = await checkisRed(accession_number);
     
        const limitation = await getLimitation();

        const duration = await getDuration();

        const currentDate = new Date().toISOString().split('T')[0];
        if (overdueRows.length > 0) {
            a ="You need to return overdue books first.";
        }

        
        else if (activeRows.length >= limitation) {  
            a ="You have borrowed too many books.";
        }

        

        else if (!isUserExist && !isAccessionExist) {
            a  =" The user and the book do not exist!";
        } else if (!isUserExist) {
            a = "The user does not exist!";
        } else if (!isAccessionExist) {
            a =" The book does not exist!" ;
        }

        else if (isRed) {
            a =" The book can't be borrowed!" ;
        }

        else{
        // let currentDate = new Date();

        // // Insert into borrow table
        // await pool.execute('INSERT INTO circulation (accession_number, due_date, check_out_date, renewal_count, borrow_status, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        //     [accession_number, currentDate.setDate(currentDate.getDate() + duration).toISOString().split('T')[0], currentDate, 0, 'Borrowing', user_id]);

        let currentDate = new Date();
        let checkOutDate = new Date().toISOString().split('T')[0];
        currentDate.setDate(currentDate.getDate() + parseInt(duration));
        let dueDate = currentDate.toISOString().split('T')[0];
        

        await pool.execute('INSERT INTO circulation (accession_number, due_date, check_out_date, renewal_count, borrow_status, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [accession_number, dueDate, checkOutDate, 0, 'Borrowing', user_id]);


        // Update copies table
        await pool.execute('UPDATE copies SET status = ? WHERE accession_number = ?', ['Checked-out', accession_number]);

        await pool.execute('DELETE FROM reservation WHERE accession_number = ? AND user_id = ?;',
            [accession_number, user_id]);

        a = "Successful";}
    } catch (error) {
        throw error; 
    }
    console.log(a);
    return a;
}


app.post('/returnBook', async (req, res) => {
    const { accession_number } = req.body;

    try {
        const result = await returnBook(accession_number);
        console.log(result)
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

async function returnBook(accession_number) {
    let a = "";
    console.log("la")
    try {
        // Check if there is an active borrow record
        const [borrowRows] = await pool.query('SELECT borrow_id FROM circulation WHERE accession_number = ? AND borrow_status = "Borrowing"', [accession_number]);

        if (borrowRows.length > 0) {
            const borrow_id = borrowRows[0].borrow_id;

            // Update borrow status to "DONE"
            await pool.execute('UPDATE circulation SET borrow_status = "Return" , returned_date = curdate() WHERE borrow_id = ?', [borrow_id]);

            a='Successful';

            // Check if there are pending reservations for the returned book
            const [reserveRows] = await pool.query('SELECT reserve_id FROM reservation WHERE accession_number = ? AND reserve_status = "Pending" ORDER BY reserve_date ASC LIMIT 1', [accession_number]);

            if (reserveRows.length > 0) {
                const reserve_id = reserveRows[0].reserve_id;

                // Update copies status to "Reservation"
                await pool.execute('UPDATE copies SET status = "Reservation" WHERE accession_number = ?', [accession_number]);

                // Update reservation status to "Active"
                await pool.execute('UPDATE reservation SET reserve_status = "Confirmed", accession_number = ? WHERE reserve_id = ?', [accession_number, reserve_id]);

                a='Reservation activated.';
            } else {
                // No pending reservations, update copies status to "Active"
                await pool.execute('UPDATE copies SET status = "Available" WHERE accession_number = ?', [accession_number]);

                a= 'No pending reservations.';
            }
        } else {
            a='No active borrow record found.';
        }
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to handle it at the calling site if needed
    }
    console.log(a);
    return a;
}


async function isBookExist(ISBN) {
    try {
        const [rows] = await pool.query('SELECT * FROM book WHERE ISBN = ?', [ISBN]);
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
} 

async function addBook(ISBN, title, authors, location, imprint, edition, callNumber, subjectArea, typeOfBook, keywords, isRed,publishers,summary, price, imageFile) {
    try {
        const bookExists = await isBookExist(ISBN);

        if (bookExists) {
            console.log('The book already exists!');
            return 'The book already exists!';
        }
        console.log(imageFile)

        const imageFilePath = `uploads/${imageFile.filename}`;


        await pool.execute(
            'INSERT INTO book (ISBN, title, authors, location, imprint, edition, call_number, subject_area, type_of_book, keywords, is_red,book_cover,publishers,summary,price) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
            [ISBN, title, authors, location, imprint, edition, callNumber, subjectArea, typeOfBook, keywords, isRed, imageFilePath,publishers,summary,price]
        ); 

        console.log('Book added successfully!');
        return 'Book added successfully!';
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error';
    }
}

const upload = multer({ dest: 'uploads/' });
app.post('/addBook', upload.single('image'), async (req, res) => {
    const { ISBN, title, authors, location, imprint, edition, callNumber, subjectArea, typeOfBook, keywords, isRed,publishers,summary,price } = req.body;
    const imageFile = req.file;
    console.log(imageFile);
    try {
        if (!imageFile) {
            res.status(400).json({ success: false, message: 'Image file is required' });
            return;
        }

        const result = await addBook(
            ISBN,
            title,
            authors,
            location,
            imprint,
            edition,
            callNumber,
            subjectArea,
            typeOfBook,
            keywords,
            isRed,
            publishers,
            summary,
            price,
            imageFile
        );
        console.log(result);
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


async function changeAcc(bank,account) {
    try {
        await pool.execute(
            'UPDATE setting set limitation=? WHERE setting_name=\'bank\'',
            [bank]
        ); 
        await pool.execute(
            'UPDATE setting set limitation=? WHERE setting_name=\'account\'',
            [account]
        ); 

        console.log('Book added successfully!');
        return 'Book added successfully!';
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error';
    }
}

app.post('/setAcc', async (req, res) => {
    const { bank, account } = req.body;
    console.log(bank,account)

    try {
        const result = await changeAcc(
            bank,
            account
        );
        console.log(result);
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


async function changeRole( adminUserId, userId, user,username,contact_number,department, degree ) {
    try {
        const [rows] = await pool.execute(
            'SELECT user_role FROM users WHERE user_id=?',
            [adminUserId]
        ); 
        if(rows[0].user_role!='A'){
            return "You don't have the permission to do this action"
        }else{
            await pool.execute(
            'UPDATE users set user_role=?, name = ?, contact_number=?,department=? WHERE user_id=?',
            [user,username, contact_number, department, userId]);

            if(user="S"){
                await pool.execute(
                'UPDATE student set degree=? WHERE user_id=?',
                [degree, userId]);
            }

        console.log('User Role updated successfully!');
        return 'User Role updated successfully!';
        }
        
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error';
    }
}

app.post('/changeRole', async (req, res) => {
    const { adminUserId, userId, user,username,contact_number,department, degree  } = req.body;

    try {
        const result = await changeRole(
            adminUserId, userId, user,username,contact_number,department, degree 
        );
        console.log(result);
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


//add tng
async function addBook1(imageFile) {
    try {
        
        const imageFilePath = `uploads/${imageFile.filename}`;

        await pool.execute(
            'UPDATE setting set limitation=? WHERE setting_name=\'code\'',
            [imageFilePath]
        ); 

        console.log('Book added successfully!');
        return 'Book added successfully!';
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error';
    }
}

app.post('/setCode', upload.single('image'), async (req, res) => {
    const imageFile = req.file;
    console.log(imageFile);
    try {
        if (!imageFile) {
            res.status(400).json({ success: false, message: 'Image file is required' });
            return;
        }

        const result = await addBook1(
            imageFile
        );
        console.log(result);
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//catalog
async function catalogBook(ISBN,accessionNumber) {
    try {
        // Check if the book already exists in copies
        const [rows] = await pool.execute('SELECT * FROM book WHERE ISBN = ?', [ISBN]);
        const isExist = rows.length > 0;

        if (!isExist) {
            return "The book doesn't exist!";
        } else {
            const acquisition_date = new Date().toISOString().split('T')[0];

            // Insert into copies table
            await pool.execute('INSERT INTO copies (accession_number, ISBN, status, acquisition_date, copies_condition) VALUES (?, ?, ?,?, ?)',
                [accessionNumber, ISBN, 'Available',acquisition_date, 'Good']);

            console.log('Successful');
            return "Successful";
        }
    } catch (error) {
        console.error(error);
    }
}

app.post('/catalogBook', async (req, res) => {
    const {ISBN,accessionNumber} = req.body;
    if (!ISBN&&!accessionNumber) {
        return res.status(400).json({ success: false, message: 'Please provide ISBN and accession number' });
    }
    try {
        const result = await catalogBook(ISBN,accessionNumber);
        console.log(result)
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

async function recordAcquisition(isbn, request_date, request_by, vendor, order_no, price, received_date, copyQuantity, remark) {
    const [userResult] = await pool.execute('SELECT user_id FROM users WHERE user_id = ?', [request_by]);
        if (userResult.length === 0) {
            console.log('Invalid User ID.');
            return 'Invalid User ID.';
        }

        const [isbnResult] = await pool.execute('SELECT ISBN FROM book WHERE ISBN = ?', [isbn]);
        if (isbnResult.length === 0) {
            console.log('ISBN not found in the database. Go to register.');
            return 'ISBN not found in the database. Go to register.';
        }

    try {
        const [result] = await pool.execute(
            'INSERT INTO acquisition_history (ISBN, request_date, request_by, vendor, order_no, price_per_book, book_receive_date, quantity_hardcopy, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [isbn, request_date, request_by, vendor, order_no, price, received_date, copyQuantity, remark]
        );

        console.log('Successful');
        return "Successful";
    } catch (error) {
        console.error(error);
        throw error;
    }
}

app.post('/recordAcquisition', async (req, res) => {
    const { isbn, request_date, request_by, vendor, order_no, price, received_date, copyQuantity, remark} = req.body;
   

    try {
        const result = await recordAcquisition(isbn, request_date, request_by, vendor, order_no, price, received_date, copyQuantity, remark);
        console.log(result)
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



async function checkUserExist(userId, email) {
    const [result] = await pool.execute('SELECT * FROM users WHERE user_id = ? OR email = ?', [userId, email]);
    return result.length > 0;
}

async function checkOtpExist(email) {
    const [result] = await pool.execute('SELECT * FROM authenticator WHERE email = ? ', [email]);
    return result.length > 0;
}

async function signupUser(userId, email) {
    try {
        const userExists = await checkUserExist(userId, email);
        if (userExists) {
            console.log("User_id or email already exists");
            return "User_id or email already exists";
        }
        
    const axios = require('axios');
    let otp = null;
    let link = null;
    

    const options = {
         method: 'POST',
         url: 'https://microsoft-authenticator.p.rapidapi.com/new_v2/',
        headers: {
                 'X-RapidAPI-Key': 'd4f6b5dc42msh6c9873b5f52d03fp105124jsna133096925b7',
                 'X-RapidAPI-Host': 'microsoft-authenticator.p.rapidapi.com'
                 }
    };

    try {
	    const response = await axios.request(options);
	    console.log(response.data);
        otp = response.data;
    } catch (error) {
	    console.error(error);
    }
    const encodedParams = new URLSearchParams();
    encodedParams.set('secret', otp);
    encodedParams.set('account', userId);
    encodedParams.set('issuer', 'UoSM');

    const options1 = {
            method: 'POST',
            url: 'https://microsoft-authenticator.p.rapidapi.com/enroll/',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': 'd4f6b5dc42msh6c9873b5f52d03fp105124jsna133096925b7',
                'X-RapidAPI-Host': 'microsoft-authenticator.p.rapidapi.com'
            },
  data: encodedParams,
   };
try {
	const response = await axios.request(options1);
	console.log(response.data);
    link = response.data;
} catch (error) {
	console.error(error);
}

   
    const mailOptions = {
        from: 'SEG3_ULMS@outlook.com',
        to: email,
        subject: 'Your OTP for Sign Up',
        text:` Open this link to get the QR code: ${link}`
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.error('Error:', error);
            return 'An error occurred while sending the OTP email.';
        } else {
            console.log('OTP email sent:', info.response);
            try {
                const otpExist =  await checkOtpExist(email);
                if(otpExist){
                    pool.execute(`UPDATE authenticator SET secret_key = ? WHERE email= ?`, [otp,email])
                }else{
                    pool.execute(
                        'INSERT INTO authenticator (email, secret_key) VALUES (?, ?)',
                        [email,otp]
                    );
                    console.log('OTP stored in the database.');
                    
                    return 'An OTP has been sent to your email address.';
                }
                
            } catch (dbError) {
                console.error('Database error:', dbError);
                return 'An error occurred while storing the OTP in the database.';
            }
        }
    });
    } catch (error) {
        console.error(error);
        throw error;
    }
}
app.post('/signup', async (req, res) => {
    
    const { userId, email} = req.body;
    console.log(userId);

    try {
        const result = await signupUser(userId, email);
        console.log(result);
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//-----forgot password

async function forgot(email) {
    try {
        const [result] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (result.length === 0) {
            return "not registered email, please sign up";
        }

        const otp = randomstring.generate({ length: 6, charset: 'numeric' });

        const mailOptions = {
            from: 'SEG3_ULMS@outlook.com',
            to: email,
            subject: 'Your OTP for reset the password',
            text: `Your OTP is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent:', email);

        await pool.execute(
            'INSERT INTO otp (email, datetime, OTP) VALUES (?, NOW(), ?)',
            [email, otp]
        );
        console.log('OTP stored in the database.');

        return 'An OTP has been sent to your email address.';
    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
}

app.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await forgot(email);
        console.log(result);
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}); 

//----forgot password

async function verifyOTPAndSignUp(req, res) {
    const { otp, userId, password, email,userRole } = req.body;
    console.log(email);

    try {
        const [otpRow] = await pool.query('SELECT secret_key FROM authenticator WHERE email = ?', [email]);
        const encodedParams1 = new URLSearchParams();
        console.log(otpRow)
        

        encodedParams1.set('secret', otpRow[0].secret_key);
        console.log(otpRow[0])
        encodedParams1.set('code', otp);

        const options3 = {
            method: 'POST',
            url: 'https://microsoft-authenticator.p.rapidapi.com/validate/',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': 'd4f6b5dc42msh6c9873b5f52d03fp105124jsna133096925b7',
                'X-RapidAPI-Host': 'microsoft-authenticator.p.rapidapi.com'
        },
        data: encodedParams1,
        };

        try {
	       const response = await axios.request(options3);
        
           if(response.data=="False"){
                res.status(500).json({ success: false, message: 'Wrong otp. Please try again.' });
            
            }else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const [result] = await pool.execute('INSERT INTO users (user_id, email, password_hash, user_role) VALUES (?, ?, ?, ?)', [userId, email, hashedPassword, userRole]);
                if(userRole=="S"){
                    const [result] = await pool.execute('INSERT INTO student (user_id,course,degree) VALUES (?,"-",1)', [userId]);
                }
                console.log('User registered successfully');
                // const [result1] = await pool.execute(INSERT INTO user_setting (userId, appearance, notifications) VALUES (?, true,true), [userId]);
                res.json({ success: true, message: 'Successfuly sign up!.' });
            }
        }  catch (error) {
	       console.error(error);
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Internal server error. Please try again.' });
    }
}

app.post('/verification', verifyOTPAndSignUp);
app.post('/verification1', async (req, res) => {

    const otp = req.body.otp;
    const email = req.body.email;
    try {
        const [otpRow] = await pool.query('SELECT secret_key FROM authenticator WHERE email = ?', [email]);
        const encodedParams1 = new URLSearchParams();
        console.log(otpRow)
        

        encodedParams1.set('secret', otpRow[0].secret_key);
        console.log(otpRow[0])
        encodedParams1.set('code', otp);
        const options3 = {
            method: 'POST',
            url: 'https://microsoft-authenticator.p.rapidapi.com/validate/',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': 'd4f6b5dc42msh6c9873b5f52d03fp105124jsna133096925b7',
                'X-RapidAPI-Host': 'microsoft-authenticator.p.rapidapi.com'
        },
        data: encodedParams1,
        };

        try {
	       const response = await axios.request(options3);
	       console.log(response.data);
           if(response.data=="False"){
            res.status(500).json({ success: false, message: 'Wrong OTP. Please try again.' });
            
        }else {
            res.json({ success: true, message: 'Successfully signed in' });
        }
        }  catch (error) {
	       console.error(error);
        }
    } catch (error){
        console.error(error);
    }
});



app.post('/countLargestCatalogNum', async (req, res) => {
    try {
        const query = "SELECT max(accession_number) as max FROM `copies` ";
        const [rows] = await pool.query(query);

        const borrowedBooksCount = rows[0].max;
        res.json({ success: true, max: borrowedBooksCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getBookDetails', async (req, res) => {
    const isbn = req.body.isbn;

    try {
        const query = `
            SELECT b.title, b.authors, b.summary, b.edition, b.imprint, b.ISBN, b.subject_area, b.type_of_book, b.location, b.keywords,b.call_number,b.processing_date,b.publishers,b.book_cover, COALESCE(SUM(c.status = 'Available'), 0) AS available_copies
            FROM book b
            LEFT JOIN 
            copies c ON b.ISBN = c.ISBN 
            WHERE b.ISBN = ?`;

        const [rows] = await pool.query(query, [isbn]);

        const bookDetail = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.book_cover, { encoding: 'base64' });
                return { 
                    ...row,
                    book_cover_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching book cover:', error);
                return { 
                    ...row,
                    book_cover_base64: null
                };
            }
        }));

        if (rows.length > 0) {
            const bookDetails = bookDetail[0];
            res.json({ success: true, bookDetails });
        } else {
            res.json({ success: false, message: 'Book not found with ISBN: ' + isbn });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

async function getRenewl(){
    const queries = [
        `SELECT limitation FROM setting WHERE setting_name = 'renewl'`
    ];
;
    const renewlResult = await pool.query(queries[0]);

    return renewlResult[0][0].limitation;
}


app.post('/renewBook', async (req, res) => {
    const { borrowId, renewalCount } = req.body;

    if (!borrowId) {
        return res.status(400).json({ success: false, message: 'Please provide borrowId and newReturnDate' });
    }

    try {
        const renewalLimit = await getRenewl(); 

        if (renewalCount >= renewalLimit) {
            return res.status(400).json({ success: false, message: `Every book can only renew ${renewalLimit} times` });
        }

        const updateQuery = 'UPDATE circulation SET due_date = DATE_ADD(due_date, INTERVAL 2 WEEK), renewal_count = renewal_count + 1 WHERE borrow_id = ?';
        await pool.execute(updateQuery, [borrowId]);
        res.json({ success: true, message: 'Renewal successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error during renewal' });
    }
});


app.post('/searchPatrons', async (req, res) => {
    const searchInput = req.body.searchInput;
    const value = req.body.value;

    let query = `
        SELECT
            users.user_id,
            users.email,
            users.contact_number,
            users.name AS username,
            CASE 
                WHEN user_role = 'A' THEN 'Senior Librarian'
                WHEN user_role = 'L' THEN 'Librarian'
                WHEN user_role = 'S' THEN 'Student'
                WHEN user_role = 'U' THEN 'University Staff'
                ELSE 'Unknown Role'
            END AS role_title,
            CASE
                WHEN overdue_books.count > 0 OR active_borrowing.count >= max_books_setting.limitation THEN 'Unavailable'
                ELSE 'Available'
            END AS availability
        FROM
            users
        LEFT JOIN (
            SELECT
                user_id,
                COUNT(*) AS count
            FROM
                circulation
            WHERE
                borrow_status = 'Overdue'
            GROUP BY
                user_id
        ) AS overdue_books ON users.user_id = overdue_books.user_id
        LEFT JOIN (
            SELECT
                user_id,
                COUNT(*) AS count
            FROM
                circulation
            WHERE
                borrow_status = 'Borrowing'
            GROUP BY
                user_id
        ) AS active_borrowing ON users.user_id = active_borrowing.user_id
        CROSS JOIN (
            SELECT
                limitation
            FROM
                setting
            WHERE
                setting_name = 'Limitation of book'
        ) AS max_books_setting
        WHERE 1 = 1`;

    const queryParams = [];

    if (searchInput) {
        query += ` AND (
            users.user_id LIKE ? OR
            users.email LIKE ? OR
            users.contact_number LIKE ? OR
            users.user_role LIKE ? OR
            users.name LIKE ?
        )`;
        queryParams.push(...Array(5).fill(`%${searchInput}%`));
    }

    if(value=="patron"){
        query +=  ` AND (
            users.user_role = 'U' OR users.user_role = 'S'
        )`;
    }else if(value=="librarian"){
        query +=  ` AND (
            users.user_role = 'L' OR users.user_role = 'A'
        )`;
    }

    try {
        const [rows] = await pool.query(query, queryParams);
        res.json({ success: true, users: rows });
    } catch (error) {
        console.error('Error searching patrons:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/searchProfilePic', async (req, res) => {
    const { user_id } = req.body; 

    let query = `
        SELECT profile_pic FROM users WHERE user_id = ${user_id}`;
    try {
        const [rows] = await pool.query(query);

        const pic = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.profile_pic, { encoding: 'base64' });
                return { 
                    profile_pic_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching profile picture:', error);
                return { 
                    profile_pic_base64: null
                };
            }
        }));

        res.json({ success: true, pic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/searchTouchnGo', async (req, res) => {
    let query = `
        SELECT limitation FROM setting WHERE setting_name = 'code'`;
    try {
        const [rows] = await pool.query(query);

        const pic = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.limitation, { encoding: 'base64' });
                return { 
                    profile_pic_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching profile picture:', error);
                return { 
                    profile_pic_base64: null
                };
            }
        }));
        res.json({ success: true, pic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/searchBooks', async (req, res) => {
    const searchInput = req.body.searchInput;
    const selectedFilters = req.body.selectedFilters; 

    let query = `
        SELECT c.accession_number, c.ISBN, b.book_cover, b.title, b.edition, b.authors, c.copies_condition, c.status, b.price, b.location,
        b.subject_area, b.keywords, b.imprint, b.call_number, b.type_of_book,b.summary
        FROM copies c
        JOIN book b ON c.ISBN = b.ISBN
        WHERE 1=1`;

    const queryParams = [];

    if (searchInput) {
        query += ` AND (
                    c.accession_number LIKE ? OR
                    c.ISBN LIKE ? OR
                    b.title LIKE ? OR
                    b.edition LIKE ? OR
                    b.authors LIKE ? OR
                    c.copies_condition LIKE ? OR
                    c.status LIKE ? OR
                    b.price LIKE ? OR
                    b.location LIKE ? OR
                    b.subject_area LIKE ? OR
                    b.keywords LIKE ? OR
                    b.imprint LIKE ? OR
                    b.call_number LIKE ? OR
                    b.type_of_book LIKE ? OR
                    b.summary LIKE ?
                )`;
        queryParams.push(...Array(15).fill(`%${searchInput}%`));
    }

    if (selectedFilters) {
        query += ` AND (`;
        let filterConditions = [];

        selectedFilters.forEach(filter => {
            console.log("Filter field:", filter); 
            filterConditions.push(`${filter.field} LIKE ?`);
            queryParams.push(`%${filter.value}%`);
        });

        query += filterConditions.join(' AND ');
        query += `)`;
    }
    
    try {
        console.log(query)
        const [rows] = await pool.query(query, queryParams);

        const books = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.book_cover, { encoding: 'base64' });
                return { 
                    ...row,
                    book_cover_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching book cover:', error);
                return { 
                    ...row,
                    book_cover_base64: null
                };
            }
        }));

        res.json({ success: true, books});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//------------acquisition
app.post('/searchAcquisition', async (req, res) => {
    const searchInput = req.body.searchInput;

    let query = `
        SELECT 
            acquisition_no, 
            ISBN, 
            publisher, 
            quantity_hardcopy, 
            request_date, 
            request_by, 
            department, 
            order_no, 
            vendor, 
            book_receive_date, 
            remark, 
            price_per_book, 
            total
        FROM 
            acquisition_history
        WHERE 
            1=1`;

    const queryParams = [];

    if (searchInput) {
        query += ` AND (
                    acquisition_no LIKE ? OR
                    ISBN LIKE ? OR
                    publisher LIKE ? OR
                    quantity_hardcopy LIKE ? OR
                    request_date LIKE ? OR
                    request_by LIKE ? OR
                    department LIKE ? OR
                    order_no LIKE ? OR
                    vendor LIKE ? OR
                    book_receive_date LIKE ? OR
                    remark LIKE ? OR
                    price_per_book LIKE ? OR
                    total LIKE ?
                )`;
        queryParams.push(...Array(13).fill(`%${searchInput}%`));
    }
    
    try {
        console.log(query)
        const [rows] = await pool.query(query, queryParams);

        res.json({ success: true, acquisitions: rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});




 //acquisition
app.post('/searchBooksA', async (req, res) => {
    const searchInput = req.body.searchInput;
    const selectedFilters = req.body.selectedFilters; 
    var and = false;
    console.log(searchInput);
    console.log(selectedFilters)

    let query = `
    SELECT 
        b.ISBN, 
        b.book_cover,
        COALESCE(SUM(c.status = 'Available'), 0) AS available_copies,
        b.title,
        b.edition, 
        b.authors, 
        b.price, 
        b.location,
        b.subject_area, 
        b.keywords, 
        b.imprint, 
        b.call_number, 
        b.type_of_book
    FROM 
        book b
    LEFT JOIN 
        copies c ON b.ISBN = c.ISBN `;

    const queryParams = [];
    if (searchInput.length) {
        and=true; 
        query += ` WHERE (
                    c.ISBN LIKE ? OR
                    b.title LIKE ? OR
                    b.edition LIKE ? OR
                    b.authors LIKE ? OR
                    c.status LIKE ? OR
                    b.price LIKE ? OR
                    b.location LIKE ? OR
                    b.subject_area LIKE ? OR
                    b.keywords LIKE ? OR
                    b.imprint LIKE ? OR
                    b.call_number LIKE ? OR
                    b.type_of_book LIKE ?
                )`;
        queryParams.push(...Array(12).fill(`%${searchInput}%`));
    }

    if (selectedFilters.length>0) {
        if(!and){
            query+= `WHERE (`;
        }else{
            query += ` AND (`;
        }
        let filterConditions = [];

        selectedFilters.forEach(filter => {
            filterConditions.push(`${filter.field} LIKE ?`);
            queryParams.push(`%${filter.value}%`);
        });

        query += filterConditions.join(' AND ');
        query += `)`;
    }

    query += ` GROUP BY b.ISBN ORDER BY b.title ASC`;
    try {
        console.log(pool.format(query, queryParams));
        const [rows] = await pool.query(query, queryParams);

        const books = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.book_cover, { encoding: 'base64' });
                return { 
                    ...row,
                    book_cover_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching book cover:', error);
                return { 
                    ...row,
                    book_cover_base64: null
                };
            }
        }));

        res.json({ success: true, books});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

async function fetchSettings(settingName) {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT limitation FROM setting WHERE setting_name = ?', [settingName]);
    await connection.end();
    return rows[0].limitation;
  }
  
  // Function to convert image to base64
  async function convertImageToBase64(imagePath) {
    try {
      const base64data = await fs.readFile(imagePath, { encoding: 'base64' });
      return base64data;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  }
  
  app.post('/account', async (req, res) => {
    try {
      const [bank, account, imagePath] = await Promise.all([
        fetchSettings('bank'),
        fetchSettings('account'),
        fetchSettings('code'),
      ]);

      const imgBase64 = await convertImageToBase64(imagePath);
     
      const response = {
        bank: bank,
        account: account,
        imgBase64: imgBase64,
      };
      res.json({ success: true, data:response});
    } catch (error) {
      console.error('Error fetching account details:', error);
      res.status(500).json({ error: 'An error occurred while fetching account details' });
    }
  });


app.post('/searchBorrowedBooks', async (req, res) => {
    const searchTerm = req.body.searchTerm || '';

    try {
            const query = `
        SELECT br.borrow_id, br.accession_number, br.due_date, 
            DATEDIFF(NOW(), br.due_date) AS overdue_days,
            u.user_id, u.name,  u.contact_number, u.email,
            c.ISBN, b.title
        FROM circulation br
        JOIN users u ON br.user_id = u.user_id
        JOIN copies c ON br.accession_number = c.accession_number
        JOIN book b ON c.ISBN = b.ISBN
        WHERE 
            br.borrow_status = 'Overdue' AND
            (
                br.borrow_id LIKE ? OR
                br.accession_number LIKE ? OR
                u.user_id LIKE ? OR
                u.name LIKE ? OR
                c.ISBN LIKE ? OR
                b.title LIKE ?
            )
            `;


        const [rows] = await pool.query(query, Array(6).fill(`%${searchTerm}%`));

        const borrowedBooks = rows.map(row => ({
            borrowId: row.borrow_id,
            accessionNumber: row.accession_number,
            isbn: row.ISBN,
            title: row.title,
            userId: row.user_id,
            username: row.name,
            contactNumber: row.contact_number,
            email: row.email,
            dueDate: row.due_date,
            overdueDays: row.overdue_days,
        }));

        res.json({ success: true, borrowedBooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/updateBook', upload.single('image'), async (req, res) => {
    try {
        const {title, authors, edition, publisher, publicationDate, imprint, isbn, location, callNumber, summary, subjectArea, typeOfBook, keywords} = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            res.status(400).json({ success: false, message: 'Image file is required' });
            return;
        }

        const imageFilePath = `uploads/${imageFile.filename}`;
        console.log(title, authors, edition, publisher, publicationDate, imprint, isbn, location, callNumber, summary, subjectArea, typeOfBook, keywords);

        const updateQuery = `
            UPDATE book
            SET title =?, authors =?, edition =?, publishers =?, processing_date =?, 
            imprint =?, location =?, call_number =?,summary =?, 
            subject_area =?, type_of_book =?, keywords =?,book_cover=?
            WHERE ISBN = ?
        `;
        await pool.execute(updateQuery, [
            title, 
            authors, 
            edition, 
            publisher, 
            publicationDate, 
            imprint, 
            location, 
            callNumber,
            summary, 
            subjectArea, 
            typeOfBook, 
            keywords,
            imageFilePath,
            isbn
        ]);


        res.json({ success: true, message: 'Book updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error during book update' });
    }
});

async function addToFavorites(userId, isbn) {
    try {
        const [existingFavorite] = await pool.query('SELECT * FROM favourite WHERE user_id = ? AND ISBN = ?', [userId, isbn]);

        if (existingFavorite.length > 0) {
            await pool.execute('DELETE FROM favourite WHERE user_id = ? AND ISBN = ?', [userId, isbn]);
            return 'Book removed from favorites.';
        }

        await pool.execute('INSERT INTO favourite (user_id, ISBN) VALUES (?, ?)', [userId, isbn]);

        return 'Book added to favorites successfully.';
    } catch (error) {
        console.error('Error adding book to favorites:', error);
        throw error; 
    }
}


app.post('/addToFavorites', async (req, res) => {
    const { userId, isbn } = req.body;

    try {
        const message = await addToFavorites(userId, isbn);
        res.json({ success: true, message });
    } catch (error) {
        console.error('Error adding book to favorites:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/rateBook', async (req, res) => {
    const { userId, isbn, rating,comment } = req.body;

    try {
        let message = '';
        const [existingRating] = await pool.query('SELECT * FROM rating WHERE ISBN = ? AND user_id = ?', [isbn, userId]);
        
        if (existingRating.length > 0) {
            await pool.execute('UPDATE rating SET rating = ?, rating_date = NOW(),comments=? WHERE ISBN = ? AND user_id = ?', [rating, comment,isbn, userId]);
            message = 'Rating updated successfully';
        } else {
            await pool.execute('INSERT INTO rating (ISBN, user_id, rating,comments) VALUES (?,?, ?, ?)', [isbn, userId, rating,comment]);
            message = 'Rating added successfully';
        }

        res.json({ success: true, message });
    } catch (error) {
        console.error('Error rating book:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

async function reserveBook(userId, ISBN) {
    console.log(ISBN);
    try {
        const copiesResultSet = await pool.query(`SELECT * FROM copies WHERE ISBN = '${ISBN}'`);

        let isISBNExist = false;
        let isAvailable = false;
        let accessionNumber = null;

        if (copiesResultSet[0].length > 0) {
            for (const copy of copiesResultSet[0]) {
                isISBNExist = true;
                const status = copy.status;
                accessionNumber = copy.accession_number;

                if (status === 'Available') {
                    const updateQuery = 'UPDATE copies SET status = ? WHERE accession_number = ?';
                    await pool.execute(updateQuery, ['Reservation', accessionNumber]);
                    isAvailable = true;
                    break;
                }
            }
        }

        const [rows] = await pool.query('SELECT is_Red FROM book WHERE isbn = ?', [ISBN]);
        if (rows.length > 0) {
            const { isRed } = rows[0];
            if (isRed) {
                return "cannot reserve"
            } 
        } 

        if (!isISBNExist) {
            return 'The book does not exist!';
        } else {
            const existingReservation = await pool.query(`SELECT * FROM reservation WHERE user_id = ? AND reserve_status != 'Done' AND accession_number = ?`, [userId, accessionNumber]);
            if (existingReservation[0].length > 0) {
                return 'The book is already reserved.'
            } else {
                const insertQuery = 'INSERT INTO reservation (user_id, accession_number, reserve_date, reserve_status) VALUES (?, ?, NOW(), ?)';
                const reserveStatus = isAvailable ? 'Confirmed' : 'Pending';

                await pool.execute(insertQuery, [userId, accessionNumber, reserveStatus]);
                return 'Reservation successful.';
            }
        }
    } catch (error) {
        console.error('Error reserving book:', error);
    }
}


app.post('/reserveBook', async (req, res) => {
    const { userId,isbn } = req.body;

    try {
        const message = await reserveBook(userId, isbn);
        
        res.json({ success: true, message: message });
    } catch (error) {
        console.error('Error reserving book:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/getUserCirculationData', async (req, res) => {
    const userId = req.body.userId;
    try {
        const query = `
        SELECT 
        all_months.month,
        COALESCE(checkouts, 0) AS checkouts,
        COALESCE(returns, 0) AS returns
    FROM (
        SELECT DATE_FORMAT(CURRENT_DATE(), '%Y-%m') AS month
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 2 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 7 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 8 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 9 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 10 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 11 MONTH), '%Y-%m')
    ) AS all_months
    LEFT JOIN (
        SELECT 
            DATE_FORMAT(check_out_date, '%Y-%m') AS month,
            COUNT(*) AS checkouts
        FROM circulation
        WHERE user_id = ?
        GROUP BY month
    ) AS checkouts_table ON all_months.month = checkouts_table.month
    LEFT JOIN (
        SELECT 
            DATE_FORMAT(returned_date, '%Y-%m') AS month,
            COUNT(*) AS returns
        FROM circulation
        WHERE user_id = ? AND returned_date IS NOT NULL
        GROUP BY month
    ) AS returns_table ON all_months.month = returns_table.month
    ORDER BY all_months.month ASC;
    
        `;

        const [results] = await pool.query(query, [userId,userId]);
       
        console.log("Circulation data:", results);

        res.json({ success: true, circulationData: results });
    } catch (error) {
       
        console.error('Error fetching user circulation data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getUserCirculationDataA', async (req, res) => {
    const userId = req.body.userId;
    try {
        const query = `
        SELECT 
    all_dates.date,
    COALESCE(checkouts, 0) AS checkouts,
    COALESCE(returns, 0) AS returns,
    COALESCE(reservations, 0) AS reservations
FROM (
    SELECT DATE_FORMAT(CURRENT_DATE(), '%Y-%m-%d') AS date
    UNION ALL
    SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '%Y-%m-%d')
    UNION ALL
    SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '%Y-%m-%d')
    UNION ALL
    SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '%Y-%m-%d')
    UNION ALL
    SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '%Y-%m-%d')
    UNION ALL
    SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '%Y-%m-%d')
    UNION ALL
    SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '%Y-%m-%d')
) AS all_dates
LEFT JOIN (
    SELECT 
        DATE(check_out_date) AS date,
        COUNT(*) AS checkouts
    FROM circulation
    WHERE check_out_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY)
    GROUP BY date
) AS checkouts_table ON all_dates.date = checkouts_table.date
LEFT JOIN (
    SELECT 
        DATE(returned_date) AS date,
        COUNT(*) AS returns
    FROM circulation
    WHERE returned_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY) AND returned_date IS NOT NULL
    GROUP BY date
) AS returns_table ON all_dates.date = returns_table.date
LEFT JOIN (
    SELECT 
        DATE(reserve_date) AS date,
        COUNT(*) AS reservations
    FROM reservation
    WHERE reserve_status = 'Confirmed' AND reserve_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY)
    GROUP BY date
) AS reservations_table ON all_dates.date = reservations_table.date
ORDER BY all_dates.date ASC;
    
        `;

        const [results] = await pool.query(query);
       
        console.log("Circulation data:", results);

        res.json({ success: true, circulationData: results });
    } catch (error) {
       
        console.error('Error fetching user circulation data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getChartData', async (req, res) => {
    const sqlQuery = req.body.sqlQuery;
    console.log(sqlQuery);

    try {
        const connection = await pool.getConnection();
        const [results] = await connection.query(sqlQuery);
        connection.release();
        console.log(results)

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ success: false, message: 'Error executing SQL query' });
    }
});

app.post('/getUserDetails', async (req, res) => {
    const userId = req.body.userId;

    try {
        const [rows] = await pool.query(`
            SELECT
                users.user_id,
                CASE
                    WHEN users.user_role = 'A' THEN 'Senior Librarian'
                    WHEN users.user_role = 'L' THEN 'Librarian'
                    WHEN users.user_role = 'S' THEN 'Student'
                    ELSE 'University Staff'
                END AS user_role,
                users.department,
                CASE
                    WHEN users.user_role = 'S' THEN student.degree
                    ELSE NULL
                END AS degree
            FROM
                users
            LEFT JOIN
                student ON users.user_id = student.user_id
            WHERE
                users.user_id = ?;
        `, [userId]);

        if (rows.length > 0) {
            const userDetails = rows[0];
            res.json({ success: true, userDetails });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/completeFines', async (req, res) => {
    const userId = req.body.userId;

    try {
        const query = `
        UPDATE fines
        SET status = "Completed"
        WHERE user_id = ?
        `;

        await pool.query(query, [userId]);

        res.json({ success: true, message: 'Fines marked as completed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/book/:isbn', async (req, res) => {
    const { isbn } = req.params;
    const apiUrl = `http://openlibrary.org/api/volumes/brief/isbn/${isbn}.json`;
    
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch data from Open Library API');
      }
      const data = await response.json();

      const firstRecordKey = Object.keys(data.records)[0];
        const title = data.records[firstRecordKey].data.title || "";
        const authors = (data.records[firstRecordKey].data.authors || []).map(author => author.name).join(", ") || "";
        const subjects = (data.records[firstRecordKey].data.subjects || []).map(subject => subject.name).join(", ") || "";
        console.log(subjects);
        var cover = "";
        if(data.items[0]){
            var cover = data.items[0].cover.medium|| "";
        }
        
        
        const publishers = data.records[firstRecordKey].data.publishers.map(publisher => publisher.name).join(", ") || "";

        console.log("Title:", title);
        console.log("Authors:", authors);
        console.log("Subjects:", subjects);
        console.log("Cover:", cover);
        console.log("Publishers:", publishers);
        const data1 = {
            title: title,
            authors: authors,
            subjects: subjects,
            cover: cover,
            publishers: publishers
          };
          
          res.json(data1);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }); 


  app.post('/resetPassword1', async (req, res) => {
    const { email,otp} = req.body;
    const [otpRow] = await pool.query('SELECT * FROM otp WHERE email = ? ORDER BY OTPid DESC LIMIT 1', [email]);

    if (!otpRow || otpRow.length === 0) {
        return res.status(400).json({ success: false, message: 'OTP not found or expired. Please request a new OTP.' });
    }

    if (otp !== otpRow[0].OTP) {
        console.log(otpRow[0].OTP);
        console.log(otp);
        return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
    }
    else return res.json({ success: true });
   
});

app.post('/resetPassword2', async (req, res) => {
    const { email, password } = req.body;
    const newPasswordHash = await bcrypt.hash(password, 10);
    pool.query('UPDATE users SET password_hash=? WHERE email=?', [newPasswordHash, email]) 
    res.json({ message: 'Password reset successfully' });
   
});


app.post('/fetchIT', async (req, res) => {
    try {
        const query = "SELECT name, email,profile_pic FROM users WHERE user_role='IT' LIMIT 1";
        const [rows1] = await pool.query(query);
        const rows = await Promise.all(rows1.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.profile_pic, { encoding: 'base64' });
                return { 
                    ...row,
                    profile_pic_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching profile picture:', error);
                return { 
                    ...row,
                    profile_pic_base64: null
                };
            }
        }));
        if (rows.length > 0) {
            const userData = rows[0];
            console.log(userData);
            res.json({ success: true, userData });
        } else {
            res.status(404).json({ success: false, message: 'No user data found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Error fetching user data' });
    }
});

app.post('/fetchAdmin', async (req, res) => {
    try {
        const query = "SELECT name, email,profile_pic FROM users WHERE user_role='A' LIMIT 1";
        const [rows1] = await pool.query(query);
        const rows = await Promise.all(rows1.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.profile_pic, { encoding: 'base64' });
                return { 
                    ...row,
                    profile_pic_base64: base64data 
                };
            } catch (error) {
                console.error('Error fetching profile picture:', error);
                return { 
                    ...row,
                    profile_pic_base64: null
                };
            }
        }));
        if (rows.length > 0) {
            const userData = rows[0];
            console.log(userData);
            res.json({ success: true, userData });
        } else {
            res.status(404).json({ success: false, message: 'No user data found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Error fetching user data' });
    }
});

app.post('/fetchUserData', async (req, res) => {
    const userId = req.body.userId;
    const query = `
      SELECT 
          u.user_id,
          u.profile_pic,
          IFNULL(u.name, '') AS name,
          u.email,
          IFNULL(u.contact_number, '') AS contact_number,
          IFNULL(u.department, '') AS department,
          CASE 
              WHEN u.user_role = 'S' THEN IFNULL(s.degree, '')
              ELSE '-'
          END AS degree,
          IFNULL(u.password_hash, '') AS password_hash,
          CASE 
              WHEN u.user_role = 'S' THEN 'Student'
              WHEN u.user_role = 'L' THEN 'Librarian'
              WHEN u.user_role = 'A' THEN 'Admin'
              WHEN u.user_role = 'U' THEN 'University Staff'
              ELSE '-' 
          END AS user_role
      FROM 
          users u
      LEFT JOIN 
          student s ON u.user_id = s.user_id
      WHERE 
          u.user_id = ?
    `;
  
    try {
      const [rows1] = await pool.query(query, [userId]);
      const rows = await Promise.all(rows1.map(async (row) => {
        try {
            const base64data = await fs.readFile(row.profile_pic, { encoding: 'base64' });
            return { 
                ...row,
                profile_pic_base64: base64data 
            };
        } catch (error) {
            console.error('Error fetching book cover:', error);
            return { 
                ...row,
                profile_pic_base64: null
            };
        }
    }));

      if (rows.length > 0) {
        const userData = rows[0];
        res.json({ success: true, userData });
      } else {
        res.status(404).json({ success: false, message: 'User data not found' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ success: false, message: 'Error fetching user data' });
    }
  });

  
app.post('/fetchUserPic', async (req, res) => {
    const userId = req.body.userId;
    const query = `
      SELECT 
          u.profile_pic,
          u.name
      FROM 
          users u
      WHERE 
          u.user_id = ?
    `;
  
    try {
      const [rows1] = await pool.query(query, [userId]);
      const rows = await Promise.all(rows1.map(async (row) => {
        try {
            const base64data = await fs.readFile(row.profile_pic, { encoding: 'base64' });
            return { 
                ...row,
                profile_pic_base64: base64data 
            };
        } catch (error) {
            console.error('Error fetching book cover:', error);
            return { 
                ...row,
                profile_pic_base64: null
            };
        }
    }));

      if (rows.length > 0) {
        const userData = rows[0];
        res.json({ success: true, userData });
      } else {
        res.status(404).json({ success: false, message: 'User data not found' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ success: false, message: 'Error fetching user data' });
    }
  });


  app.post('/updateUser', upload.single('image'), async (req, res) => {
    const { userId, name, contactNumber, department, degree } = req.body;
    const imageFile = req.file;
    try {
        if (!imageFile) {
            res.status(400).json({ success: false, message: 'Image file is required' });
            return;
        }

        const imageFilePath = `uploads/${imageFile.filename}`;

        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        await connection.execute('UPDATE users SET name=?, contact_number=?, department=?,profile_pic=? WHERE user_id=?', [name, contactNumber, department, imageFilePath, userId]);

        if (degree !== '-') {
            await connection.execute('UPDATE student SET degree=? WHERE user_id=?', [degree, userId]);
        }
        
        await connection.commit();
        connection.release();
        
        res.json({ success: true, message: 'User information updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
});

app.post('/fetchNotifications', async (req, res) => {
    const { userId } = req.body;
  
    try {
      const notifications = await fetchNotifications(userId);
      res.json({ success: true, notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ success: false, message: 'Error fetching notifications' });
    }
  });
  
  async function fetchNotifications(userId, res) {
    try {
        const query = `
            SELECT id, title, content, is_read, created_at
            FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;

        const [results] = await pool.query(query, [userId]);
        return results;

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Error fetching notifications' });
    }
}

app.post('/markOneAsRead', async (req, res) => {
    const id = req.body.id;
    try {
        const query = `
            UPDATE notifications
            SET is_read = 1
            WHERE id = ?
        `;
        await pool.query(query, [id]);
        res.json({ success: true, message: 'notification marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/markAllAsRead', async (req, res) => {
    const userId = req.body.userId;
    try {
        const query = `
            UPDATE notifications
            SET is_read = 1
            WHERE user_id = ?
        `;
        await pool.query(query, [userId]);
        console.log('All notifications marked as read for user ID:', userId);
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/saveChanges', async (req, res) => {
    const borrowLimit = req.body.borrowLimit;
    const duration = req.body.duration;
    const renewlLimit = req.body.renewlLimit;
    const studentFines = req.body.studentFines;
    const staffFines = req.body.staffFines;


    try {
        const queries = [
            `UPDATE setting SET limitation = ? WHERE setting_name = 'duration'`,
            `UPDATE setting SET limitation = ? WHERE setting_name = 'Limitation of book'`,
            `UPDATE setting SET limitation = ? WHERE setting_name = 'renewl'`,
            `UPDATE setting SET limitation = ? WHERE setting_name = 'staff fines'`,
            `UPDATE setting SET limitation = ? WHERE setting_name = 'student fines'`,
        ];
        
        await pool.query(queries[0],[duration]);
        await pool.query(queries[1],[borrowLimit]);
        await pool.query(queries[2],[renewlLimit]);
        await pool.query(queries[3],[staffFines]);
        await pool.query(queries[4],[studentFines]);
        

        res.json({ success: true, message: 'Save changes successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/sendFeedback', async (req, res) => {
    const feedback = req.body.feedback
    const userId = req.body.userId
   
    try {
        const queries = `INSERT INTO feedback (userID, feedback) VALUES (?,?)`;
        
        await pool.query(queries,[userId,feedback]);
        const mailOptions = {
            from: 'SEG3_ULMS@outlook.com',
            to: 'sx1e22@soton.ac.uk',
            subject: 'Feedback about the system',
            text: `Feedback: ${feedback}`
        };

        await transporter.sendMail(mailOptions);
       
        res.json({ success: true, message: 'Thank you for your feedback' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/setAppearance', async (req, res) => {
    const appearance = req.body.appearance1
    const userId = req.body.userId
   
    try {
        const queries = `UPDATE user_setting SET appearance = ? WHERE userId = ?`;
        
        await pool.query(queries,[appearance,userId]);
       
        res.json({ success: true, message: 'Change successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.post('/deleteHistory', async (req, res) => {
    
    const userId = req.body.userId
   
    try {
        const queries = `DELETE FROM search_history WHERE user_id = ?`;
        
        await pool.query(queries,[userId]);
       
        res.json({ success: true, message: 'Delete successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.post('/notiStatus', async (req, res) => {
    
    const userId = req.body.userId
    const noti = req.body.noti
    console.log(noti)
    console.log(userId)
   
    try {
        const queries = `UPDATE user_setting SET notifications = ? WHERE userId = ?`;
        
        await pool.query(queries,[noti,userId]);
       
        res.json({ success: true, message: 'Change  successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.post('/getSettingDetails', async (req, res) => {
    try {
        const queries = [
            `SELECT limitation FROM setting WHERE setting_name = 'duration'`,
            `SELECT limitation FROM setting WHERE setting_name = 'Limitation of book'`,
            `SELECT limitation FROM setting WHERE setting_name = 'renewl'`,
            `SELECT limitation FROM setting WHERE setting_name = 'staff fines'`,
            `SELECT limitation FROM setting WHERE setting_name = 'student fines'`,
        ];

        const durationResult = await pool.query(queries[0]);
        const bookLimitResult = await pool.query(queries[1]);
        const renewlResult = await pool.query(queries[2]);
        const staffResult = await pool.query(queries[3]);
        const studentResult = await pool.query(queries[4]);

        // Extracting the limitation values from each result
        const duration = durationResult[0][0].limitation;
        const bookLimit = bookLimitResult[0][0].limitation;
        const renewl = renewlResult[0][0].limitation;
        const staff = staffResult[0][0].limitation;
        const student = studentResult[0][0].limitation;


        // Sending the setting details in the response
        res.status(200).json({
            success: true,
            data: {
                duration,
                bookLimit,
                renewl,
                staff,
                student
            }
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}); 
app.post('/getSettings', async (req, res) => {
    const userId = req.body.userId
    try {
        const queries = [`SELECT notifications FROM user_setting WHERE userId = ?`,
        `SELECT appearance FROM user_setting WHERE userId = ?`];

        const notiResult = await pool.query(queries[0],[userId]);
        const appearanceResult = await pool.query(queries[1],[userId]);
        

        // Extracting the limitation values from each result
        const noti = notiResult[0][0].notifications;
        const appearance = appearanceResult[0][0].appearance;
    
        // Sending the setting details in the response
        res.status(200).json({
            success: true,
            data: {
                noti,
                appearance
            }
        });
    } catch (error) {
        console.error('Error fetching setting details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

 
app.use(express.static(path.join(__dirname, 'public')));

app.get('/header2.html', (req, res) => {
    console.log("hi")
  res.sendFile(path.join(__dirname, 'public', 'header2.html'));
});

app.get('/adminFooter.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'footer.html'));
});

app.get('/sidebar.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sidebar.html'));
});






// async function signupUser1() {
//     try {
        
//         const password = 'admin'
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const [result] = await pool.execute('UPdate users set password_hash = ?', [hashedPassword]);

//         console.log('User registered successfully');
//         return 'User registered successfully';
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// app.post('/signup1', async (req, res) => {
//     try {
//         const result = await signupUser1();
//         console.log(result);
//         res.json({ success: true, message: result });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });


app.post('/searchBookUser', async (req, res) => {
    try {
        const query = `
            SELECT 
                TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(authors, ',', n), ',', -1)) AS authors,
                TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(keywords, ',', n), ',', -1)) AS keywords,
                TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(subject_area, ',', n), ',', -1)) AS subject_area,
                TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(type_of_book, ',', n), ',', -1)) AS type_of_book,
                TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(publishers, ',', n), ',', -1)) AS publishers
            FROM book
            CROSS JOIN (
                SELECT 1 AS n UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5
                -- Add more SELECT statements if you expect more than 5 values separated by commas
            ) AS numbers
            WHERE n <= LENGTH(authors) - LENGTH(REPLACE(authors, ',', '')) + 1
            OR n <= LENGTH(keywords) - LENGTH(REPLACE(keywords, ',', '')) + 1
            OR n <= LENGTH(subject_area) - LENGTH(REPLACE(subject_area, ',', '')) + 1
            OR n <= LENGTH(type_of_book) - LENGTH(REPLACE(type_of_book, ',', '')) + 1
            OR n <= LENGTH(publishers) - LENGTH(REPLACE(publishers, ',', '')) + 1
        `;

        const [rows] = await pool.query(query);

        // Extract values from rows
        const authors = rows.map(row => row.authors).filter(author => author !== null && author !== '');
        const keywords = rows.map(row => row.keywords).filter(keyword => keyword !== null && keyword !== '');
        const subjectAreas = rows.map(row => row.subject_area).filter(subject => subject !== null && subject !== '');
        const typesOfBook = rows.map(row => row.type_of_book).filter(type => type !== null && type !== '');
        const publishers = rows.map(row => row.publishers).filter(publisher => publisher !== null && publisher !== '');

        // Select distinct values
        const distinctAuthors = [...new Set(authors)];
        const distinctKeywords = [...new Set(keywords)];
        const distinctSubjectAreas = [...new Set(subjectAreas)];
        const distinctTypesOfBook = [...new Set(typesOfBook)];
        const distinctPublishers = [...new Set(publishers)];

        res.json({ 
            success: true, 
            distinctAuthors, 
            distinctKeywords, 
            distinctSubjectAreas, 
            distinctTypesOfBook, 
            distinctPublishers 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/getSearchHistory/:user_id', async (req, res) => {
    const userId = req.params.user_id; 
    try {
        const query = `
            SELECT search_query
            FROM search_history
            WHERE user_id = ?
            ORDER BY search_date DESC
        `;

        const [rows] = await pool.query(query, [userId]);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching search history:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/insertSearchQuery', async (req, res) => {
    const { userId, query } = req.body;

    try { 
        const insertQuery = `
            INSERT INTO search_history (user_id, search_query, search_date)
            VALUES (?, ?, NOW())
        `;

        await pool.query(insertQuery, [userId, query]);

        res.json({ success: true, message: 'Search query inserted successfully' });
    } catch (error) {
        console.error('Error inserting search query:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/new-books-count', async (req, res) => {
    try {
        const query = "SELECT COUNT(*) AS newBooksCount FROM copies WHERE acquisition_date >= NOW() - INTERVAL 14 DAY";
        const [rows, fields] = await pool.query(query);
        const newBooksCount = rows[0].newBooksCount;
        res.json({ newBooksCount });
    } catch (error) {
        console.error('Error fetching new books count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/new-users-count', async (req, res) => {
    try {
        const query = "SELECT COUNT(*) AS newUsersCount FROM users WHERE sign_up_date >= NOW() - INTERVAL 14 DAY";
        const [rows, fields] = await pool.query(query);
        const newUsersCount = rows[0].newUsersCount;
        res.json({ newUsersCount });
    } catch (error) {
        console.error('Error fetching new books count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function addJournal2(user_id,url,author,keywords,comment,imageFile) {
    try {   
        const imageFilePath = `uploads/${imageFile.filename}`;
        // Insert into temp_journal table
        await pool.execute(`INSERT INTO temp_journal ( user_id, url, author, keywords, comment, cover) VALUES (?,?,?,?,?,?)`,
            [user_id,url,author,keywords,comment,imageFilePath]);

        console.log('Successful');
                return "Successful";
    } catch (error) {
        console.error(error);
    }
}

app.post('/addJournal',upload.single('image'), async (req, res) => {
    const {user_id,url,author,keywords,comment} = req.body;
    const imageFile = req.file;
    try {
        if (!imageFile) {
            res.status(400).json({ success: false, message: 'Image file is required' });
            return;
        }     
        const result = await addJournal2(user_id,url,author,keywords,comment,imageFile);
        console.log(result)
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


async function addJournal3(user_id,url,author,keywords,comment,coverPath) {
    try {
            // Insert into temp_journal table
            await pool.execute(`INSERT INTO journal ( user_id, url, author, keywords, comment,cover) VALUES (?,?,?,?,?,?)`,
                [user_id,url,author,keywords,comment,coverPath]);

            console.log('Successful');
            return "Successful";
    } catch (error) {
        console.error(error);
    }
}

app.post('/addJournal1', async (req, res) => {
    const {user_id,url,author,keywords,comment,coverPath} = req.body;
    try {
        const result = await addJournal3(user_id,url,author,keywords,comment,coverPath);
        console.log(result)
        res.json({ success: true, message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getJournal', async (req, res) => {
    try {
        const query = `
        SELECT journal_id,user_id, url, author, keywords, comment,cover FROM temp_journal WHERE 1`;

        const [rows] = await pool.query(query);
        
        const journal = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.cover, { encoding: 'base64' });
                return { 
                    journalId: row.journal_id,
                    userId: row.user_id,
                    url: row.url,
                    author: row.author,
                    keywords: row.keywords,
                    comment: row.comment,
                    cover: base64data,
                    coverPath: row.cover
                };
                
            } catch (error) {
                console.error('Error', error);
                
            }
        }));
        console.log(journal)
        res.json({ success: true, message: journal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getJournal1', async (req, res) => {
    const { journal_id } = req.body; // Destructure journal_id from req.body
    try {
        const query = `
        SELECT  url, author, keywords, comment FROM journal WHERE journal_id = ?`;

        const [rows] = await pool.execute(query, [journal_id]);
        
        // Check if rows array is not empty
        if (rows.length > 0) {
            const journalDetails = rows[0]; // Access the first row
            
            // Send the correct data back to the client
            res.json({
                success: true, 
                message: {
                    title: journalDetails.keywords, // Fix typo here
                    author: journalDetails.author,
                    url: journalDetails.url,
                    content: journalDetails.comment
                }
            });
        } else {
            // If no rows found, return a message to the client
            res.json({ success: false, message: 'No journals found' });
        }
    } catch (error) {
        console.error('Error fetching journal details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getJournal2', async (req, res) => {
    const { journal_id } = req.body; // Destructure journal_id from req.body
    try {
        const query = `
        SELECT  url, author, keywords, comment FROM temp_journal WHERE journal_id = ?`;

        const [rows] = await pool.execute(query, [journal_id]);
        
        // Check if rows array is not empty
        if (rows.length > 0) {
            const journalDetails = rows[0]; // Access the first row
            
            // Send the correct data back to the client
            res.json({
                success: true, 
                message: {
                    title: journalDetails.keywords, // Fix typo here
                    author: journalDetails.author,
                    url: journalDetails.url,
                    content: journalDetails.comment
                }
            });
        } else {
            // If no rows found, return a message to the client
            res.json({ success: false, message: 'No journals found' });
        }
    } catch (error) {
        console.error('Error fetching journal details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/removeJournal', async (req, res) => {
    const { journal_id,user_id,keyword, type } = req.body;

    try {
        const updateQuery = `DELETE FROM temp_journal WHERE journal_id = ?`;
        
        await pool.execute(updateQuery, [journal_id]);

        var newQuery = "";
        if (type=="accept"){
            newQuery = `INSERT INTO notifications (user_id,title,content) VALUES (?,"Journal accepted","Your journal ${keyword} is accepted by librarian and is public now! Go to watch")`;
        }else{
            newQuery = `INSERT INTO notifications (user_id,title,content) VALUES (?,"Journal rejected","Your journal ${keyword} is rejected by librarian. If you have any doubt, feel free to ask librarian")`;
        }
        await pool.execute(newQuery, [user_id]);

        res.json({ success: true, message: 'Remove successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error during removal' });
    }
});

app.post('/searchJournal', async (req, res) => {
    const searchInput = req.body.searchTerm;
    try {
        var query =`SELECT j.journal_id, u.name AS user_name, j.user_id, j.url, j.author, j.keywords, j.comment, j.cover 
        FROM journal j 
        INNER JOIN users u ON u.user_id = j.user_id 
        WHERE 1 = 1
        `;

        const queryParams = [];

    if (searchInput) {
        query += ` AND (
                    j.journal_id LIKE ? OR
                    j.user_id LIKE ? OR
                    j.url LIKE ? OR
                    j.author LIKE ? OR
                    j.keywords LIKE ? OR
                    j.comment LIKE ? OR
                    u.name LIKE ?
                )`;
        queryParams.push(
            ...Array(7).fill(`%${searchInput}%`), 
        );
    }
        
        const [rows] = await pool.query(query,queryParams);
        

        const journal = await Promise.all(rows.map(async (row) => {
            try {
                const base64data = await fs.readFile(row.cover, { encoding: 'base64' });
                return { 
                    journalId: row.journal_id,
                    userId: row.user_id,
                    url: row.url,
                    author: row.author,
                    keywords: row.keywords,
                    comment: row.comment,
                    cover: base64data
                };
                
            } catch (error) {
                console.error('Error', error);
                
            }
        }));
        res.json({ success: true, journal});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// const storage = multer.diskStorage({
//     destination: 'uploads/',
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
// const upload1 = multer({ storage });
// app.post('/uploadFile', upload1.single('file'), async (req, res) => {
//     const filePath = req.file.path; 

//     try {
//         await pool.query('INSERT INTO files (file_path) VALUES (?)', [filePath]);

//         res.json({ success: true, message: 'File uploaded successfully' });
//     } catch (error) {
//         console.error('Error storing file path in database:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload1 = multer({ storage: storage });

app.post('/updateFines', upload1.single('files'), async (req, res) => {
    const { fines } = req.body;
    try {
        const finesStr = JSON.parse(fines).join(',');
        const updateQuery = 'UPDATE fines SET status = ?, temp_files = ? WHERE fines_id IN (?)';
        const filePath = req.file ? req.file.path : null; 

        if (filePath === null) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        await pool.query(updateQuery, ['Pending', filePath, finesStr]);
        res.json({ success: true, message: 'Fines updated successfully' });
    } catch (error) {
        console.error('Error updating fines:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/checkFavorite', async (req, res) => {
    const { userId, isbn } = req.body;

    try {
        const query = 'SELECT COUNT(*) AS count FROM favourite WHERE user_id = ? AND ISBN = ?';
        const [rows] = await pool.query(query, [userId, isbn]);
        const count = rows[0].count;
        const isFavorite = count > 0;

        res.json({ success: true, isFavorite });
    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

});
