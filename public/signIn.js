document.addEventListener("DOMContentLoaded", function() {
    var rememberMeCheckbox = document.getElementById('remember');
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    
    if (localStorage.getItem('rememberedEmail') && localStorage.getItem('rememberedPassword')) {
        emailInput.value = localStorage.getItem('rememberedEmail');
        passwordInput.value = localStorage.getItem('rememberedPassword');
        rememberMeCheckbox.checked = true;
    }
});

document.getElementById('logIn').addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    var rememberMeCheckbox = document.getElementById('remember');
    const password = document.getElementById('password').value;
    var currentDate = new Date();
    var isFirstDayOfMonth = currentDate.getDate() === 1;  

    fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(async data => { 
        if (data.success) {
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberedEmail', email);
                localStorage.setItem('rememberedPassword', password);
            } else {
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
            }
            if(isFirstDayOfMonth){
                document.getElementById('email11').value = email;
                $('#contactForm').fadeToggle();
            }else {
                const userRole = data.role;
                const userId = data.userId;
                console.log(`User logged in with role: ${userRole}`);
                const {name, course, contact_number} = await fetchUserData(userId)
                if (userRole === 'A'||userRole==='L') {
                    if(name==""||course=="unknown"||contact_number==""){
                        window.location.href = 'adminProfile.html';
                    }else{
                        window.location.href = 'adminHome.html';
                    }
                     
                } else {
                    if(name==""||course=="unknown"||contact_number==""){
                        window.location.href = 'userProfile.html';
                    }
                    else{
                        window.location.href = 'userHome.html';
                    }
                    
                }
                console.log(userId);
                localStorage.setItem('user_id',userId);
            }
           
        } else {
            showDialog('Error','The email address or password is invalid.');
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
    });
});
function forgot(){
    window.location.href = 'forgotPw.html';
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
            showDialog("Success!","You have successfully logged in.");
            const userRole = result.role;
            const userId = result.userId;
            console.log(`User logged in with role: ${userRole}`);
            const {name, course, contact_number} = await fetchUserData(userId)
                if (userRole === 'A'||userRole==='L') {
                    if(name==""||course=="unknown"||contact_number==""){
                        window.location.href = 'adminProfile.html';
                    }else{
                        window.location.href = 'adminHome.html';
                    }
                     
                } else {
                    if(name==""||course=="unknown"||contact_number==""){
                        window.location.href = 'userProfile.html';
                    }
                    else{
                        window.location.href = 'userHome.html';
                    }
                    
                }
            console.log(userId);
            localStorage.setItem('user_id',userId);
            $('#contactForm').fadeOut();
        } else {
            showDialog("Error",result.message)
        }
    } catch (error) {
        console.error('Error log in:', error);
        showDialog("Error","The email address or password is invalid.");
    }
}
function cancel() {
    $('#contactForm').fadeOut();
} 


function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

async function fetchUserData(userId) {
    try {
        const response = await fetch('http://localhost:3000/fetchUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
        const data = await response.json();
        if (data.success) {
            console.log('User data:', data.userData);
            const name = data.userData.name;
            const course = data.userData.department;
            const contact_number = data.userData.contact_number;
            return { name, course, contact_number };
        } else {
            console.error('Error:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}
