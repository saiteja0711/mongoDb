const form = document.getElementById('form');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    try {
        const response = await axios.post('http://localhost:3000/password/forgotPassword', {
            email: email,
        });
       console.log(response);
       alert("Email sent Succesfully")
       window.location.href = 'login.html';
        
    } catch (error) {
            console.error(error);
        
    }
});