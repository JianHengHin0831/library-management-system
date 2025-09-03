// Prebuilt answers
var prebuiltAnswers = [
    { 
        question: "find look for search book related start end with",
        show:"How to search specific topic books?", 
        answer: "If you want to search the related book, you can open the sidebar, go to user home page and click the search bar." 
    },
    {
        question: "online digital book",
        show:"How to search online book?", 
        answer: "You can go to University of Southampton Official Online Library: https://library.soton.ac.uk/homepage"
    },
    { 
        question: "how process borrow check out book",
        show:"How to borrow a book?", 
        answer: "To borrow books, you can only see the book availability here and either reserve the book or directly go to library to borrow the book"
    },
    {
        question: "return book back",
        show:"How to return a book?", 
        answer: "To return books, simply bring them to the library's circulation desk during operating hours, and the staff will assist you with the return process."
    },
    {
        question: "when library operating hours open close",
        show:"What are the library's opening hours?", 
        answer: "The library is open from 9am - 11pm. Please check the library's website or contact them directly for the most up-to-date information."
    },
    {
        question: "where address library location",
        show: "Can you tell me the location of the library?",
        answer: "The library is located at level 2 of University of Southampton Malaysia Campus."
    },
    {
        question: "student ID card",
        show: "How to get student ID card?",
        answer: "To get a student ID card, you need to visit the library's circulation desk with a valid form of identification and proof of address. The staff will assist you in setting up your library account."
    },
    {
        question: "renew extend book",
        show: "How to renew a book?",
        answer: "You can renew books online by logging in to your library account and selecting the renew option next to the book you wish to renew in the book page. Keep in mind that renewal limits may apply."
    },
    {
        question: "library resources material",
        show: "What kinds of resources can I find in the library?",
        answer: "The library offers a wide range of resources including physical books or journal. You can access these resources both online and in-person at the library."
    },
    {
        question: "print photocopy library",
        show: "How can I print files while at the library?",
        answer: "Printing and photocopying services are available at the library. You can use your university ID card to pay for printing and photocopying, and there are self-service stations located throughout the library. The price is RM 0.10 each page for black and white printing and RM 0.60 for colour printing"
    },
    {
        question: "library research assistance",
        show: "What the research assistance the library has",
        answer: "Librarians are available to help with your research needs, including database searches, literature reviews, and citation formatting. You can schedule a research consultation or visit the library's reference desk for assistance."
    }
];


async function fetchData() {
    //first question
    try {
        const response = await fetch('http://localhost:3000/getRecommendedBooks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(), 
        });

        const recommendedBooksData = await response.json();

        if (recommendedBooksData.success) {
            const firstRecommendedBook = recommendedBooksData.recommendedBooks[0];
            const recommendedTitle = firstRecommendedBook.title;
            const recommendedAuthors = firstRecommendedBook.authors;
            const recommendedBookAnswer = `The book I recommend is "${recommendedTitle}", written by ${recommendedAuthors}. You can search for its availability.`;
            prebuiltAnswers.push({ question: "recommend suggest book ", show: "Recommend a book for me",answer: recommendedBookAnswer });
        } else {
            console.error("Error getting book details:", recommendedBooksData.message);
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }

    //second
    try {
        const response = await fetch('http://localhost:3000/getFavouriteBooks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
    
        if (!response.ok) {
            throw new Error(`Failed to fetch favorite books: ${response.status} ${response.statusText}`);
        }
    
        const favoriteBooksData = await response.json();
    
        if (favoriteBooksData.success && favoriteBooksData.favouriteBooks.length > 0) {
            const firstFavoriteBook = favoriteBooksData.favouriteBooks[0];
            const favoriteTitle = firstFavoriteBook.title;
            const favoriteAuthors = firstFavoriteBook.authors;
            const favoriteBookAnswer = `The book I think you favorite is "${favoriteTitle}", written by ${favoriteAuthors}. You can search for its availability.`;
            prebuiltAnswers.push({ question: "favourite book interest enjoy like", show: "What is the book I may interested",answer: favoriteBookAnswer });
        } else {
            console.error("No favorite books found.");
        }
    } catch (error) {
        console.error("Error fetching favorite books:", error.message);
    }

    //third
    try {
        const response = await fetch('http://localhost:3000/getBorrowedBooks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), 
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch borrowed books: ${response.status} ${response.statusText}`);
        }

        const borrowedBooksData = await response.json();

        if (borrowedBooksData.success && borrowedBooksData.borrowedBooks.length > 0) {
            const borrowedBooksInfo = borrowedBooksData.borrowedBooks.map((book, index) => {
                const returnDate = new Date(book.returnDate).toLocaleDateString('en-US', { timeZone: 'UTC' });
                return `${index + 1}. ${book.title}, return date: ${returnDate}`;
            });

            const borrowedBooksMessage = `There are ${borrowedBooksInfo.length} book(s) you are currently borrowing:\n${borrowedBooksInfo.join('\n')}`;
            prebuiltAnswers.push({ question: "current borrow check out book", show: "Can I get my current borrowing book?",answer: borrowedBooksMessage });
        } else {
            prebuiltAnswers.push({ question: "current borrow check out book", show: "Can I get my current borrowing book?",answer: "You are not currently borrowing any books." });
        }
    } catch (error) {}

    //forth
    fetch('http://localhost:3000/view', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const totalFines = data.totalFines;
                prebuiltAnswers.push({ question: "unpaid fines", show: "Can I get my unpaid fines?", answer: `Your current unpaid fines is RM ${totalFines}` });
            } else {
                console.error('Error retrieving total fines:', data.message);
            }
        })
        .catch(error => {
            console.error('Error retrieving total fines:', error);
        });

    //fifth
    fetch('http://localhost:3000/viewBorrowed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const totalFines = data.totalFines;
            prebuiltAnswers.push({ question: "how many overdue books", show: "Can I get my total overdue book?", answer: `Your current overdue ${totalFines} book(s)` });
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });
 
    //6
    fetch('http://localhost:3000/countBorrowedBooks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const totalFines = data.borrowedBooksCount;
                prebuiltAnswers.push({ question: "how many current borrow currently borrowing books books", show: "Can I get my total current borrowing book?", answer: `Your currently borrow ${totalFines} book(s)` });
            } else {
                console.error('Error retrieving total fines:', data.message);
            }
        })
        .catch(error => {
            console.error('Error retrieving total fines:', error);
        });

    //7th
    fetch('http://localhost:3000/countReservedB', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
    })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        const totalFines = data.borrowedBooksCount;
        prebuiltAnswers.push({ question: "how many current reserve books", show: "Can I get my total reserving books?", answer: `Your currently reserve ${totalFines} book(s)` });
    } else {
        console.error('Error retrieving total fines:', data.message);
    }
    })
    .catch(error => {
    console.error('Error retrieving total fines:', error);
    });

    //8
    fetch('http://localhost:3000/getBorrowedHistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
        if (data.success && data.borrowedBooks.length > 0) {
            const borrowedBooksInfo = data.borrowedBooks.map((book, index) => {
                return `${index + 1}. ${book.title}, status: ${book.status}`;
            });

            const borrowedBooksMessage = `There are ${borrowedBooksInfo.length} book(s) you have borrowed before: \n${borrowedBooksInfo.join('\n')}`;
            prebuiltAnswers.push({ question: "borrow borrowing history", show: "Can I get my borrowing history?", answer: borrowedBooksMessage });
        } else {
            prebuiltAnswers.push({ question: "borrow borrowing history", show: "Can I get my borrowing history?", answer: "You haven't borrowed any books." });
        }})

    //9
    fetch('http://localhost:3000/getFines', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    })
    .then(response => response.json())
    .then(data => {
    if (data.success && data.fine.length > 0) {
        const borrowedBooksInfo = data.fine.map((book, index) => {
            return `${index + 1}. ${book.title}, status: ${book.status}`;
        });

        const borrowedBooksMessage = `There are ${borrowedBooksInfo.length} fines you unpaid: \n${borrowedBooksInfo.join('\n')}`;
        prebuiltAnswers.push({ question: "unpaid fines list", show: "Can I get my unpaid fines list?", answer: borrowedBooksMessage });
    } else {
        prebuiltAnswers.push({ question: "unpaid fines list", show: "Can I get my unpaid fines list?", answer: "You don't have any unpaid fines" });
    }});
 
    //10
    fetch('http://localhost:3000/getReservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
        if (data.success && data.fine.length > 0) {
                const borrowedBooksInfo = data.fine.map((book, index) => {
                    return `${index + 1}. ${book.title}, status: ${book.status}`;
                });
        
                const borrowedBooksMessage = `There are ${borrowedBooksInfo.length} books you currently reserved: \n${borrowedBooksInfo.join('\n')}`;
                prebuiltAnswers.push({ question: "my reservation list", show: "Can I get my reservation list?", answer: borrowedBooksMessage });
    } else {
        prebuiltAnswers.push({ question: "my reservation list", show: "Can I get my reservation list?", answer: "You haven't reserve any book, go to reserve~" });
        }
    });

    //11
    fetch('http://localhost:3000/fetchAdmin', {
            method: 'POST'
        })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        const { name, email } = data.userData;
        prebuiltAnswers.push({ question: "library librarian contact", show: "Can I get librarian contact?", answer: `The librarian contact is ${email} (${name})` });
    } else {
        console.error('Error:', data.message);
    }});

    //13
    fetch('http://localhost:3000/countBooksA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const totalFines = data.borrowedBooksCount;
            prebuiltAnswers.push({ question: "how many books", show: "How many books in the library?", answer: `There are ${totalFines} books in the library` });
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

    //14
    fetch(`http://localhost:3000/getSettingDetails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
    .then(response => response.json())
    .then(result => {

        if (result.success) {
            const { duration, bookLimit, renewl, staff, student } = result.data;

            if (bookLimit) {
                prebuiltAnswers.push({ question: "many book borrow limit", show: "Can I know the borrow book limit?", answer: `Currently, every user can only borrow is ${bookLimit} books` });
            } 

            if (duration) {
                prebuiltAnswers.push({ question: "how long book borrow duration", show: "Can I get know how long a book can be borrowed?", answer: `Currently, every user can only borrow  a book for ${duration} days` });
            } 

            if (renewl) {
                prebuiltAnswers.push({ question: "how many book renewal renew times", show: "Can I get how many times a book can be renewed?", answer: `Currently, every user can only renew  a book for ${renewl} times` });
            } 

            if (staff) {
                prebuiltAnswers.push({ question: "staff lecturer fines rate", show: "Can I know the university staff fines rate?", answer: `Currently, every staff must pay RM${staff} each day for each overdue books` });
            } 

            if (student) {
                prebuiltAnswers.push({ question: "student fines rate", show: "Can I know student fines rate?", answer: `Currently, every student must pay RM${student} each day for each overdue books` });
            }

        } else {
            showDialog("Error", result.message)
        }});
}
fetchData().then(() => {});

function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") {
        return;
    }
 
    handleUserInput(userInput);
    document.getElementById("user-input").value = "";
}

async function handleUserInput(input) {
        addMessage("user", input);

        // Retrieve answer based on user input
        const answer = await findAnswer(input);
        addMessage("bot", answer);
    }


    function addMessage(sender, message) {
        const chatBox = document.getElementById("chat-box");
    
        if (Array.isArray(message)) {
            const introTextElement = document.createElement("div");
            introTextElement.classList.add(sender === "user" ? "user-message" : "bot-message");
            //introTextElement.classList.add("intro-text");
            introTextElement.textContent = "The most related question:";


            message.forEach((answer, index) => {
                const button = document.createElement("button");
                button.classList.add("answer-button");
                button.textContent = answer;
                button.addEventListener("click", function() {
                    console.log("Button clicked:", answer);
                    addMessage("user", answer);

                    const matchingPrebuiltAnswer = prebuiltAnswers.find(
                        item => item.show === answer
                    );
            
                    if (matchingPrebuiltAnswer) {
                        const botAnswer = matchingPrebuiltAnswer.answer;
                        addMessage("bot", botAnswer);
                    } else {
                        addMessage("bot", "I'm sorry, I couldn't find an answer to that question.");
                    }
                });
    
                introTextElement.appendChild(button);
                chatBox.appendChild(introTextElement);
            });
        } else {
            console.log(message);
            const formattedMessage = message.replace(/\n/g, "<br>");
            const messageElement = document.createElement("div");
            messageElement.classList.add(sender === "user" ? "user-message" : "bot-message");
            messageElement.innerHTML = formattedMessage;
            messageElement.style.color = sender === "user" ? "white" : "white";
            chatBox.appendChild(messageElement);
        }
    
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    const userInput = document.getElementById("user-input");

    userInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const message = userInput.value.trim(); 
    
            if (message !== "") {
                sendMessage(message);
    
                userInput.value = "";
            }
        }
    });

function cosineSimilarity(text1, text2) {
    const vector1 = textToVector(text1);
    const vector2 = textToVector(text2);

    return calculateCosineSimilarity(vector1, vector2);
}
function textToVector(tokens) {
    const vector = {};
    for (const token of tokens) {
        vector[token] = (vector[token] || 0) + 1;
    }
    return vector;
}

// function calculateCosineSimilarity(vec1, vec2) {
//     let dotProduct = 0;
//     for (const key in vec1) {
//         if (vec2.hasOwnProperty(key)) {
//             dotProduct += vec1[key] * vec2[key];
//         }
//     }

//     let magnitude1 = 0;
//     for (const key in vec1) {
//         magnitude1 += vec1[key] ** 2;
//     }
//     magnitude1 = Math.sqrt(magnitude1);

//     let magnitude2 = 0;
//     for (const key in vec2) {
//         magnitude2 += vec2[key] ** 2;
//     }
//     magnitude2 = Math.sqrt(magnitude2);

//     return dotProduct / (magnitude1 * magnitude2);
// }

function calculateCosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (const key1 in vec1) {
        const similarKey = Object.keys(vec2).find(key2 => key1.toLowerCase().includes(key2.toLowerCase()) || key2.toLowerCase().includes(key1.toLowerCase()));
        
        if (similarKey) {
            dotProduct += vec1[key1] * vec2[similarKey];
        }

        magnitude1 += vec1[key1] ** 2;
    }
    
    for (const key2 in vec2) {
        magnitude2 += vec2[key2] ** 2;
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    return dotProduct / (magnitude1 * magnitude2);
}




function preprocessText(text) {
    return text.toLowerCase().split(/\s+/);
}

function findAnswer(question) {
    const processedQuestion = preprocessText(question);
    let topAnswers = [
        { similarity: -1, show: null },
        { similarity: -1, show: null },
        { similarity: -1, show: null }
    ];

    for (const item of prebuiltAnswers) {
        const processedPrebuiltQuestion = preprocessText(item.question);
        const similarity = cosineSimilarity(processedQuestion, processedPrebuiltQuestion);

        for (let i = 0; i < topAnswers.length; i++) {
            if (similarity > topAnswers[i].similarity) {
                topAnswers.splice(i, 0, { similarity, show: item.show });

                topAnswers.pop();

                break;
            }
        }
    }

    if (topAnswers[0].similarity === -1) {
        return ["I'm sorry, I don't have an answer to that question."];
    }

    return topAnswers.map(item => item.show);
}

const toggleChatButton = document.getElementById("toggle-chat");
const chatContainer = document.getElementById("chat-container");

toggleChatButton.addEventListener("click", function(event) {
    event.stopPropagation(); 
    toggleChatContainer();
});

chatContainer.addEventListener("click", function(event) {
    event.stopPropagation(); 
});

document.addEventListener("click", function() {
    if (chatContainer.style.display === "block") {
        chatContainer.style.display = "none";
    }
});

function toggleChatContainer() {
    if (chatContainer.style.display === "none") {
        chatContainer.style.display = "block";
    } else {
        chatContainer.style.display = "none";
    }
}



