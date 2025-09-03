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

document.addEventListener('DOMContentLoaded', () => { 
    searchUsers("");

    const searchInput = document.getElementById('searchInput');

    // Add event listener for input events
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            searchUsers("");
        } 
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value;
            searchUsers(searchTerm);
        }
    });

}); 

async function searchUsers(searchInput) {
    try {
        const response = await fetch('http://localhost:3000/searchPatrons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchInput }),
        }); 

        const data = await response.json();

        if (data.success) {
            populateResultTable(data.users);
        } else {
            console.error('Error fetching users:', data.message);
        }
    } catch (error) {
        console.error('Error fetching userss:', error);
    }
    var availibilityElements = document.querySelectorAll('.availability');
    var availibilitySeparate = document.querySelectorAll('.availabilitySep');
    // availibilityElements.forEach(function(element) {
    //     element.style.border = '2px solid green'});

availibilitySeparate.forEach(function(element) {
    element.style.border = '2px solid';
    element.style.borderRadius = '20px';
    element.style.padding = '5px';
    element.style.display = 'inline-block';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.textAlign = 'center';
    element.style.width = '110px';
    element.style.height = '30px';
    element.style.lineHeight = '20px';

    switch (element.textContent) {
        case 'Available':
            element.style.borderColor = '#118F11'; // green
            element.style.color = '#118F11';
            break;
        case 'Unavailable':
            element.style.borderColor = '#FF4040'; // red
            element.style.color = '#FF4040';
            break;
    }
});
}

function populateResultTable(users) {
    const resultBody = document.getElementById('hello4');
    resultBody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><button class="first-block-button" onclick="view1('${user.user_id}','${user.username}','${user.email}','${user.contact_number}','${user.availability}')"><i class='bx bxs-user-detail' style="margin-right: 10px;"></i>View</button></td>
            <td>${user.user_id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.contact_number}</td>
            <td class="availability"><span class="availabilitySep">${user.availability}</span></td>
        `;
        resultBody.appendChild(row);
    });
}

async function getUserDetails(userId) {
    try {
        const response = await fetch('http://localhost:3000/getUserDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        return data.userDetails;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return { success: false, message: 'Error fetching user details' };
    }
}

async function view1(user_id,username,email,contact_number,availability) {
    document.getElementById("a1").value = user_id;
    document.getElementById("a2").value = username;
    document.getElementById("a3").value = email;
    document.getElementById("a4").value = contact_number;
    document.getElementById("a5").value = availability;
    
    try {
        const user1 = await getUserDetails(user_id);
        document.getElementById("a8").value = user1.user_role;
        document.getElementById("a6").value = user1.department;
        document.getElementById("a7").value = user1.degree;
        if(user1.user_role!="Student"){
            document.getElementById("a7").value = "-"
            document.getElementById("a7").disabled = true;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
    
    $('#contactForm').fadeToggle();
}


function cancel() {
    $('#contactForm').fadeOut();
}

// const adminUserId = localStorage.getItem('user_id');
// async function changeUserRole() {
//     const userId=document.getElementById("a1").textContent;
//     var user = "";
//     const userRole = document.getElementById('userRole').value;
//     if(userRole=="student"){
//         user="S";
//     }else if(userRole=="university_staff"){
//         user="U";
//     }
//     else if(userRole=="librarian"){
//         user="L";
//     }
//     else if(userRole=="IT"){
//         user="IT";
//     }
//     else if(userRole=="senior_librarian"){
//         user="A";
//     }

//     try {
//         const response = await fetch('http://localhost:3000/changeRole', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ adminUserId, userId, user }),
//         });

//         const data = await response.json();
//         if (data.success) {
//             console.log('User role updated successfully:', data.message);
//         } else {
//             console.error('Error updating user role:', data.message);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }
    
// updated (14/4/2024 12:44am)
// const adminUserId = localStorage.getItem('user_id');

// async function changeUserRole() {
//     const userId = document.getElementById("a1").textContent;
//     var user = "";
//     const userRole = document.getElementById('userRole').value;
//     if (userRole == "student") {
//         user = "S";
//     } else if (userRole == "university_staff") {
//         user = "U";
//     } else if (userRole == "librarian") {
//         user = "L";
//     } else if (userRole == "IT") {
//         user = "IT";
//     } else if (userRole == "senior_librarian") {
//         user = "A";
//     }

//     try {
//         const response = await fetch('http://localhost:3000/changeRole', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ adminUserId, userId, user }),
//         });

//         const data = await response.json();
//         if (data.success) {
//             console.log('User role updated successfully:', data.message);
//         } else {
//             console.error('Error updating user role:', data.message);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// updated (14/4/2024 but not used)
// document.addEventListener("DOMContentLoaded", function() {
//     const selectSelected = document.querySelector(".select-selected");
//     const selectOptions = document.querySelector(".select-options");
//     const customSelect = document.getElementById("customSelect");
//     const userRole = document.getElementById("userRole");

//     // Set initial selected option
//     selectSelected.innerHTML = "Select User Role <span class='option-icon'><i class='bx bx-chevron-down'></i></span>";

//     // Populate the hidden select element
//     selectOptions.querySelectorAll("li").forEach(function(option) {
//         const newOption = document.createElement("option");
//         newOption.value = option.getAttribute("data-value");
//         newOption.textContent = option.textContent;
//         userRole.appendChild(newOption);
//     });

//     selectSelected.addEventListener("click", function() {
//         selectOptions.classList.toggle("active");
//     });

//     selectOptions.querySelectorAll("li").forEach(function(option) {
//         option.addEventListener("click", function() {
//             selectSelected.innerHTML = `${this.textContent} <span class='option-icon'><i class='bx bx-chevron-down'></i></span>`;
//             userRole.value = this.getAttribute("data-value");
//             selectOptions.classList.remove("active");
//         });
//     });

//     // Add event listener for changing the user role when the "Change User Role" button is clicked
//     const submitBtn = document.querySelector(".submit-btn");
//     submitBtn.addEventListener("click", changeUserRole);

//     // Add event listener for canceling the operation
//     const cancelBtn = document.querySelector(".cancel-btn");
//     cancelBtn.addEventListener("click", cancel);
// });


// updated (14/4/2024 2:40am)
const adminUserId = localStorage.getItem('user_id');

async function changeUserRole() {
    const userId = document.getElementById("a1").value;
    const username = document.getElementById("a2").value;
    const contact_number = document.getElementById("a4").value;
    const department = document.getElementById("a6").value;
    const degree = document.getElementById("a7").value;
    var user = "";
    const userRole = document.getElementById('userRole').value;
    if (userRole == "student") {
        user = "S";
    } else if (userRole == "university_staff") {
        user = "U";
    } else if (userRole == "librarian") {
        user = "L";
    } else if (userRole == "IT") {
        user = "IT";
    } else if (userRole == "senior_librarian") {
        user = "A";
    }

    try {
        const response = await fetch('http://localhost:3000/changeRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminUserId, userId, user,username,contact_number,department, degree   }),
        });

        const data = await response.json();
        if (data.success) {
            $('#contactForm').fadeOut();
            console.log('User role updated successfully:', data.message);
        } else {
            console.error('Error updating user role:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// ------------ CONTACT FORM SELECT USER ROLE START
document.addEventListener("DOMContentLoaded", function() {
    const selectSelected = document.querySelector(".select-selected");
    const selectOptions = document.querySelector(".select-options");
    const userRole = document.getElementById("userRole");

    // Set initial selected option
    selectSelected.innerHTML = "Select User Role <span class='option-icon'><i class='bx bx-chevron-down'></i></span>";

    // Populate the hidden select element
    selectOptions.querySelectorAll("li").forEach(function(option) {
        const newOption = document.createElement("option");
        newOption.value = option.getAttribute("data-value");
        newOption.textContent = option.textContent;
        userRole.appendChild(newOption);
    });

    selectSelected.addEventListener("click", function() {
        selectOptions.classList.toggle("active");
    });

    selectOptions.querySelectorAll("li").forEach(function(option) {
        option.addEventListener("click", function() {
            selectSelected.innerHTML = `${this.textContent} <span class='option-icon'><i class='bx bx-chevron-down'></i></span>`;
            userRole.value = this.getAttribute("data-value");
            selectOptions.classList.remove("active");
        });
    });
});
// ------------ CONTACT FORM SELECT USER ROLE END

// UPDATED 16/4/2024 10:33PM
// ------------ FILTER OPTION START 
document.addEventListener("DOMContentLoaded", function() {
    const selectSelected = document.querySelector(".filter-select-selected");
    const selectOptions = document.querySelector(".filter-select-options");
    const userRole = document.getElementById("tableFilter");

    // Set initial selected option
    selectSelected.innerHTML = "All <span class='option-icon'><i class='bx bx-chevron-down'></i></span>";

    // Populate the hidden select element
    selectOptions.querySelectorAll("li").forEach(function(option) {
        const newOption = document.createElement("option");
        newOption.value = option.getAttribute("data-value");
        newOption.textContent = option.textContent;
        userRole.appendChild(newOption);
    });

    selectSelected.addEventListener("click", function() {
        selectOptions.classList.toggle("active");
    });

    selectOptions.querySelectorAll("li").forEach(function(option) {
        option.addEventListener("click", function() {
            selectSelected.innerHTML = `${this.textContent} <span class='option-icon'><i class='bx bx-chevron-down'></i></span>`;
            userRole.value = this.getAttribute("data-value");
            selectOptions.classList.remove("active");
            const searchInput = document.getElementById('searchInput');
            const searchTerm = searchInput.value;
            const value = document.getElementById("tableFilter").value;
            searchUsers(searchTerm,value);
        });
    });
});
// ------------ FILTER OPTION END

document.addEventListener('DOMContentLoaded', () => { 
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            searchUsers("");
        } 
    });

}); 

async function searchUsers(searchInput,value) {
    try {
        const response = await fetch('http://localhost:3000/searchPatrons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchInput,value }),
        }); 

        const data = await response.json();

        if (data.success) {
            populateResultTable(data.users);
        } else {
            console.error('Error fetching users:', data.message);
        }
    } catch (error) {
        console.error('Error fetching userss:', error);
    }
    var availibilityElements = document.querySelectorAll('.availability');
    var availibilitySeparate = document.querySelectorAll('.availabilitySep');
    // availibilityElements.forEach(function(element) {
    //     element.style.border = '2px solid green'});

availibilitySeparate.forEach(function(element) {
    element.style.border = '2px solid';
    element.style.borderRadius = '20px';
    element.style.padding = '5px';
    element.style.display = 'inline-block';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.textAlign = 'center';
    element.style.width = '110px';
    element.style.height = '30px';
    element.style.lineHeight = '20px';

    switch (element.textContent) {
        case 'Available':
            element.style.borderColor = '#118F11'; // green
            element.style.color = '#118F11';
            break;
        case 'Unavailable':
            element.style.borderColor = '#FF4040'; // red
            element.style.color = '#FF4040';
            break;
    }
});
}

function populateResultTable(users) {
    const resultBody = document.getElementById('hello4');
    resultBody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
             <td><button class="first-block-button" onclick="view1('${user.user_id}','${user.username}','${user.email}','${user.contact_number}','${user.availability}')"><i class='bx bxs-user-detail' style="margin-right: 10px;"></i>View</button></td>
            <td>${user.user_id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.contact_number}</td>
            <td>${user.role_title}</td>
            <td class="availability"><span class="availabilitySep">${user.availability}</span></td>
        `;
        resultBody.appendChild(row);
    });
}
    // // Add event listener for changing the user role when the "Change User Role" button is clicked
    // const submitBtn = document.querySelector(".submit-btn");
    // submitBtn.addEventListener("click", changeUserRole);

    // // Add event listener for canceling the operation
    // const cancelBtn = document.querySelector(".cancel-btn");
    // cancelBtn.addEventListener("click", cancel);





















