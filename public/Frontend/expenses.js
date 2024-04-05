let form = document.getElementById('expenseForm');
let expenseList = document.getElementById('expenseList');
let table = document.getElementById("myTable");
let pagination = document.getElementById("pagination");
let selectElement= document.getElementById("pagesize")
let Premium= document.getElementById("isPremium")
let Leaderboard = document.getElementById('leaderboard')
let pageSize=0
 
const token = localStorage.getItem("token");
form.addEventListener('submit', addExpense);

function pagelimit() {
    const pageSizeElement = document.getElementById('pagesize');

    if (pageSizeElement) {
        const storedPageSize = localStorage.getItem('pagesize');

        if (storedPageSize !== null) {
            pageSizeElement.value = storedPageSize;
            pageSize = storedPageSize;
        } else {
            pageSize = pageSizeElement.value;
            localStorage.setItem('pagesize', pageSize);
        }

        pageSizeElement.addEventListener('change', function() {
            pageSize = pageSizeElement.value;
            localStorage.setItem('pagesize', pageSize);
            get(1); 
        });
    } else {
        pageSize = 2;
        localStorage.setItem('pagesize', pageSize);
    }
}


pagelimit();
async function addExpense(e) {
    e.preventDefault();
    let expenseAmount = document.getElementById('expenseAmount').value;
    let expenseDescription = document.getElementById('expenseDescription').value;
    let expenseCategory = document.getElementById('expenseCategory').value;

    let obj = {
        expenseAmount: expenseAmount,
        expenseDescription: expenseDescription,
        expenseCategory: expenseCategory
    };
    try {
        let response = await axios.post('http://localhost:3000/expenses/addexpenses', obj,{
            headers: { Authorization: token },
          });
        if (response.data.success) {
            alert(response.data.success);
            window.location.href = 'expenses.html';

        }
    } catch (err) {
        console.log(err);
    }
}

function showpremium(){
    document.getElementById("rzp-button1").style.display = 'none';
    const textNode = document.createTextNode(`You are a Premium User`);
 
    const inputElement = document.createElement('input')
    inputElement.type="button"
    inputElement.value= "Show Leaderboard"
    inputElement.classList.add("dynamicBtn");
    Premium.appendChild(textNode)
    document.getElementById('content').appendChild(inputElement);
    
    inputElement.onclick = async()=>{
        const userLeaderboard = await axios.get('http://localhost:3000/premium/showleaderboard')
       
        Leaderboard.innerHTML ='';
        Leaderboard.innerHTML+=`<h1>Leaderboard<h1>`
        console.log(userLeaderboard)
        leaderboardHeader();
        userLeaderboard.data.forEach((userDetails) =>{
            var row = Leaderboard.insertRow();

            var cell1 = row.insertCell(-1);
            var cell2 = row.insertCell(-1);

            cell1.innerHTML = `${userDetails.name}`;
            cell2.innerHTML = `${userDetails.totalExpense}`;
          
        })
    }

    downloadbtn() 

}

async function get(page){
    try{
        const response = await axios.get(`http://localhost:3000/expenses/details?Page=${page}&limit=${pageSize}`,{
            headers: { Authorization: token },
          })
        console.log(response);
        displayExpenses(response.data.expenses);
        showPagination(response.data.pageData);

    }
    catch (error) {
        console.error('Error fetching expenses:', error);
    }

}
async function showPagination
({
currentPage,
nextPage,
previousPage,
hasNextPage,
hasPreviousPage,
lastPage}){
    pagination.innerHTML='';
    if(hasPreviousPage)
    {
        const btn2 =document.createElement('button');
        btn2.innerHTML=previousPage
        btn2.addEventListener('click',()=>get(previousPage));
        pagination.appendChild(btn2);
    }
    const btn1 =document.createElement('button');
    btn1.innerHTML=`<h3>${currentPage}</h3>`
    btn1.addEventListener('click',()=>get(currentPage));
    pagination.appendChild(btn1);
    if(hasNextPage)
    {
        const btn3 =document.createElement('button');
        btn3.innerHTML=nextPage
        btn3.addEventListener('click',()=>get(nextPage));
        pagination.appendChild(btn3);
    }



}

async function displayExpenses(expense) {
    try {
       
        console.log('feteched expenses are>>>>>',expense);
       
        table.innerHTML='';
        if(expense!=null){
        tableHeader();
        expense.forEach(expenses => {
            var row = table.insertRow();
            row.className = "row";
            row.id = `${expenses._id}`;
            var cell1 = row.insertCell(-1);
            var cell2 = row.insertCell(-1);
            var cell3 = row.insertCell(-1);
            var cell4 = row.insertCell(-1);

            cell1.innerHTML = `${expenses.expenseCategory}`;
            cell2.innerHTML = `${expenses.expenseDescription}`;
            cell3.innerHTML = `${expenses.expenseAmount}`;
            cell4.innerHTML = `<input type="button" id="dynamicBtn" value="Delete Expense" class="delete"></input>`;
        })}

        // Add event listener for delete buttons using event delegation
        table.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete')) {
                const row = e.target.closest('tr');
                let id = e.target.parentElement.parentElement.id;
                
                try {
                    await axios.delete(`http://localhost:3000/expenses/delete/${id}`, {
                        headers: { Authorization: token }
                    });
                    row.remove();
                } catch (err) {
                    console.error('Error deleting expense:', err);
                }
            }
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}
async function downloadbtn() {
    const btn = document.createElement("input");
    btn.type = "button";
    btn.value = "Download";
    btn.classList.add("dynamicBtn");
    const div = document.getElementById("premium");
    div.appendChild(btn);
    btn.onclick = async () => {
      let promise = await axios.get("http://localhost:3000/expenses/download",{headers:{Authorization:token}});
      console.log(promise)
      if(promise.status==200){
        let a=document.createElement('a')
        a.href=promise.data.fileURL
        a.download='myexpense.csv'
        a.click()
      }
    };
  }

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const page = 1
    if (!token) {
      console.error('Token not found. Please log in.');
      return;
    }
    const decoded = parseJwt(token);
    console.log('Decoded token:', decoded);
    const isPremium = decoded.isPremium;

    if (isPremium)
     {
      showpremium();
      }
     
    get(page);
    document.getElementById('rzp-button1').onclick = buyPremiumHandler;
  });
 
  function tableHeader()
  {
    var row = table.insertRow();
    var cell1 = row.insertCell(-1);
    var cell2 = row.insertCell(-1);
    var cell3 = row.insertCell(-1);
    var cell4 = row.insertCell(-1);
    row.classList.add('tableHeader');
    cell1.innerHTML = "<b> Category <b>";
    cell2.innerHTML = "<b> Description<b>";
    cell3.innerHTML = "<b> Amount <b>";
    cell4.innerHTML = "<b> Changes <b>";

  }

  function leaderboardHeader()
  {
    var row = Leaderboard.insertRow();
    var cell1 = row.insertCell(-1);
    var cell2 = row.insertCell(-1);

    row.classList.add('tableHeader');

    cell1.innerHTML = "<b>Name <b>";
    cell2.innerHTML = "<b>Total Expense<b>";
  }
  

async function buyPremiumHandler(e) {
    try {
        const promise = await axios.get('http://localhost:3000/purchase/premiumpay', { headers: { 'Authorization': token } });
        console.log('promise is', promise);
        let options = {
            "key": promise.data.key_id,
            "order_id": promise.data.order.id,
            handler: async function (promise) {
                const res= await axios.post('http://localhost:3000/purchase/updatetransaction', {
                    order_id: options.order_id,
                    payment_id: options.key
                }, { headers: { "Authorization": token } });

                alert('You are a Premium User');
               
                localStorage.setItem('token', res.data.token);
                
                showpremium();
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', function (response) {
            console.log(response);
            alert('Payment failed. Please try again.');
        });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        alert('Failed to fetch payment details. Please try again.');
    }
}
