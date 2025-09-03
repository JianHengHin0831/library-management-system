// let appearance = true;

// function handleCheckboxChange(checkedCheckboxId) {
//     const checkboxes = document.querySelectorAll('input[type="checkbox"][name="mode"]');
//     checkboxes.forEach(function(checkbox) {
//         if (checkbox.id !== checkedCheckboxId) {
//             checkbox.checked = false;
//         }
//     });
//     if (checkedCheckboxId === 'light_mode') {
//         appearance = true; // Light mode
//     } else if (checkedCheckboxId === 'dark_mode') {
//         appearance = false; // Dark mode
//     }
//     console.log('Appearance:', appearance); // Log the appearance for testing
// }


async function saveChanges(){

    const borrowLimit = document.getElementById('book_borrow_limit').value;
    const duration = document.getElementById("book_borrow_duration").value;
    const renewlLimit = document.getElementById("renewl_limit").value;
    const studentFines = document.getElementById("student_fines_rate").value;
    const staffFines = document.getElementById("staff_fines_rate").value;
    
    try {
        console.log(duration)
        const response = await fetch(`http://localhost:3000/saveChanges`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                borrowLimit,
                duration,
                renewlLimit,
                studentFines,
                staffFines,
            }),
        });

        const result = await response.json();

        if (result.success) {
            showDialog("Nice","Save change successfully! ");
            $('#contactForm').fadeOut();
        } else {
            showDialog("Error",result.message)
        }
    } catch (error) {
        console.error('Error updating book:', error);
        showDialog("Error","Please try again");
    }
}

// async function notiStatus(){
//     var noti = null;
//     const checkbox = document.getElementById('toggle');
//     checkbox.addEventListener('change', async function() {
//         noti = this.checked ? true : false;
//         console.log("noti:", noti);
//         notiStatus1(noti)
//     });
// }
// async function notiStatus1(noti){

//     try {
//         console.log(noti)
//         const response = await fetch(`http://localhost:3000/notiStatus`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 userId,
//                 noti
//             }),
//         });

//         const result = await response.json();

//         if (result.success) {
//             console.log("success")
//             $('#contactForm').fadeOut();
//         } else {
//             showDialog("Error",result.message)
//         }
//     } catch (error) {
//         console.error('Error updating book:', error);
//         showDialog("Error","Please try again");
//     }
// }
// }
async function deleteHistory(){
    
    try {
        const response = await fetch(`http://localhost:3000/deleteHistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId
            }),
        });

        const result = await response.json();

        if (result.success) {
            showDialog("Nice","Delete successfully! ");
            $('#contactForm').fadeOut();
        } else {
            showDialog("Error",result.message)
        }
    } catch (error) {
        console.error('Error updating book:', error);
        showDialog("Error","Please try again");
    }
}

document.getElementById("submit").addEventListener("click", function(event) {
    event.preventDefault(); 
    feedback(); 
})

async function feedback(){
    const feedback = document.getElementById('feedback').value;
    console.log(feedback)
    if(feedback==""){
        showDialog("Error","Please don't submit empty feedback")
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/sendFeedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                feedback
            }),
        }); 

        const result = await response.json();

        if (result.success) {
            showDialog("Nice","Thank you for your feedback! ");
        } else {
            showDialog("Error",result.message)
        }
    } catch (error) {
        console.error('Error updating book:', error);
        showDialog("Error","Please try again");
    }
}

document.addEventListener('DOMContentLoaded', getSettingDetails);
async function getSettingDetails() {
    try {
        const response = await fetch(`http://localhost:3000/getSettingDetails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        const result = await response.json();

        if (result.success) {
            const { duration, bookLimit, renewl, staff, student } = result.data;

            if (bookLimit) {
                document.getElementById('book_borrow_limit').value = bookLimit;
            } else {
                document.getElementById('book_borrow_limit').value = '';
            }

            if (duration) {
                document.getElementById('book_borrow_duration').value = duration;
            } else {
                document.getElementById('book_borrow_duration').value = '';
            }

            if (renewl) {
                document.getElementById('renewl_limit').value = renewl;
            } else {
                document.getElementById('renewl_limit').value = '';
            }

            if (staff) {
                document.getElementById('staff_fines_rate').value = staff;
            } else {
                document.getElementById('staff_fines_rate').value = '';
            }

            if (student) {
                document.getElementById('student_fines_rate').value = student;
            } else {
                document.getElementById('student_fines_rate').value = '';
            }
            console.log(duration)
            $('#contactForm').fadeOut();
        } else {
            showDialog("Error", result.message)
        }
    } catch (error) {
        console.error('Error fetching setting details:', error);
        showDialog("Error", "Please try again");
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

  document.addEventListener('DOMContentLoaded', getSettings);
  async function getSettings() {
    console.log(userId)
  
      var lightCheckbox = document.getElementById('light_mode');
      var darkCheckbox = document.getElementById('dark_mode');
    //   var notificationCheckbox = document.getElementById('toggle')
  
      try {
          const response = await fetch(`http://localhost:3000/getSettings`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({userId}),
          });
  
          const result = await response.json();
  
        //   if (result.success) { 
        //       const { appearance } = result.data;
  
        //      if (appearance) {
        //          lightCheckbox.checked = true; // Select light mode checkbox
        //          darkCheckbox.checked = false; // Deselect dark mode checkbox
        //   } else {
        //          lightCheckbox.checked = false; // Deselect light mode checkbox
        //          darkCheckbox.checked = true; // Select dark mode checkbox
        //   }
        // //   notificationCheckbox.checked = noti;
  
        //       $('#contactForm').fadeOut();
        //   } else {
        //       showDialog("Error", result.message)
        //   }
      } catch (error) {
          console.error('Error fetching setting details:', error);
          showDialog("Error", "Please try again");
      }
  }

  function expand() {
    const sidebar = document.querySelector('.sidebar');
    const contentSection = document.getElementById("main-contents");
    contentSection.classList.toggle('expand');
    const menuText = document.querySelectorAll('.text');
    menuText.forEach(function(text, index){
    setTimeout(() => {
        text.classList.toggle('open2');
    }, index * 50);
})
    sidebar.classList.toggle("close");
};