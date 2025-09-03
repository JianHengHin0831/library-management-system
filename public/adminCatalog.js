const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');

function menu2(a){
    switch(a) {
        case 1:
        window.location.href = 'adminRegister.html'
        break;
        case 2:
        window.location.href = 'adminCatalog.html'
        break;
        case 3:
        window.location.href = 'adminAcquisition.html'
        break;
        default:
        break;
        }
}

async function catalogBook(ISBN, accessionNumber) {
    try {
        await fetch('http://localhost:3000/catalogBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ISBN,accessionNumber }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const a = data.message;
                if(data.message==="Successful"){
                    showDialog("Nice", data.message);
                }else{
                    showDialog("Opps", data.message);
                }
                
            } else {
                showDialog("Warning", error); // This line should be updated
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            showDialog("Error1", error); // This line should be updated
        });
    } catch (error) {
        console.error('Error:', error);
        showDialog("Error2", error); // This line should be updated
    }
}


function generate() {
    fetch('http://localhost:3000/countLargestCatalogNum', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const totalFines = data.max+1;
            document.getElementById('accession').value=totalFines;
            bwipjs.toCanvas(document.getElementById('barcodeCanvas'), {
                bcid: 'code128', 
                text: totalFines.toString(), 
                scale: 3, 
                height: 10, 
                includetext: true, 
                textxalign: 'center' 
            });
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => { 
        console.error('Error retrieving total fines:', error);
    });
   
}
function hideDialog() {
    window.location.reload();
    document.getElementById("dialog").style.display = "none";
  }
  
  function showDialog(header, para) {
    var h2Element = document.querySelector('#dialog-content h2');
    var pElement = document.querySelector('#dialog-content p');
    
    h2Element.textContent = header;
    pElement.textContent = para;
    document.getElementById("dialog").style.display = 'block';
}

async function startScanner() {
    const scanButton = document.getElementById('scanButton');
    scanButton.textContent = "Close Camera";
    scanButton.style.border = "1.5px solid #DB3030";
    scanButton.style.color = "#DB3030";
    scanButton.style.backgroundColor = "white";
    
    scanButton.addEventListener('mouseover', function() {
        scanButton.style.backgroundColor = "#DB3030";
        scanButton.style.color = "white";
    });
    
    scanButton.addEventListener('mouseout', function() {
        scanButton.style.backgroundColor = "white"; 
        scanButton.style.color = "#DB3030";
    });

    if (document.getElementById('video-container').children.length > 0) {
        scanButton.onclick = stopScanner;
        stopScanner();
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
            const videoContainer = document.getElementById('video-container');
            videoContainer.appendChild(videoElement);
            videoElement.srcObject = stream;
            videoElement.setAttribute('autoplay', true);
            videoElement.play();
             
            // const closeIcon = document.createElement('span');
            // closeIcon.textContent = '❌'; 
            // closeIcon.classList.add('close-icon');
            // videoContainer.appendChild(closeIcon);

            // closeIcon.addEventListener('click', function() {
            //     while (videoContainer.firstChild) {
            //         videoContainer.removeChild(videoContainer.firstChild);
            //     }
            // });
            
            var actual_result=false;
            codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, error) => {
                if (result) {
                    document.getElementById('isbn').value = result.text;
                    
                    videoElement.remove();
                    actual_result=true;
                    stream.getTracks().forEach(track => track.stop());
                    videoElement.pause();
                    stream.getTracks().forEach(track => track.stop());
                    videoElement.srcObject = null;
                    
                    
                }
                if(actual_result){
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }
                if (error) {
                    console.error('Barcode scanning error:', error);
                }
            });
        } else {
            console.error('No video input devices found.');
        }
    } catch (error) {
        console.error('Barcode scanning error:', error);
    }
    videoElement.remove();
}

function stopScanner() {
    const videoContainer = document.getElementById('video-container');
    while (videoContainer.firstChild) {
        videoContainer.removeChild(videoContainer.firstChild);
    }
    const scanButton = document.getElementById('scanButton');
    scanButton.textContent = "Scan Barcode";
    scanButton.onclick = startScanner;
    scanButton.style.border = "1.5px solid #00557F";
    scanButton.style.color = "#00557F";
    scanButton.style.backgroundColor = "white";
    
    scanButton.addEventListener('mouseover', function() {
        scanButton.style.backgroundColor = "#00557F";
        scanButton.style.color = "white";
    });
    
    scanButton.addEventListener('mouseout', function() {
        scanButton.style.backgroundColor = "white"; 
        scanButton.style.color = "#00557F";
    });

    // Stop the camera stream
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
        window.stream = null;
    }
}

function exportPNG() {
 
    const canvas = document.getElementById('barcodeCanvas');

    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'barcode.png'; 
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}; 
      
// --------------------SIDEBAR MENU START
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

