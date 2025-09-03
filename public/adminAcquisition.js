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

async function recordAcquisition() {
    const isbn = document.getElementById('isbn').value;
    const request_date = document.getElementById('request_date').value;
    const request_by = document.getElementById('request_by').value;
    const vendor = document.getElementById('vendor').value;
    const order_no = document.getElementById('order_no').value;
    const price = document.getElementById('price').value;
    const received_date = document.getElementById('received_date').value;
    const copyQuantity = document.getElementById('copyQuantity').value;
    const remark = document.getElementById('remark').value;

    try {
        const response = await fetch('http://localhost:3000/recordAcquisition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isbn,
                request_date,
                request_by,
                vendor,
                order_no,
                price,
                received_date,
                copyQuantity,
                remark,
            }),
        });

        const data = await response.json();

        if (data.success) {
            const resultMessage = data.message;
            console.log(resultMessage);
            if(resultMessage==="Successful"){
                showDialog("Success!",resultMessage);
            }else{
                showDialog("Error",resultMessage);
            }
            
        } else {
            showDialog("Error", data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function hideDialog() {
    document.getElementById("dialog").style.display = "none";
    window.location.reload();
  }
  
function showDialog(header,para) {
    var h2Element = document.querySelector('#dialog-content h2');
    var pElement = document.querySelector('#dialog-content p');
    
    // Changing the content
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