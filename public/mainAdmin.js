const headerContainer = document.getElementById('header-container');
const footerContainer = document.getElementById('footer-container');
const sidebarContainer = document.getElementById('sidebar-container');

function loadContent(containerElement, url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); 
    })
    .then(data => { 
      containerElement.innerHTML = data;
    })
    .catch(error => {
      console.error('Error fetching content:', error);
    });
}

function loadAllContent() { 
  loadContent(headerContainer, 'http://localhost:3000/header2.html'); 
  loadContent(footerContainer, 'http://localhost:3000/adminFooter.html'); 
  loadContent(sidebarContainer, 'http://localhost:3000/adminSidebar.html'); 
  changBg()
}

window.addEventListener('DOMContentLoaded', loadAllContent);

function changBg() {
  setTimeout(() => {
    var target=null;
    if (window.location.pathname.endsWith('adminHome.html')) {
      target = document.getElementById("homeUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminDashboard.html')) {
      target = document.getElementById("dashboardUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminAcquisition.html')||window.location.pathname.endsWith('adminCatalog.html')||window.location.pathname.endsWith('adminRegister.html')) {
      target = document.getElementById("registerUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminBorrow.html')||window.location.pathname.endsWith('adminReturn.html')) {
      target = document.getElementById("borrowUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminBook.html')) {
      target = document.getElementById("bookUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminPatrons.html')) {
      target = document.getElementById("patronsUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminCirculation.html')) {
      target = document.getElementById("circulationUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminOverdue.html')) {
      target = document.getElementById("overdueUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminAcquisitionTable.html')) {
      target = document.getElementById("acquisitionUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminReservation.html')) {
      target = document.getElementById("reserveUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminReport.html')) {
      target = document.getElementById("reportUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }
    else if (window.location.pathname.endsWith('adminCheckJournal.html')) {
      target = document.getElementById("journalUL");
      if (target) {
        target.style.backgroundColor='white';
        target.style.borderRadius='6px'
      }
    }

    if(target){
      const icon = target.querySelector('.icon');
      if (icon) {
        icon.style.color = '#C39A6F';
      }
      
      const text = target.querySelector('.nav-text');
      if (text) {
        text.style.color = '#C39A6F';
      }
    }
  }, 100); 
}

function hover() {
  setTimeout(() => {
    const navLinks = document.querySelectorAll('.nav-link');
    const tooltips = [];
    
    navLinks.forEach(link => {
        link.addEventListener('mouseover', e => {
            const tooltip = document.createElement('div');
            tooltip.textContent = link.querySelector('.nav-text').textContent;
            tooltip.style.position = 'fixed';
            tooltip.style.background = '#333';
            tooltip.style.color = '#fff';
            tooltip.style.padding = '5px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.zIndex = '1000';
            tooltip.style.left = e.pageX + 'px';
            tooltip.style.top = (e.pageY + 10) + 'px';
            document.body.appendChild(tooltip);
            tooltips.push(tooltip);
        });
    
        link.addEventListener('mouseleave', e => {
            tooltips.forEach(tooltip => tooltip.remove());
            tooltips.length = 0;
        });
    });
    

  }, 500); 
}
hover();

const userId = localStorage.getItem('user_id')

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

          const imgElement = document.createElement('img');
          imgElement.src = `data:image/png;base64, ${profilePicBase64}`;
          imgElement.style.width = '100%';
          imgElement.style.height='100%';
          imgElement.style.borderRadius = '50%';
          imgElement.alt = 'Profile Picture';
          document.getElementById("profPic").appendChild(imgElement);
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
          document.querySelector('.userName').innerText = totalFines;
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
          localStorage.setItem('role',totalFines)
          if (totalFines !== 'A' && totalFines !== 'L') {
            window.location.href = '404.html';
        }
          document.getElementById('userBadge').innerText = "Librarian";
          
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
