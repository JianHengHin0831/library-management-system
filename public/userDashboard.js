const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');

    const userId = localStorage.getItem('user_id');
    if (userId) {
        // Fetch total fines for the user
        console.log(userId)
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
                console.log(totalFines)
                document.getElementById('current_unpaid1').innerText = "RM"+ totalFines;
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
                console.log(totalFines)
                document.getElementById('current_overdue1').innerText = totalFines;
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
                console.log("hi"+data.borrowedBooksCount)
                const totalFines = data.borrowedBooksCount;
                document.getElementById('current_borrow1').innerText = totalFines;
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

 
    fetch('http://localhost:3000/getUserCirculationData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId})
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
            const circulationData = data.circulationData;

            const labels = circulationData.map(entry => entry.month);
            const checkouts = circulationData.map(entry => entry.checkouts);
            const returns = circulationData.map(entry => entry.returns);
            
          
            const checkoutDataset = {
              label: 'Borrowed',
              borderColor: 'red',
              data: checkouts
            };
            
            const returnDataset = {
              label: 'Returned',
              borderColor: 'green',
              data: returns
            };
            
            const ctx = document.getElementById('circulationChart').getContext('2d');
            new Chart(ctx, {
                maintainAspectRatio: false, 
                responsive: true,
                aspectRatio: 1, 
              type: 'line',
              data: {
                labels: labels,
                datasets: [checkoutDataset, returnDataset]
              },
              options: {
                scales: {
                  x: {
                    type: 'category', 
                    labels: labels, 
                    ticks: {
                      autoSkip: false 
                    }
                  },
                  y: {
                    beginAtZero: true
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
    fetch('http://localhost:3000/departmentA', {
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
            document.getElementById('departmentA').innerText = totalFines;
           
            
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
      document.getElementById('current_reserve1').innerText = totalFines;
  } else {
      console.error('Error retrieving total fines:', data.message);
  }
})
.catch(error => {
  console.error('Error retrieving total fines:', error);
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
          const profilePicBase64 = data.pic[0].profile_pic_base64;
          document.getElementById("img1").src = `data:image/png;base64, ${profilePicBase64}`;

      } else {
          console.error('Error fetching profile picture:', data.message);
      }
  } catch (error) {
      console.error('Error fetching profile picture:', error);
  }
}

fetchProfilePic(userId)

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
          if(totalFines==='S'){
              document.getElementById('roleA').innerText = "Student";
              
          }else{
              document.getElementById('roleA').innerText = "University Staff";
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

function profile() {
    window.location.href = 'userProfile.html'; 
}

function expand() {
    const sidebar = document.querySelector('.sidebar');
    const contentSection = document.querySelector('main');
    contentSection.classList.toggle('expand');
    const menuText = document.querySelectorAll('.text');
    menuText.forEach(function(text, index){
    setTimeout(() => {
        text.classList.toggle('open2');
    }, index * 50);
})
    sidebar.classList.toggle("close");
}; 