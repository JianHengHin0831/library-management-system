const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');


const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');
imagePreview.style.borderRadius ='15px';

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

        function menu1(a){
            switch(a) { 
                case 1:
                window.location.href = 'adminHome.html'
                break;
                case 2:
                window.location.href = 'adminDashboard.html'
                break; 
                case 3:
                window.location.href = 'adminCatalog.html'
                break;
                case 4:
                window.location.href = 'adminBorrow.html'
                break;
                case 5:
                window.location.href = 'adminPatrons.html'
                break;
                case 6:
                window.location.href = 'adminBook.html'
                break;
                case 7:
                window.location.href = 'adminOverdue.html'
                break;
                case 8:
                window.location.href = 'adminFines.html'
                break;
                case 9:
                window.location.href = 'adminReservation.html'
                break;
                case 10:
                window.location.href = 'adminReport.html'
                break;
                case 11:
                window.location.href = 'signIn.html'
                break;
                default:
                break;
              }
        }

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
  
        function bookInfo(){ 
            const isbn = document.getElementById("isbn").value;
            const apiUrl = `http://localhost:3000/api/book/${isbn}`;
            
            fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                throw new Error('Failed to fetch data from server');
                }
                return response.json();
            })
            .then(data1 => {
                document.getElementById("publishers").value=data1.publishers;
                document.getElementById("title").value=data1.title;
                document.getElementById("authors").value=data1.authors;
                addOption(data1.subjects)
                //document.getElementById("keywords").value=data1.subjects;

                document.getElementById("image").src=data1.cover;
                
                document.getElementById("imagePreview").src = data1.cover;
                document.getElementById("imagePreview").style.display = "block";
                document.getElementById('placeholderIcon').style.display = 'none';
                document.getElementById('placeholderText').style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error.message);
            });
        }

        const keywordsInput = document.getElementById('keywords');

        keywordsInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                addOption(keywordsInput.value);
                keywordsInput.value="";
            }
        });
        
        function addOption(optionTextStr) {
            const optionArray = optionTextStr.split(',');
        
            optionArray.forEach(optionText => {
                const optionElement = document.createElement('span');
                optionElement.classList.add('selectedOption');
        
                const closeIcon = document.createElement('span');
                closeIcon.classList.add('close-icon');
                closeIcon.textContent = '×'; 
        
                closeIcon.addEventListener('click', () => {
                    removeOption(optionElement);
                });
        
                optionElement.textContent = optionText.trim();
                optionElement.appendChild(closeIcon);
        
                document.getElementById("keyword-area").appendChild(optionElement);

            });
        }
        
        
        
        function removeOption(event) {
            document.getElementById("keyword-area").removeChild(event);
        }
        
        
        
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



        async function addBook() {
            const ISBN = document.getElementById('isbn').value;
            const title = document.getElementById('title').value;
            const authors = document.getElementById('authors').value;
            const locationElement = document.getElementById('location');
            const location = locationElement.options[locationElement.selectedIndex].value;
            const imprint = document.getElementById('imprint').value;
            const edition = document.getElementById('edition').value;
            const callNumber = document.getElementById('callNumber').value;
            const subjectAreaElement = document.getElementById('subjectArea');
            const subjectArea = subjectAreaElement.options[subjectAreaElement.selectedIndex].value;
            const typeOfBookElement = document.getElementById('typeOfBook');
            const typeOfBook = typeOfBookElement.options[typeOfBookElement.selectedIndex].value;
            const keywordsElements = document.querySelectorAll('#keyword-area .selectedOption');
            const keywordsArray = Array.from(keywordsElements).map(element => element.textContent.trim().slice(0, -1));
            const keywords = keywordsArray.join(', ');
            console.log(keywords)
            const isRed = document.getElementById('isRed').checked;
            const publishers = document.getElementById('publishers').value;
            const summary = document.getElementById('summary').value;
            const price = document.getElementById('price').value;
             
            const imageInput = document.getElementById('image');
            var imageFile = imageInput.files[0];
            console.log(imageInput)
            if(imageFile===undefined){
                const image = document.getElementById('image').src;
                imageFile = await fetchImageAsFile(image); 
            }

            // Validate ISBN
            const isValidISBN = validateISBN(ISBN);
            if (!isValidISBN) {
                showDialog("Error", "Please input a valid ISBN without punctuation.");
                return;
            }
                      
            const formData = new FormData();
            formData.append('ISBN', ISBN);
            formData.append('title', title);
            formData.append('authors', authors);
            formData.append('location', location);
            formData.append('imprint', imprint);
            formData.append('edition', edition);
            formData.append('callNumber', callNumber);
            formData.append('subjectArea', subjectArea);
            formData.append('typeOfBook', typeOfBook);
            formData.append('keywords', keywords);
            formData.append('publishers', publishers);
            formData.append('isRed', isRed);
            formData.append('summary', summary); 
            formData.append('price', price); 
            formData.append('image', imageFile); 
            
            try {
                const response = await fetch('http://localhost:3000/addBook', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (data.success) {
                    const message = data.message;
                    console.log(message);
                    showDialog("Remind", message);
                } else {
                    const error = data.message;
                    console.error('Error:', error); 
                    showDialog("Warning", error);
                }
            } catch (error) {
                console.error('Error:', error);
                showDialog("Error", error);
            }
        }
         
        function validateISBN(isbn) {
            // Regular expression to check for valid ISBN without punctuation
            const regex = /^[0-9]{10,13}$/;
            return regex.test(isbn);
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
        

        function hideDialog() {
            document.getElementById("dialog").style.display = "none";
            showConfirmReloadDialog();
        }
        
        function hideConfirmDialog() {
            document.getElementById("confirmDialog").style.display = "none";
        }
          
          function showDialog(header,para) {
            var h2Element = document.querySelector('#dialog-content h2');
            var pElement = document.querySelector('#dialog-content p');
            
            // Changing the content
            h2Element.textContent = header;
            pElement.textContent = para;
            document.getElementById("dialog").style.display = 'block';
          }

        function showSuccessfulRegisterDialog(){
            console.log("successful registered dialog")
            showDialog("Nice", "You have successfully registered a book.");
        }
        
        function showConfirmReloadDialog() {
            console.log("confirm reload dialog")
            document.getElementById("confirmDialog").style.display = 'block';
        }
        
        function confirmReload() {
            window.location.reload();
        }

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