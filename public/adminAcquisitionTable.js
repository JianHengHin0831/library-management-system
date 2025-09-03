// -------------------- SEARCH START
document.addEventListener('DOMContentLoaded', () => {
    searchAcquisition("");

    const searchInput = document.getElementById('searchInput');

    // Add event listener for input events
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            searchAcquisition("");
        } 
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value;
            searchAcquisition(searchTerm);
        }
    });

});

async function searchAcquisition(searchInput) {
    try {
        const response = await fetch('http://localhost:3000/searchAcquisition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchInput }),
        });

        const data = await response.json();

        if (data.success) {
            populateResultTable(data.acquisitions);
        } else {
            console.error('Error fetching acquisitions:', data.message);
        }
    } catch (error) {
        console.error('Error fetching acquisitions:', error);
    }
}

function populateResultTable(acquisitions) {
    const resultBody = document.querySelector('.table-wrapper table');
    resultBody.innerHTML = ""; 
    
    const headers = `
    <thead class="table-head" style="background-color: #00557F;">
        <tr>
            <th>Acquisition No</th>
            <th>ISBN</th>
            <th>Publisher</th>
            <th>Quantity Hardcopy</th>
            <th>Request Date</th>
            <th>Request By</th>
            <th>Department</th>
            <th>Order No</th>
            <th>Vendor</th>
            <th>Book Receive Date</th>
            <th>Remark</th>
            <th>Price Per Book</th>
            <th>Total Price</th>
        </tr>
    </thead>
    <tbody style="background-color: white;">
    `;

    resultBody.innerHTML = headers;
    acquisitions.forEach(acquisition => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${acquisition.acquisition_no}</td>
            <td>${acquisition.ISBN}</td>
            <td>${acquisition.publisher}</td>
            <td>${acquisition.quantity_hardcopy}</td>
            <td>${acquisition.request_date.split('T')[0]}</td>
            <td>${acquisition.request_by}</td>
            <td>${acquisition.department}</td>
            <td>${acquisition.order_no}</td>
            <td>${acquisition.vendor}</td>
            <td>${acquisition.book_receive_date}</td>
            <td>${acquisition.remark}</td>
            <td>${acquisition.price_per_book}</td>
            <td>${acquisition.total}</td>
        `;
        resultBody.querySelector('tbody').appendChild(row);
    });
}

searchAcquisition("AppTech")
// --------------------SIDEBAR MENU START

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

// --------------------SIDEBAR MENU END
 function cancel() {
     $('#contactForm').fadeOut();
 } 