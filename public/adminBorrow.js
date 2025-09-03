// --------------------SIDEBAR START
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

function menu2(a){
    switch(a) {
        case 1:
        window.location.href = 'adminBorrow.html'
        break;
        case 2:
        window.location.href = 'adminReturn.html'
        break;
        default:
        break;
      }
}
// -------------------- 2ROW SELECTION END

async function borrowBook(accession_number,  user_id) {
    try {
        await fetch('http://localhost:3000/borrowBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accession_number, user_id }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Data received from server:', data); // Log the data received from the server
            if (data.success) { 
                const a = data.message;
                console.log('Success message:', a); // Log the success message
                if(a==="Successful"){
                    showDialog("Nice!", a);
                }else{
                    showDialog("Opps!", a); 
                }
                
            } else {
                console.error('Error message:', data.message); // Log the error message
                showDialog("Warning", data.message);
            }
        })
        .catch(error => {
            console.error('Error during fetch:', error); // Log any fetch errors
        });
    } catch (error) {
        console.error('Error:', error); // Log any other errors
    }
}

function hideDialog() {
    window.location.reload(true);
    document.getElementById("dialog").style.display = "none";
  }
  
function showDialog(header,para) {
    var h2Element = document.querySelector('#dialog-content h2');
    var pElement = document.querySelector('#dialog-content p');
    
    // Changing the content
    h2Element.textContent = header;
    pElement.textContent = para;
    document.getElementById("dialog").style.display = 'block';
  }

  
  async function startScanner(num) {
    const button = document.getElementById(`scanButton${num}`);
    const videoContainer = document.getElementById(`video-container${num}`);
    
    
    if (videoContainer.children.length > 0) {
        // If video container is already present, remove it and change button text to "Scan Barcode"
        videoContainer.innerHTML = '';
        button.textContent= 'Scan barcode';
        button.style.border = "1.5px solid #00557F";
        button.style.color = "#00557F";
        button.style.backgroundColor = "white"
        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = "#00557F";
            button.style.color = "white";
        });
        
        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = "white"; 
            button.style.color = "#00557F";
        });
        return;
    }
    

    const codeReader = new ZXing.BrowserBarcodeReader();
    try {
        const videoInputDevices = await codeReader.getVideoInputDevices();
        if (videoInputDevices.length > 0) {
            const selectedDeviceId = videoInputDevices[0].deviceId;
            const constraints = {
                video: { 
                    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const videoElement = document.createElement('video');
            videoContainer.appendChild(videoElement);
            videoElement.srcObject = stream;
            videoElement.setAttribute('autoplay', true);
            videoElement.play();
            
            codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, error) => {
                if (result) {
                    if (num === '1') {
                        document.getElementById('book_accession_number').value = result.text;
                    } else {
                        document.getElementById('user_id').value = result.text.slice(0, -2);
                    }
                    stream.getTracks().forEach(track => track.stop());
                    videoContainer.innerHTML = '';
                    button.textContent = 'Scan Barcode';
                    button.style.border = "1.5px solid #00557F";
                    button.style.color = "#00557F";
                    button.style.backgroundColor = "white"
                    button.addEventListener('mouseover', function() {
                        scanButton.style.backgroundColor = "#00557F";
                        scanButton.style.color = "white";
                    });
                    
                    button.addEventListener('mouseout', function() {
                        scanButton.style.backgroundColor = "white"; 
                        scanButton.style.color = "#00557F";
                    });
                            }
                if (error) {
                    console.error('Barcode scanning error:', error);
                }
            });
            
            // Change button text to "Close Camera"
            button.textContent = 'Close Camera';
            button.style.border = "1.5px solid #DB3030";
            button.style.color = "#DB3030";
            button.style.backgroundColor = "white"

            button.addEventListener('mouseover', function() {
                button.style.backgroundColor = "#DB3030";
                button.style.color = "white";
            });
            
            button.addEventListener('mouseout', function() {
                button.style.backgroundColor = "white"; 
                button.style.color = "#DB3030";
            });

        } else {
            console.error('No video input devices found.');
        }
    } catch (error) {
        console.error('Barcode scanning error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const scanButtons = document.querySelectorAll('.scanButton');
    scanButtons.forEach(button => {
        button.addEventListener('click', () => {
            const num = button.dataset.num;
            startScanner(num);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const scanButtons = document.querySelectorAll('.scanButton');
    scanButtons.forEach(button => {
        button.addEventListener('click', () => {
            const num = button.dataset.num;
            startScanner(num);
        });
    });
});
