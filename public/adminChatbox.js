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
        question: "return book",
        show:"How to return a book?", 
        answer: "To return books, simply bring them to the library's circulation desk during operating hours, and the staff will assist you with the return process."
    },
    {
        question: "library operating hours open close",
        show:"When is library operating hours?", 
        answer: "The library is open from 9am - 11pm. Please check the library's website or contact them directly for the most up-to-date information."
    },
    {
        question: "where library location",
        show: "Where is library?",
        answer: "The library is located at level 2 of University of Southampton Malaysia Campus."
    },
    {
        question: "student ID card",
        show: "How to get student ID card?",
        answer: "To get a student ID card, you need to visit the library's circulation desk with a valid form of identification and proof of address. The staff will assist you in setting up your library account."
    },
    {
        question: "renew book",
        show: "How to renew a book?",
        answer: "You can renew books online by logging in to your library account and selecting the renew option next to the book you wish to renew in the book page. Keep in mind that renewal limits may apply."
    },
    {
        question: "library resources",
        show: "What resource the library have?",
        answer: "The library offers a wide range of resources including physical books or journal. You can access these resources both online and in-person at the library."
    },
    {
        question: "print photocopy library printing and photocopying",
        show: "How to print in library?",
        answer: "Printing and photocopying services are available at the library. You can use your university ID card to pay for printing and photocopying, and there are self-service stations located throughout the library. The price is RM 0.10 each page for black and white printing and RM 0.60 for colour printing"
    },
    {
        question: "library research assistance",
        show: "What the research assistance the library has",
        answer: "Librarians are available to help with your research needs, including database searches, literature reviews, and citation formatting. You can schedule a research consultation or visit the library's reference desk for assistance."
    }
];


async function fetchData() {
    //11
    fetch('http://localhost:3000/fetchAdmin', {
            method: 'POST'
        })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        const { name, email } = data.userData;
        prebuiltAnswers.push({ question: "library librarian contact", show: "Can I get librarian contact information",answer: `The librarian contact is ${email} (${name})` });
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
            prebuiltAnswers.push({ question: "how many books", show: "How many books in the library",answer: `There are ${totalFines} books in the library` });
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
        
    //15
    fetch('http://localhost:3000/getMostBorrowedBooks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => { 
        if (data.success) {
            const borrowedBooksInfo = data.borrowedBooks.map((book, index) => {
                return `${index + 1}. ${book.title}, authors: ${book.authors}`;
            });
        
            const maxBooks = 5; 
            const limitedBooksInfo = borrowedBooksInfo.slice(0, maxBooks);
        
            const borrowedBooksMessage = `The ${limitedBooksInfo.length} books that mostly be borrowed: \n${limitedBooksInfo.join('\n')}`;
            prebuiltAnswers.push({ question: "most borrowed book", show: "Which books is most borrowed books?", answer: borrowedBooksMessage });
        } else {
            console.error('Error fetching MOST BORROWED books:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching MOST BORROWED books:', error);
    });
    //16
    fetch('http://localhost:3000/getTodayBorrowedBooks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const borrowedBooksInfo = data.borrowedBooks.map((book, index) => {
                return `${index + 1}. ${book.title}, authors: ${book.authors}`;
            });
        
            const maxBooks = 5; 
            const limitedBooksInfo = borrowedBooksInfo.slice(0, maxBooks);
        
            const borrowedBooksMessage = `There are ${limitedBooksInfo.length} books that borrowed today: \n${limitedBooksInfo.join('\n')}`;
            prebuiltAnswers.push({ question: "today borrowed book", show: "Can I know the books borrowed today?", answer: borrowedBooksMessage });
        } else {
            console.error('Error fetching TODAY BORROWED books:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching TODAY BORROWED books:', error);
    });

    //17
    fetch('http://localhost:3000/getTodayReturnedBooks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const borrowedBooksInfo = data.returnedBooks.map((book, index) => {
                return `${index + 1}. ${book.title}, authors: ${book.authors}`;
            });
        
            const maxBooks = 5; 
            const limitedBooksInfo = borrowedBooksInfo.slice(0, maxBooks);
        
            const borrowedBooksMessage = `There are ${limitedBooksInfo.length} books that returned today: \n${limitedBooksInfo.join('\n')}`;
            prebuiltAnswers.push({ question: "today returned book", show: "Can I know the books returned today?", answer: borrowedBooksMessage });
        } else {
            console.error('Error fetching TODAY BORROWED books:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching TODAY BORROWED books:', error);
    });

    //18
    fetch('http://localhost:3000/countReturnedBooksA', {
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
            prebuiltAnswers.push({ question: "total return books returned book", show: "Can I know how many books returned?", answer: `Currently, have ${totalFines} books have been returned` });
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });


    //19
    fetch('http://localhost:3000/countOverdueBooksA', {
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
            prebuiltAnswers.push({ question: "total overdue books book", show: "Can I know how many books overdue?", answer: `Currently, have ${totalFines} books have been overdue` });
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

    
    //20
    fetch('http://localhost:3000/countBorrowedBooksA', {
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
            prebuiltAnswers.push({ question: "total borrow books borrowed book", show: "Can I how many books have been borrowed?", answer: `Currently, ${totalFines} books have been borrowed` });
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

   //21
    fetch('http://localhost:3000/countUsersA', {
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
            prebuiltAnswers.push({ question: "how many total users", show: "Can I know how many users in the library?", answer: `Currently, the library have ${totalFines} users` });
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

    //22
    fetch('http://localhost:3000/countReservedA', {
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
            prebuiltAnswers.push({ question: "total reserve reserved books", show: "Can I know total reserved books?", answer: `Currently, the library have ${totalFines} reserved books` });
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

    //23
    fetch('http://localhost:3000/countUniqueA', {
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
            prebuiltAnswers.push({ question: "how many patrons unpaid fines", show: "Can I know how many students unpaid fines?", answer: `Currently, the library have ${totalFines} patron have unpaid fines` });
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

    //24
    fetch('http://localhost:3000/viewOverdueA', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const totalFines = data.totalFines;
            prebuiltAnswers.push({ question: "total unpaid fines", show: "Can I know total unpaid fines?", answer: `Currently, the library have RM ${totalFines} unpaid fines` });
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

    //25
    fetch('http://localhost:3000/getFinesA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        const borrowedBooksInfo = data.fine.map((book, index) => {
            return `${index + 1}. ${book.userId}, accession number: ${book.accessionNumber},overdue days: ${book.daysLate}`;
        });
    
        const maxBooks = 5; 
        const limitedBooksInfo = borrowedBooksInfo.slice(0, maxBooks);
    
        const borrowedBooksMessage = `There are ${limitedBooksInfo.length} overdue list most recently: \n${limitedBooksInfo.join('\n')}`;
        prebuiltAnswers.push({ question: "current overdue list", show: "Can I know the book list the currently overdue?", answer: borrowedBooksMessage });
    } else {
        console.error('Error fetching fines information:', data.message);
    }});

    //26
    fetch('http://localhost:3000/getCirculationA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        const borrowedBooksInfo = data.fine.map((book, index) => {
            return `${index + 1}. ${book.userId}, accession number: ${book.accessionNumber},status: ${book.daysLate}`;
        });
    
        const maxBooks = 5; 
        const limitedBooksInfo = borrowedBooksInfo.slice(0, maxBooks);
    
        const borrowedBooksMessage = `Here are ${limitedBooksInfo.length} circulation done recently: \n${limitedBooksInfo.join('\n')}`;
        prebuiltAnswers.push({ question: "circulation list", show: "Can I know the circulation list?", answer: borrowedBooksMessage });
    } else {
        console.error('Error fetching fines information:', data.message);
    }});

    const searchInput = "";
    //27
    fetch('http://localhost:3000/getFinesB', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })
    .then(response => response.json({searchInput}))
    .then(data => {
    if (data.success) {
        const borrowedBooksInfo = data.fine.map((book, index) => {
            return `${index + 1}. ${book.userId}, accession number: ${book.accessionNumber},fines: ${book.finesPrice}`;
        });
    
        const maxBooks = 5; 
        const limitedBooksInfo = borrowedBooksInfo.slice(0, maxBooks);
    
        const borrowedBooksMessage = `Here are the ${limitedBooksInfo.length} latest fines list: \n${limitedBooksInfo.join('\n')}`;
        prebuiltAnswers.push({ question: "current fine list", show: "Can I know the current fine list?", answer: borrowedBooksMessage });
    } else {
        console.error('Error fetching fines information:', data.message);
    }});

    //28
    fetch('http://localhost:3000/searchAcquisition', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchInput }),
    })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        const borrowedBooksInfo = data.acquisitions.map((book, index) => {
            return `${index + 1}. ${book.ISBN}, quantity: ${book.quantity_hardcopy},total: ${book.total}`;
        });
    
        const maxBooks = 5; 
        const limitedBooksInfo = borrowedBooksInfo.slice(0, maxBooks);
    
        const borrowedBooksMessage = `Here are the ${limitedBooksInfo.length} latest acquisition history: \n${limitedBooksInfo.join('\n')}`;
        prebuiltAnswers.push({ question: "acquisition history list", show: "Can I get the acquisition history list?", answer: borrowedBooksMessage });
    } else {
        console.error('Error fetching fines information:', data.message);
    }});

    //29
    fetch('http://localhost:3000/getReservationB', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchInput }),
    })
    .then(response => response.json())
    .then(data => { 
    if (data.success) {
        const borrowedBooksInfo = data.reservations.map((book, index) => {
            return `${index + 1}. ${book.user_id}, accession number: ${book.accessionNumber},status: ${book.status}`;
        });
    
        const maxBooks = 5; 
        const limitedBooksInfo = borrowedBooksInfo.slice(0, maxBooks);
    
        const borrowedBooksMessage = `Here are ${limitedBooksInfo.length} latest reservation history: \n${limitedBooksInfo.join('\n')}`;
        prebuiltAnswers.push({ question: "total reservation list", show: "Can I get the total reservation list?", answer: borrowedBooksMessage });
    } else {
        console.error('Error fetching fines information:', data.message);
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

