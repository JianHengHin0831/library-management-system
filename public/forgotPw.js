 function go(){
    const email = document.getElementById('email').value;
    if (!email.endsWith('@soton.ac.uk')){
        return;
    }
    const requestBody = { 
        email: email,
    };
  
    fetch('http://localhost:3000/forgotPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
       localStorage.setItem('email',email);
        window.location.href = 'pwVerify.html';
        console.log(data.message)
    })
    .catch(error => {
        console.error('Error during signup:', error);
    });
}
