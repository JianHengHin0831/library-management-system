//big========================================================================
document.addEventListener('DOMContentLoaded', () => {
    getFinesInfo("");

    const searchInput = document.getElementById('searchInput2');

    // Add event listener for input events
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

async function getFinesInfo(searchInput) {
    try {
        const response = await fetch('http://localhost:3000/getFinesB', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchInput }),
            
        }); 

        const data = await response.json();

        if (data.success) {
            populateFinesInfoTable5(data.fine);
        } else {
            console.error('Error fetching fines information:', data.message);
        }
    } catch (error) {
        console.error('Error fetching fines information:', error);
    }

    var statusSep = document.querySelectorAll('.statusSep');

    statusSep.forEach(function(element) {
        element.style.border = '2px solid';
        element.style.borderRadius = '20px';
        element.style.padding = '5px';
        element.style.margin = 'auto';
        // element.style.marginTop = '20px';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.style.textAlign = 'center';
        element.style.width = '110px';
        element.style.height = '30px';
        element.style.lineHeight = '20px';
     
         switch (element.textContent) {
             case 'Overdue':
                 element.style.borderColor = '#FF9920';
                 element.style.color = '#FF9920';
                 break;
             default:
                 element.style.borderColor = '#FF4040';
                 element.style.color = '#FF4040';    }
     });
}


function populateFinesInfoTable5(finesInfo) {
    const tableBody = document.getElementById('hello4');
    console.log("hi")
    tableBody.innerHTML="";

    finesInfo.forEach(fine => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fine.finesId}</td>
            <td>${fine.borrowId}</td>
            <td>${fine.userId}</td>
            <td>${fine.title}</td>
            <td>${fine.authors}</td>
            <td>${fine.isbn}</td>
            <td>${fine.accessionNumber}</td>
            <td>${fine.price}</td>
            <td>${fine.finesPrice}</td>
            <td>${fine.daysLate}</td>
            <td class="status"><span class="statusSep">${fine.status}</span></td>
        `;
        tableBody.appendChild(row);
    });

}

//big big========================================================================
document.addEventListener('DOMContentLoaded', () => {
    getPendingInfo("");

    const searchInput2 = document.getElementById('searchInput3');
    searchInput2.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput2.value;
            getPendingInfo(searchTerm);
        }
    });

    searchInput2.addEventListener('input', function() {
        const searchTerm = searchInput2.value.trim(); 
        if (searchTerm === '') {
            getPendingInfo("");
        } 
    });
});

async function getPendingInfo(searchInput) {
    try {
        const response = await fetch('http://localhost:3000/pendingPayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchInput }),
            
        }); 

        const data = await response.json();

        if (data.success) {
            populateFinesInfoTable7(data.fine);
        } else {
            console.error('Error fetching fines information:', data.message);
        }
    } catch (error) {
        console.error('Error fetching fines information:', error);
    }
}

function populateFinesInfoTable7(finesInfo) {
    const tableBody = document.getElementById('pending');
    console.log("hi")
    tableBody.innerHTML="";

    finesInfo.forEach(fine => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><button class="successful-pay-button" onclick="successfulPay(${fine.finesId})">Confirm Payment</button></td>
            <td><a href="../${fine.temp_files}" download>Download Payment Slip</a></td>
            <td>${fine.finesId}</td>
            <td>${fine.borrowId}</td>
            <td>${fine.userId}</td>
            <td>${fine.title}</td>
            <td>${fine.accessionNumber}</td>
            <td>${fine.finesPrice}</td>
        `;
        tableBody.appendChild(row);
    });

}

async function successfulPay(finesId) {
    try {
      const response = await fetch(`http://localhost:3000/confirmPayment/${finesId}`, { method: 'PUT' });
      const data = await response.json();
      if (data.success) {
        window.location.reload(true);
        console.log('Payment confirmed successfully.');
      } else {
        console.error('Payment confirmation failed:', data.message);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  }


  async function payFines() {
    const userId = document.getElementById("userid").value;
    try {
      const response = await fetch(`http://localhost:3000/payFinesA/${userId}`, { method: 'PUT' });
      const data = await response.json();
      if (data.success) {
        window.location.reload(true);
        console.log('Payment confirmed successfully.');
      } else {
        console.error('Payment confirmation failed:', data.message);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  }

//small==========================================

async function calculateFines() {
    const userId = document.getElementById("userid").value;
    console.log(userId)
    
    try {
        const response = await fetch('http://localhost:3000/getFinesC', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
            
        }); 

        const data = await response.json();

        if (data.success) {
            document.getElementById("totalFines").textContent = data.total
            populateFinesInfoTable1(data.fine);
        } else {
            console.error('Error fetching fines information:', data.message);
        }
    } catch (error) {
        console.error('Error fetching fines information:', error);
    }
}


function populateFinesInfoTable1(finesInfo) {
    const tableBody1 = document.getElementById("hello6");
    tableBody1.innerHTML="";
    finesInfo.forEach(fine => {
        const row1 = document.createElement('tr');
        row1.innerHTML = `
            <td>${fine.finesId}</td>
            <td>${fine.borrowId}</td>
            <td>${fine.title}</td>
            <td>${fine.finesPrice}</td>
            <td>${fine.processingFee}</td>
            <td>${fine.daysLate}</td>
        `;
        tableBody1.appendChild(row1);
    });

}


async function payFines(){
    const userId = document.getElementById("userid").value;
    try {
        const response = await fetch('http://localhost:3000/completeFines', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (data.success) {
            console.log('Fines marked as completed successfully.');
            location.reload();
        } else {
            console.error('Error completing fines:', data.message);
        }
    } catch (error) {
        console.error('Error completing fines:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    getAcc();
});

async function getAcc() {
    try {
        const response = await fetch('http://localhost:3000/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('bank').value = data.data.bank;
            document.getElementById('acc').value = data.data.account;
            document.getElementById('imagePreview').src = 'data:image/jpeg;base64,' + data.data.imgBase64;   
        } else {
            console.error('Error fetching account details:', data.error);
        }
    } catch (error) {
        console.error('Error fetching account details:', error);
    }
}

const imageInput = document.getElementById('image');
        const imagePreview = document.getElementById('imagePreview');

        imageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    document.getElementById('placeholderIcon').style.display = 'none';
                    document.getElementById('placeholderText').style.display = 'none';
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = '#';
                imagePreview.style.display = 'none';
                document.getElementById('placeholderIcon').style.display = 'block';
                document.getElementById('placeholderText').style.display = 'block';
            }
        });

        async function fetchImageAsFile(imageUrl) {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1); // Extract filename from URL
                const file = new File([blob], fileName, { type: blob.type });
                return file;
            } catch (error) {
                console.error('Error fetching image:', error);
                return null;
            }
          }

        async function setCode() {
            const imageInput = document.getElementById('image');
            var imageFile = imageInput.files[0];
            if(imageFile===undefined){
                const image = document.getElementById('image').src;
                imageFile = await fetchImageAsFile(image); 
            }   
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
                const response = await fetch('http://localhost:3000/setCode', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (data.success) {
                    const message = data.message;
                    console.log(message);
                } else {
                    const error = data.message;
                    console.error('Error:', error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function setAcc() {
            const bank = document.getElementById('bank').value;
            const account = document.getElementById('acc').value;
            
            const data = { bank, account }; 
        
            try {
                const response = await fetch('http://localhost:3000/setAcc', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(data), 
                });
                const responseData = await response.json();
                if (responseData.success) {
                    const message = responseData.message;
                    console.log(message);
                    window.location.reload();
                } else {
                    const error = responseData.message;
                    console.error('Error:', error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
 

    










