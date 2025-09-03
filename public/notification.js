document.addEventListener('click', function(event) {
    const dropdown = document.getElementById("notificationDropdown");
    const button = document.querySelector(".notification-button");
    if (!dropdown.contains(event.target) && !button.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

function toggleDropdown() {
    const dropdown = document.getElementById("notificationDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

async function fetchNotifications() {
    const userId = localStorage.getItem('user_id');
    try {
        const response = await fetch('http://localhost:3000/fetchNotifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        }); 
        const data = await response.json();
        if (data.success) {
            console.log(data.notifications)
            renderNotifications(data.notifications);
        } else {
            console.error('Error fetching notifications:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

function renderNotifications(notifications) {
    if (!notifications || !Array.isArray(notifications)) {
        console.error('Error: Notifications data is invalid or undefined.');
        return;
    }

    const notificationList = document.getElementById("notificationList");
    const notificationButton = document.querySelector(".notification-button i");

    notificationList.innerHTML = '';
    // notificationButton.style.backgroundColor = '';

    let hasUnreadNotifications = false;

    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');

        const titleElement = document.createElement('h3');
        titleElement.textContent = notification.title;

        const timeElement = document.createElement('p');
        timeElement.textContent = notification.created_at.split('T')[0];;

        const contentElement = document.createElement('p');
        contentElement.textContent = notification.content;

        if (!notification.is_read) {
            titleElement.style.color = 'green';
            timeElement.style.color = 'green';
            contentElement.style.color = 'green'; 
            hasUnreadNotifications = true;
        } else {
            titleElement.style.color = 'grey'; 
            timeElement.style.color = 'grey'; 
            contentElement.style.color = 'grey'; 
        }

        notificationItem.addEventListener('click', () => {
            readNoti(notification.id); 
        });

        notificationItem.appendChild(titleElement);
        notificationItem.appendChild(timeElement);
        notificationItem.appendChild(contentElement);
        notificationItem.appendChild(document.createElement('hr'));
        
        notificationList.appendChild(notificationItem);
    });

   
     notificationButton.style.color = hasUnreadNotifications ? 'red' : '#00557F';
}

async function readNoti(id) {
    const userId = localStorage.getItem('user_id');
    try {
        const response = await fetch('http://localhost:3000/markOneAsRead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        }); 
        const data = await response.json();
        if (data.success) {
            console.log('success');
            fetchNotifications(); 
        } else {
            console.error('Error marking all notifications as read:', data.message);
        }
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
    }
}

async function markAllAsRead() {
    const userId = localStorage.getItem('user_id');
    try {
        const response = await fetch('http://localhost:3000/markAllAsRead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        }); 
        const data = await response.json();
        if (data.success) {
            console.log('All notifications marked as read');
            fetchNotifications(); 
        } else {
            console.error('Error marking all notifications as read:', data.message);
        }
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    fetchNotifications();
});
