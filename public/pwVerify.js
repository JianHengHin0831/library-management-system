const email = localStorage.getItem('email');

async function complete1(){
    const otp = document.getElementById('otpCode').value;

    try {
        const response = await fetch('http://localhost:3000/resetPassword1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email,otp })
        }); 

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            window.location.href = 'newPw.html';
        } else {
            console.log("not success");
            document.getElementById('message').innerText = data.error;
        }
    } catch (error) {
        console.error('Error:', error);
    }

 }