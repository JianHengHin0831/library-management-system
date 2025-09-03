const headerContainer = document.getElementById('header-container');
const footerContainer = document.getElementById('footer-container');

function loadContent(containerElement, url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      containerElement.innerHTML = data;
    })
    .catch(error => {
      console.error('Error fetching content:', error);
    });
}

function loadAllContent() {
  loadContent(headerContainer, 'http://localhost:3000/header1.html');
  loadContent(footerContainer, 'http://localhost:3000/footer.html');
}

window.addEventListener('DOMContentLoaded', loadAllContent);
