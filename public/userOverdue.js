const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');

var statusElements = document.querySelectorAll('.status');


statusElements.forEach(function(element) {
   element.style.border = '2px solid';
    element.style.borderRadius = '10px';
    element.style.padding = '5px';
    element.style.fontWeight = 'bold';

    switch (element.textContent) {
        case 'Overdue':
            element.style.borderColor = 'orange';
            element.style.color = 'orange';
            break;
        default:
            element.style.borderColor = 'red';
            element.style.color = 'red';    }
});

document.addEventListener('DOMContentLoaded', () => {
    getFinesInfo("");

    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            getFinesInfo("");
        } 
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value;
            getFinesInfo(searchTerm);
        }
    });

}); 

const userId = localStorage.getItem('user_id');
console.log(userId);
async function getFinesInfo(searchInput) {
    try {
        const response = await fetch('http://localhost:3000/getFines', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId,searchInput }),
        });  

        const data = await response.json();

        if (data.success) {
            populateFinesInfoTable(data.fines);
        } else {
            console.error('Error fetching fines information:', data.message);
        }
    } catch (error) {
        console.error('Error fetching fines information:', error);
    }

    var statusElements = document.querySelectorAll('.status');

    statusElements.forEach(function(element) {
        element.style.border = '2px solid';
        element.style.borderRadius = '20px';
        element.style.padding = '5px';
        element.style.margin = '10px';
        element.style.display = 'inline-block'; 
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.style.textAlign = 'center';
        element.style.width = '110px';
        element.style.height = '30px';
        element.style.lineHeight = '20px';
     
         switch (element.textContent) {
             case 'Overdue':
                 element.style.borderColor = 'orange';
                 element.style.color = 'orange';
                 break;
             default:
                 element.style.borderColor = 'red';
                 element.style.color = 'red';    }
     });
}

function populateFinesInfoTable(finesInfo) {
    const tableBody = document.getElementById('hello2');
    tableBody.innerHTML = '';

    finesInfo.forEach(fine => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="toggleCheckbox" onclick="totalFines()">
            </td>
            <td class="status">${fine.status}</td>
            <td>${fine.finesId}</td>
            <td>${fine.borrowId}</td>
            <td>${fine.title}</td>
            <td>${fine.authors}</td>
            <td>${fine.isbn}</td>
            <td>${fine.accessionNumber}</td>
            <td>${fine.price}</td>
            <td>${fine.finesPrice}</td>
            <td>${fine.daysLate}</td>
        `;

        tableBody.appendChild(row);
    });

}

function totalFines(){
    const checkboxes = document.querySelectorAll('.toggleCheckbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateHello3);
    });

    function updateHello3() {
        const hello3Body = document.getElementById('hello3');
        hello3Body.innerHTML = ''; 
        
        let totalFines = 0;

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const row = checkbox.closest('tr');
                const borrowId = row.cells[2].textContent;
                const finesAmount = row.cells[8].textContent;

                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${borrowId}</td>
                    <td>${finesAmount}</td>
                `;
                hello3Body.appendChild(newRow);

                totalFines += parseFloat(finesAmount);
            }
        });

        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td>Total:</td>
            <td>${totalFines}</td>
        `;
        hello3Body.appendChild(totalRow);
    }
};

async function fetchAccountData(method) {
    const contactForm = document.querySelector('#contactForm');
    contactForm.innerHTML = ''; 
    const overlay = document.getElementById('overlay');
    try {
        const response = await fetch('http://localhost:3000/account', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(), 
        });   
 
        const data = await response.json();

        if (data.success) {
            overlay.style.display = 'block'; 
            if (method === 'bank') {
                contactForm.style.width = '400px';
                contactForm.style.height = '360px';

                const titleElement = document.createElement('h2');
                titleElement.textContent = `Bank Account Details`;
                contactForm.appendChild(titleElement);
                titleElement.style.marginBottom = '15px';

                const bankElement = document.createElement('p');
                bankElement.textContent = `Bank Name: ${data.data.bank}`;
                contactForm.appendChild(bankElement);
                bankElement.style.marginBottom = '15px';
                bankElement.style.fontSize = '20px';
        
                const accountElement = document.createElement('p');
                accountElement.textContent = `Account No: ${data.data.account}`;
                contactForm.appendChild(accountElement);
                accountElement.style.marginBottom = '25px';
                accountElement.style.fontSize = '20px';

                const descElement = document.createElement('p');
                descElement.textContent = `Upload the proof of payment here:`;
                contactForm.appendChild(descElement);
                descElement.style.fontSize = '18px';
            } else {
                contactForm.style.width = '400px';
                contactForm.style.height = '500px';
                
                const scanTitleElement = document.createElement('h2');
                scanTitleElement.textContent = `Scan the QR to Pay`;
                contactForm.appendChild(scanTitleElement);

                const imgElement = document.createElement('img');
                imgElement.src = `data:image/png;base64,${data.data.imgBase64}`;
                imgElement.width = 200;
                contactForm.appendChild(imgElement);

                const descElement = document.createElement('p');
                descElement.textContent = `Upload the proof of payment here:`;
                contactForm.appendChild(descElement);
            }

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.pdf, .png'; 
            contactForm.appendChild(fileInput);

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.style.backgroundColor = '#26A823'
            contactForm.appendChild(submitButton);
            submitButton.addEventListener('click', async () => {
                const checkedFines = [];
                const checkboxes = document.querySelectorAll('.toggleCheckbox');
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        const fineId = checkbox.closest('tr').cells[1].textContent;;
                        checkedFines.push(fineId);
                    }
                });

                overlay.style.display = 'none';
            
                if (checkedFines.length > 0) {
                    try {
                        const formData = new FormData();
                        console.log(fileInput.files[0]);
                        console.log(checkedFines);
                        formData.append('files', fileInput.files[0]); 
                        formData.append('fines', JSON.stringify(checkedFines));
                
                        const response = await fetch('http://localhost:3000/updateFines', {
                            method: 'POST',
                            body: formData,
                        });
                
                        const result = await response.json();
                        if (result.success) {
                            alert("Pay fines successfully! ")
                            
                        } else {
                            alert(result.message)
                        }
                    } catch (error) {
                        console.error('Error updating fines:', error);
                        alert('An error occurred. Please try again later.');
                    }
                } else {
                    alert('Please select at least one fine.');
                }
            });
            $(contactForm).fadeToggle();

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.backgroundColor = '#DB3030';
            contactForm.appendChild(cancelButton);

            cancelButton.addEventListener('click', () => {
                $(contactForm).fadeToggle();
                overlay.style.display = "none";
            });
            
        } else {
            console.error('Error fetching fines information:', data.message);
        }
    } catch (error) {
        console.error('Error fetching fines information:', error);
    }
}


 

  async function payFines() {
    try {
        const finesAmount = 1;
        const response = await fetch('http://localhost:3000/payFines', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ finesAmount }),
        }); 
 
        const data = await response.json();

        if (response.ok) {
            if (data.success) {
                window.location.href = data.redirectUrl;
            } else {
                console.error('Payment initiation failed:', data.message);
            }
        } else {
            console.error('HTTP error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function fetchPaymentMethods() {
    try {
        const response = await fetch('http://localhost:3000/paymentMethods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "merchantAccount": 'HelloCompany473ECOM',
                "countryCode": "MY",
                "amount": {
                    "currency": "MYR",
                    "value": 1
                }
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Available payment methods:', data);
        } else {
            console.error('Error fetching payment methods:', data.error);
        }
    } catch (error) {
        console.error('Error fetching payment methods:', error);
    }
}


fetchPaymentMethods();


function cancel() {
    $('#contactForm').fadeOut();
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
