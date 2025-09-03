const userId = localStorage.getItem('user_id'); 
const journal_id = localStorage.getItem('journalId');



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

// --------------------SIDEBAR MENU END

// -------------------- 2ROW SELECTION START



getJournal()
async function getJournal() {
    try {
        // Ensure journal_id is defined with the correct value before this call
        const response = await fetch('http://localhost:3000/getJournal1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ journal_id }), // Wrap journal_id in an object
        });
        const data = await response.json();
        
        if (data.success) {
            const journal = data.message; // Renamed journals to journal
            
            if (journal) { // Check if journal is not null or undefined
                const titleElement = document.getElementById('title');
                titleElement.textContent = journal.title;
                
                const authorElement = document.getElementById('author');
                authorElement.textContent = `By: ${journal.author}`;
                
                if(journal.url){
                    const urlElement = document.getElementById('url');
                    const url = journal.url;
                    const labelElement = document.createElement('label')
                    labelElement.textContent = `URL: `
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', url);
                    linkElement.textContent = `${url}`;
                    urlElement.appendChild(labelElement);
                    urlElement.appendChild(linkElement);
                }
                
                const contentElement = document.getElementById('content');
                contentElement.textContent = journal.content;

            } else {
                
            }
        } else {
        }
    } catch (error) {
        console.error('Error:', error);
    }
}