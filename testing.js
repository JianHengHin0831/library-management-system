const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library_system',
};

const pool = mysql.createPool(dbConfig);




//-------------15th test----------------------//
async function findRatingId(rating_id) {
    try {
        const [ratingRows] = await pool.query('SELECT rating_id FROM rating WHERE rating_id=?', [rating_id]);

        if (ratingRows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}

function generateRatingTestCases() {
    const testCases = [];

    for (let i = 1; i <= 1000; i++) {
        const expected = [1, 2, 5].includes(i) || (i >= 9 && i <= 13);
        testCases.push({ rating_id: i, expected });
    }

    return testCases;
}

async function runTests15() {
    console.log("Starting unit tests for findRatingId...");

    const testCases = generateRatingTestCases();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking existence of rating_id ${testCase.rating_id}`);

        try {
            const ratingIdExists = await findRatingId(testCase.rating_id);

            if (ratingIdExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${ratingIdExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for findRatingId completed.");
}


//-------------14th test----------------------//
async function findJournalId(journal_id) {
    try {
        const [journalRows] = await pool.query('SELECT journal_id FROM journal WHERE journal_id=?', [journal_id]);

        if (journalRows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}

function generateJournalTestCases() {
    const testCases = [];

    for (let i = 1; i <= 1000; i++) {
        const expected = [2, 3, 4].includes(i);
        testCases.push({ journal_id: i, expected });
    }

    return testCases;
}

async function runTests14() {
    console.log("Starting unit tests for findJournalId...");

    const testCases = generateJournalTestCases();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking existence of journal_id ${testCase.journal_id}`);

        try {
            const journalIdExists = await findJournalId(testCase.journal_id);

            if (journalIdExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${journalIdExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for findJournalId completed.");
}


//-------------13th test----------------------//
async function findfeebackID(accession_number) {
    try {
        const [borrowRows] = await pool.query('SELECT userId FROM feedback WHERE feedbackId=?', [accession_number]);

        if (borrowRows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}
function generateTestCases13() {
    const testCases = [];

    for (let i = 30330900; i <= 30331900; i++) {
        const expected = [30330908].includes(i);
        testCases.push({ accession_number: i, expected });
    }

    return testCases;
}
async function runTests13() {
    console.log("Starting unit tests for findFeedbackId...");

    const testCases = generateTestCases13();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking user_id for feedback ${i+1}`);

        try {
            const borrowIdExists = await findfeebackID(i+1);

            if (borrowIdExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${borrowIdExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for findfeedback completed.");
}


//-------------first test----------------------//
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

function generateTestCases1() {
    const testCases = [];

    for (let user_id = 1; user_id <= 20000; user_id++) {
        const expected = false;
        testCases.push({ user_id, expected });
    }

    return testCases;
}

async function runTests1() {
    console.log("Starting unit tests...");

    const testCases = generateTestCases1();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking user existence for user_id ${testCase.user_id}`);

        try {
            const userExists = await checkUserExist(testCase.user_id);
            if (userExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, got ${userExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All tests completed.");
}

//-----------------second test----------//

async function checkAccessionExist(accession_number) {
    const [rows] = await pool.query('SELECT * FROM copies WHERE accession_number = ?', [accession_number]);
    return rows.length > 0;
}

const expectedTrueAccessionNumber = 24;

function generateTestCases2() {
    const testCases = [];

    for (let accession_number = 1; accession_number <= 20000; accession_number++) {
        const expected = accession_number <= expectedTrueAccessionNumber;
        testCases.push({ accession_number, expected });
    }

    return testCases;
}

async function runTests2() {
    console.log("Starting unit tests...");

    const testCases = generateTestCases2();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking accession existence for accession_number ${testCase.accession_number}`);

        try {
            const accessionExists = await checkAccessionExist(testCase.accession_number);
            if (accessionExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, got ${accessionExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All tests completed.");
}

//-------------------third test----------------------------//
async function getLimitation() {
    const [rows] = await pool.query('SELECT * FROM setting WHERE setting_name = "Limitation of book"');
    return rows[0].limitation;
}



async function runTests3() {
    console.log("Starting unit tests for getLimitation...");


    for (let i = 0; i < 1000; i++) {
        console.log(`Test ${i + 1}:`);

        try {
            const limitation = await getLimitation();

            if (limitation === 4) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected limitation to be ${testCase.expected ? '2' : 'not 2'}, but got ${limitation}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for getLimitation completed.");
}

//--------------------forth test------------------//
async function isBookExist(ISBN) {
    try {
        const [rows] = await pool.query('SELECT * FROM book WHERE ISBN = ?', [ISBN]);
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
}
function generateTestCases4() {
    const testCases = [];

    for (let i = 1; i <= 2000; i++) {
        testCases.push({ ISBN: i, expected: i === 1 || i === 123  });
    }

    return testCases;
}

async function runTests4() {
    console.log("Starting unit tests for isBookExist...");

    const testCases = generateTestCases4();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking book existence for ISBN ${testCase.ISBN}`);

        try {
            const bookExists = await isBookExist(testCase.ISBN);

            if (bookExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${bookExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for isBookExist completed.");
}


//-------------------fifth test-------------------------//
async function findBorrowId(accession_number) {
    try {
        const [borrowRows] = await pool.query('SELECT borrow_id FROM borrow WHERE accession_number = ? AND borrow_status = "Borrowing"', [accession_number]);

        if (borrowRows.length > 0) {
            return true;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

function generateTestCases5() {
    const testCases = [];

    for (let i = 1; i <= 10000; i++) {
        const expected = [5, 8, 9, 11,13,36].includes(i);
        testCases.push({ accession_number: i, expected });
    }

    return testCases;
}

async function runTests5() {
    console.log("Starting unit tests for getBorrowId...");

    const testCases = generateTestCases5();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking borrow ID existence for accession_number ${testCase.accession_number}`);

        try {
            const borrowId = await findBorrowId(testCase.accession_number);

            if ((borrowId !== null) === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${borrowId !== null}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for getBorrowId completed.");
}

//-------------------------sixth test-------------------------//
async function findReserveId(accession_number) {
    try {
        const [borrowRows] = await pool.query('SELECT reserve_id FROM reservation WHERE reserve_status = \'Pending\' and accession_number=?', [accession_number]);

        if (borrowRows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}

function generateTestCases6() {
    const testCases = [];

    for (let i = 1; i <= 1000; i++) {
        const expected = [9,13,32,36,39,42].includes(i);
        testCases.push({ accession_number: i, expected });
    }

    return testCases;
}

async function runTests6() {
    console.log("Starting unit tests for findReserveId...");

    const testCases = generateTestCases6();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking Reserve Id existence for accession_number ${testCase.accession_number}`);

        try {
            const borrowIdExists = await findReserveId(testCase.accession_number);

            if (borrowIdExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${borrowIdExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for findReserveId completed.");
}

//-------------------------seventh test-------------------------//
async function findFinesID(accession_number) {
    try {
        const [borrowRows] = await pool.query('SELECT fines_id FROM fines WHERE status = \'Completed\' and accession_number=?', [accession_number]);

        if (borrowRows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}

function generateTestCases7() {
    const testCases = [];

    for (let i = 1; i <= 1000; i++) {
        const expected = [1,4,5,10].includes(i);
        testCases.push({ accession_number: i, expected });
    }

    return testCases;
}

async function runTests7() {
    console.log("Starting unit tests for findFinesId...");

    const testCases = generateTestCases7();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking Fines Id existence for accession_number ${testCase.accession_number}`);

        try {
            const borrowIdExists = await findFinesID(testCase.accession_number);

            if (borrowIdExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${borrowIdExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for findReserveId completed.");
}

//-------------------------favourite-----------------------//
async function findFavouriteID(accession_number) {
    try {
        const [borrowRows] = await pool.query('SELECT user_id FROM favourite WHERE id=?', [accession_number]);

        if (borrowRows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}

function generateTestCases8() {
    const testCases = [];

    for (let i = 1; i <= 1000; i++) {
        const expected = [1,2,3,4,5].includes(i);
        testCases.push({ accession_number: i, expected });
    }

    return testCases;
}

async function runTests8() {
    console.log("Starting unit tests for findFinesId...");

    const testCases = generateTestCases8();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking user Id existence for favourite id ${testCase.accession_number}`);

        try {
            const borrowIdExists = await findFavouriteID(testCase.accession_number);

            if (borrowIdExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${borrowIdExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for findReserveId completed.");
}

//-------------------------report-----------------------//
async function findReportID(accession_number) {
    try {
        const [borrowRows] = await pool.query('SELECT generated_by FROM report WHERE report_id=?', [accession_number]);

        if (borrowRows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}

function generateTestCases9() {
    const testCases = [];

    for (let i = 1; i <= 1000; i++) {
        const expected = [1,2,3,4,5,6,7,8,9,10].includes(i);
        testCases.push({ accession_number: i, expected });
    }

    return testCases;
}

async function runTests9() {
    console.log("Starting unit tests for findReportId...");

    const testCases = generateTestCases9();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking report existence for report id ${testCase.accession_number}`);

        try {
            const borrowIdExists = await findReportID(testCase.accession_number);

            if (borrowIdExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${borrowIdExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for findReserveId completed.");
}

//-------------------------student-----------------------//
async function findStudentID(accession_number) {
    try {
        const [borrowRows] = await pool.query('SELECT degree FROM student WHERE user_id=?', [accession_number]);

        if (borrowRows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}

function generateTestCases10() {
    const testCases = [];

    for (let i = 30330900; i <= 30331900; i++) {
        const expected = [30330908,30330909,30330912,30330914,30330916].includes(i);
        testCases.push({ accession_number: i, expected });
    }

    return testCases;
}

async function runTests10() {
    console.log("Starting unit tests for findStudentId...");

    const testCases = generateTestCases10();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking student existence for user id ${testCase.accession_number}`);

        try {
            const borrowIdExists = await findStudentID(testCase.accession_number);

            if (borrowIdExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${borrowIdExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for findReserveId completed.");
}


//-------------------------acquisition-----------------------//
async function runTests11() {
    const expectedTrueAccessionNumber = 17;
    console.log("Starting unit test for the count of rows in the acquisition history table...");

    try {
        let trueAccessionNumberFound = false;

        // Iterate over the acquisitions
        for (let acquisition = 1; acquisition <= 20000; acquisition++) {
            const expected = acquisition === expectedTrueAccessionNumber;

            if (acquisition === expectedTrueAccessionNumber) {
                trueAccessionNumberFound = true;
            }
            console.log(`Running test ${acquisition}`);

        }

        if (trueAccessionNumberFound) {
            console.log("Test passed! The expected acquisition exists in the test cases.");
        } else {
            console.error(`Test failed! The expected acquisition does not exist in the test cases.`);
        }

        const rowCount = await countRowsInAcquisitionHistory();
        if (rowCount === 17) {
            console.log("Test passed! The count of rows in acquisition history table is as expected (17).");
        } else {
            console.error(`Test failed! Unexpected count of rows in acquisition history table. Expected: 17, Actual: ${rowCount}`);
        }
    } catch (error) {
        console.error("Error occurred during test:", error);
    }

    console.log("Acquisition history table test completed.");
}




async function countRowsInAcquisitionHistory() {
    const [rows] = await pool.query('SELECT COUNT(*) AS rowCount FROM acquisition_history');
    return rows[0].rowCount;
}


//-------------------------authenticator-----------------------//
async function runTests12() {
    const expectedTrueAccessionNumber = 3;
    console.log("Starting unit test for the count of rows in the acquisition history table...");

    try {
        let trueAccessionNumberFound = false;

        for (let acquisition = 1; acquisition <= 200; acquisition++) {
            const expected = acquisition === expectedTrueAccessionNumber;

            if (acquisition === expectedTrueAccessionNumber) {
                trueAccessionNumberFound = true;
            }
            console.log(`Running test ${acquisition}`);

        }

        if (trueAccessionNumberFound) {
            console.log("Test passed! The expected acquisition exists in the test cases.");
        } else {
            console.error(`Test failed! The expected acquisition does not exist in the test cases.`);
        }

        const rowCount = await checkAuthenticator();
        if (rowCount === 3) {
            console.log("Test passed! The count of rows in authenticator table is as expected (3).");
        } else {
            console.error(`Test failed! Unexpected count of rows in authenticator table. Expected: 3, Actual: ${rowCount}`);
        }
    } catch (error) {
        console.error("Error occurred during test:", error);
    }

    console.log("authenticator table test completed.");
}




async function checkAuthenticator() {
    const [rows] = await pool.query('SELECT COUNT(*) AS rowCount FROM authenticator');
    return rows[0].rowCount;
}


/-------------------------student-----------------------//


async function runTests13() {
    console.log("Starting unit tests for findFeedbackId...");

    const testCases = generateTestCases13();

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: Checking user_id for feedback ${i+1}`);

        try {
            const borrowIdExists = await findfeebackID(i+1);

            if (borrowIdExists === testCase.expected) {
                console.log("Test passed!");
            } else {
                console.error(`Test failed! Expected ${testCase.expected}, but got ${borrowIdExists}`);
            }
        } catch (error) {
            console.error("Error occurred during test:", error);
        }
    }

    console.log("All unit tests for findReserveId completed.");
}



//user
//runTests1()
//copies
//runTests2()
//setting
//runTests3()
//book
//runTests4()
//borrow
//runTests5()
//reservation
 //runTests6();
//fines
//runTests7();
//favourite
 //runTests8();
// report
// runTests9();
// student
//runTests10();
//acquisitionhistory
// runTests11();
// authenticator
// runTests12();
// feedback
// runTests13();
// journal
// runTests14();
// rating
// runTests15();
