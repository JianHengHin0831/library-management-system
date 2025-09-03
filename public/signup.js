function signUp() {
    const userId = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const email = document.getElementById('email').value;
    const tnc = document.getElementById('tnc').checked;

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
  
    if(!tnc){
        showDialog("Error","Please tick terms and condition checkbox.");
        return;
    }
    
    if (!isPasswordValid) {
        showDialog("Error","Password doesn't meet the requirements.");
        return
    } 
    if (!email.endsWith('@soton.ac.uk')) {
        showDialog("Error","Please enter a valid Southampton Email.");
        return;
    }

    
  
    else if (password !== confirmPassword) {
        showDialog("Error", "Password does not match.");
        return;
    }
  
    
    const requestBody = {  
        userId: userId,
        email: email,
        password: password, 
    };
  
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data); 
        if(data.message!=undefined){
            showDialog("Error", data.message);
        }else{
            localStorage.setItem('user_id', userId);
            localStorage.setItem('password', password);
            localStorage.setItem('email', email);
            window.location.href = 'verifyEmail.html';
        }
    }) 
    .catch(error => {
        console.error('Error during signup:', error);
    });
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

  //--------------------------------------------------------------------------------------------------
  async function verification() {
    const otp = document.getElementById("otp").value;
    const userId = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const hasNumber = /\d/.test(email);
  
    const userRole = hasNumber ? 'S' : 'U';


    try {
        const response = await fetch(`http://localhost:3000/verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otp,
                userId,
                password,
                email,
                userRole
            }),
        });

        const result = await response.json();

        if (result.success) {
            showDialog("Success!","You have successfully signed up.");
            $('#contactForm').fadeOut();
        } else {
            showDialog("Error",result.message)
        }
    } catch (error) {
        console.error('Error updating book:', error);
        showDialog("Error","Please try again");
    }
}
async function verification1() {
    const otp = document.getElementById("otp").value;
    const email = document.getElementById('email').value;
    
    try {
        const response = await fetch(`http://localhost:3000/verification1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otp,
                email
                
            }),
        });

        const result = await response.json();

        if (result.success) {
            showDialog("Success!","Registered successfully!");
            $('#contactForm').fadeOut();
        } else {
            showDialog("Error",result.message)
        }
    } catch (error) {
        console.error('Error log in:', error);
        showDialog("Error","Please try again");
    }
}
function cancel() {
    $('#contactForm').fadeOut();
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