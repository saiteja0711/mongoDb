let form = document.getElementById('form')
        form.addEventListener('submit', signup)
        
        async function signup(e) {
            e.preventDefault();
            let name = document.getElementById('name').value;
            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;
            
            let obj = {
                name: name,
                email: email,
                password: password
            }
            let parentNode = document.getElementById('errorMessages');
            let Message = document.getElementById('message');
            Message.innerHTML='';
            parentNode.innerHTML = '';
                
            try {
                
                let promise = await axios.post('http://localhost:3000/user/signin', obj);
                if (promise.status == 201) {
                    let childHTML = '<h3>Registered Successfully</h3>';
                    Message.innerHTML = parentNode.innerHTML + childHTML;
                    
                } 
            } catch (err) {
                if (err.response && err.response.status === 500) {
                    let childHTML = '<h3>Email is already taken</h3>';
                    parentNode.innerHTML = parentNode.innerHTML + childHTML;
                }
                console.log(err);
            }
        }