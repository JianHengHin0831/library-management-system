async function verification() {
    const otp = document.getElementById("otpCode").value;
    const userId = localStorage.getItem('user_id');
    const password = localStorage.getItem('password');
    const email = localStorage.getItem('email');
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
            window.location.href = 'signupSuccess.html'
        } else {
            showDialog("Error",result.message)
        }
    } catch (error) {
        console.error('Error updating book:', error);
        showDialog("Error","Please try again");
    }
}