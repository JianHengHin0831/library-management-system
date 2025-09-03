const email = localStorage.getItem('email');

async function complete2(){
    const password = document.getElementById('password').value;
    const c_password = document.getElementById('confirm_password').value;

    if(password!==c_password){
        showDialog("Warning","Password is not valid");
        return
    }

    const uppercaseRegex = /[A-Z]/; 
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const symbolRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const lengthRegex = /.{8,}/;

    const isUppercase = uppercaseRegex.test(password);
    const isLowercase = lowercaseRegex.test(password);
    const isNumber = numberRegex.test(password);
    const isSymbol = symbolRegex.test(password);
    const isLengthValid = lengthRegex.test(password);

    const isPasswordValid = isUppercase && isLowercase && isNumber && isSymbol && isLengthValid;
 
    if (!isPasswordValid) {
        showDialog("Warning","Password is not valid");
        return
    } 

    try {
        console.log("hi")
        const response = await fetch('http://localhost:3000/resetPassword2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        }); 

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            window.location.href = 'resetpwSuccess.html';
        } else {
            console.log("not success");
            document.getElementById('message').innerText = data.error;
        }
    } catch (error) {
        console.error('Error:', error);
    }

 }

 function hideDialog() {
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

  function togglePasswordVisibility(num) {
    const togglePassword1 = document.getElementById('togglePassword1');
    const togglePassword2 = document.getElementById('togglePassword2');
    var passwordInput = document.getElementById("password");
    var confirmInput = document.getElementById("confirm_password");
    if(num==1){
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword1.classList.remove('bxs-show');
            togglePassword1.classList.add('bxs-hide');
        } else {
            passwordInput.type = "password";
            togglePassword1.classList.remove('bxs-hide');
            togglePassword1.classList.add('bxs-show');
        }
    }
    else{
        if (confirmInput.type === "password") {
            confirmInput.type = "text";
            togglePassword2.classList.remove('bxs-show');
            togglePassword2.classList.add('bxs-hide');
        } else {
            confirmInput.type = "password";
            togglePassword2.classList.remove('bxs-hide');
            togglePassword2.classList.add('bxs-show');
        }
    }
}