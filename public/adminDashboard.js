const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');

function redirectToCatalogPage() {
    window.location.href = 'adminRegister.html'; 
}

function help() {
    window.location.href = 'adminHelp.html'; 
}
 
function profile() {
    window.location.href = 'adminProfile.html'; 
}


var statusElements = document.querySelectorAll('.status');


statusElements.forEach(function(element) {
   element.style.border = '2px solid';
    element.style.borderRadius = '10px';
    element.style.padding = '5px';
    element.style.fontWeight = 'bold'; 

    switch (element.textContent) {
        case 'Borrowing':
            element.style.borderColor = 'green';
            element.style.color = 'green';
            break;
        case 'Return':
            element.style.borderColor = 'grey';
            element.style.color = 'grey';
            break;
        default:
            element.style.borderColor = 'red';
            element.style.color = 'red';
    }
});



async function fetchProfilePic(userId) {
    try {
        const response = await fetch('http://localhost:3000/searchProfilePic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
            const profilePicData = data.pic[0].profile_pic_base64;
            if (profilePicData) {
                const profilePicDiv = document.querySelector('.profile_pic');
                profilePicDiv.innerHTML = `<img src="data:image/png;base64,${profilePicData}" alt="Profile Picture" width="100" height="100" style="border-radius: 50%;">`;

            }
        } else {
            console.error('Error fetching profile picture:', data.message);
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);
    }
}

fetchProfilePic(userId);


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
            document.getElementById('returnA').innerText = totalFines;
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });


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
            document.getElementById('overdueA').innerText = totalFines;
            document.getElementById('overdue2').innerText = totalFines;
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

    

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
            document.getElementById('borrowedA').innerText = totalFines;
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

    
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
            document.getElementById('bookA').innerText = totalFines;
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

   
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
            document.getElementById('visitorA').innerText = totalFines;
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

  
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
            document.getElementById('reservedA').innerText = totalFines;
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

    //-------------------------------------------------------------------
document.getElementById('fines2').innerText = 'Loading...';
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
        console.log(totalFines)
        document.getElementById('fines2').innerText = totalFines;
    } else {
        console.error('Error retrieving total fines:', data.message);
    }
})
.catch(error => {
    console.error('Error retrieving total fines:', error);
});

    //---------------------------------------------------
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
            document.getElementById('patrons2').innerText = totalFines;
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });

    if (userId) {
        // Fetch total fines for the user
        console.log(userId)
        fetch('http://localhost:3000/findNameA', {
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
                document.getElementById('nameA').innerText = totalFines;
            } else {
                console.error('Error retrieving total fines:', data.message);
            }
        })
        .catch(error => {
            console.error('Error retrieving total fines:', error);
        });
    } else {
        console.error('userId not found in sessionStorage');
    }
   
    if (userId) {
        // Fetch total fines for the user
        console.log(userId)
        fetch('http://localhost:3000/contactNumberA', {
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
                document.getElementById('contactNumberA').innerText = totalFines;
            } else {
                console.error('Error retrieving total fines:', data.message);
            }
        })
        .catch(error => {
            console.error('Error retrieving total fines:', error);
        });
    } else {
        console.error('userId not found in sessionStorage');
    }
   

    if (userId) {
        // Fetch total fines for the user
        console.log(userId)
        fetch('http://localhost:3000/emailA', {
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
                document.getElementById('emailA').innerText = totalFines;
            } else {
                console.error('Error retrieving total fines:', data.message);
            }
        })
        .catch(error => {
            console.error('Error retrieving total fines:', error);
        });
    } else {
        console.error('userId not found in sessionStorage');
    }
   

    document.getElementById("userNameA").innerText = userId;
    if (userId) {
        // Fetch total fines for the user
        console.log(userId)
        fetch('http://localhost:3000/roleA', {
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
                if(totalFines==='L'){
                    document.getElementById('roleA').innerText = "Librarian";
                }else{
                    document.getElementById('roleA').innerText = "Senior Librarian";
                }
                
            } else {
                console.error('Error retrieving total fines:', data.message);
            }
        })
        .catch(error => {
            console.error('Error retrieving total fines:', error);
        });
    } else {
        console.error('userId not found in sessionStorage');
    }


    console.log(userId);
    document.addEventListener('DOMContentLoaded', getFinesInfo);
    async function getFinesInfo() {
        try {
            const response = await fetch('http://localhost:3000/getFinesA', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(),
            });
    
            const data = await response.json();
    
            if (data.success) {
                populateFinesInfoTable(data.fine);
            } else {
                console.error('Error fetching fines information:', data.message);
            }
        } catch (error) {
            console.error('Error fetching fines information:', error);
        }
    }
    
    function populateFinesInfoTable(finesInfo) {
        const tableBody = document.getElementById('table1A');
    
        finesInfo.forEach(fine => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fine.userId}</td>
                <td>${fine.accessionNumber}</td>
                <td>${fine.title}</td>
                <td>${fine.daysLate}</td>
                <td>${fine.finesPrice}</td>
                
            `;
            tableBody.appendChild(row);
        });
    
    }

    document.addEventListener('DOMContentLoaded', getCirculationInfo);
    async function getCirculationInfo() {
        try {
            const response = await fetch('http://localhost:3000/getCirculationA', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(),
            });
    
            const data = await response.json();
    
            if (data.success) {
                populateFinesInfoTable1(data.fine);
            } else {
                console.error('Error fetching fines information:', data.message);
            }
        } catch (error) {
            console.error('Error fetching fines information:', error);
        }
    }
    
    function populateFinesInfoTable1(finesInfo) {
        const tableBody = document.getElementById('table2A');
    
        finesInfo.forEach(fine => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fine.userId}</td>
                <td>${fine.accessionNumber}</td>
                <td>${fine.title}</td>
                <td>${fine.daysLate}</td>
                
            `;
            tableBody.appendChild(row);
        });
    
    }

    fetch('http://localhost:3000/getUserCirculationDataA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify()
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
            const circulationData = data.circulationData;

            const labels = circulationData.map(entry => entry.date);
            const checkouts = circulationData.map(entry => entry.checkouts);
            const returns = circulationData.map(entry => entry.returns);
            const reserves = circulationData.map(entry => entry.reservations);
            
            const checkoutDataset = {
                label: 'Borrowed',
                borderColor: '#FF0000',
                pointBackgroundColor: '#FF0000',
                pointBorderColor: '#FF0000',
                pointRadius: 5,
                data: checkouts
            };
            
            const returnDataset = {
                label: 'Returned',
                borderColor: '#118F11',
                pointBackgroundColor: '#118F11',  
                pointBorderColor: '#118F11',
                pointRadius: 7,
                data: returns
            };

            const reserveDataset = {
                label: 'Reserved',
                borderColor: '#FFD058',
                pointBackgroundColor: '#FFD058',
                pointBorderColor: '#FFD058',
                pointRadius: 10,
                data: reserves
              };
            
            const ctx = document.getElementById('circulationChart').getContext('2d');
            new Chart(ctx, {
                maintainAspectRatio: false, 
                responsive: true,
                aspectRatio: 1, 
                width: 200, 
                height: 700, 
              type: 'line',
              data: {
                labels: labels,
                datasets: [checkoutDataset, returnDataset,reserveDataset]
              },
              options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: 'Josefin Sans',
                                size: 16
                            },
                            color: '#000000',
                            padding: 10,
                            formatter: function (labels, context) {
                                let legendHtml = '<table>';
                                labels.forEach((label) => {
                                    const color = label.dataset.borderColor;
                                    legendHtml += `
                                        <tr>
                                            <td>
                                                <span style="border: 2px solid ${color}; border-radius: 15px; background-color: white; padding: 3px; margin-right: 10px; color: ${color};">${label.text}</span>
                                            </td>
                                        </tr>
                                    `;
                                });
                                legendHtml += '</table>';
                                return legendHtml;
                            },
                        }
                    },
                    tooltip: {
                        titleFont: 'Josefin Sans',
                        bodyFont: 'Josefin Sans'
                    }
                },
                scales: {
                  x: {
                    type: 'category', 
                    labels: labels, 
                    ticks: {
                        autoSkip: false,
                        font: {
                            family: 'Josefin Sans'
                        },
                        color: '#000000',
                        padding: 10,

                    }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Josefin Sans'
                        },
                        color: '#000000',
                        padding: 10,
                    }
                  }
                }
              }
            });


          console.log("success");
        } else {
          console.error(data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching user circulation data:', error);
      });

      async function fetchNewBooksCount() {
        try {
            const response = await fetch('http://localhost:3000/new-books-count');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            const newBooksCountElement = document.getElementById('newA');
            newBooksCountElement.textContent = data.newBooksCount;
        } catch (error) {
            console.error('Error:', error);
            const newBooksCountElement = document.getElementById('newA');
            newBooksCountElement.textContent = 'Failed to fetch new books count';
        }
    }
    fetchNewBooksCount();

    async function fetchNewUsersCount() {
        try {
            const response = await fetch('http://localhost:3000/new-users-count');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            const newUserssCountElement = document.getElementById('newUserA');
            newUserssCountElement.textContent = data.newUsersCount;
        } catch (error) {
            console.error('Error:', error);
            const newUserssCountElement = document.getElementById('newUserA');
            newUserssCountElement.textContent = 'Failed to fetch new books count';
        }
    }
    fetchNewUsersCount();


function expand() {
    const sidebar = document.querySelector('.sidebar');
    const contentSection = document.querySelector("main");
    contentSection.classList.toggle('expand');
    const menuText = document.querySelectorAll('.text');
    menuText.forEach(function(text, index){
    setTimeout(() => {
        text.classList.toggle('open2');
    }, index * 50);
})
    sidebar.classList.toggle("close");
};
   

