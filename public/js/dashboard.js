document.addEventListener('DOMContentLoaded', function () {
  let currentRecipient = null;

  // Fetch and display user profile
  fetch('/profile')
    .then(response => response.json())
    .then(user => {
      const profileElement = document.getElementById('profile');
      if (profileElement) {
        profileElement.innerText = `Welcome, ${user.username}`;
      } else {
        console.error('Profile element not found in DOM.');
      }
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
    });

  // Fetch and display user list
  fetch('/users')
    .then(response => response.json())
    .then(users => {
      const userList = document.getElementById('user-list');
      if (userList) {
        userList.innerHTML = ''; // Clear previous user list
        users.forEach(user => {
          const userElement = document.createElement('button');
          userElement.classList.add('user-button');
          userElement.innerText = user.username;
          userElement.addEventListener('click', () => startChat(user.username));
          userList.appendChild(userElement);
        });
      } else {
        console.error('User list element not found in DOM.');
      }
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });

  // Start chat with a user
  function startChat(username) {
    currentRecipient = username;
    const chatHeader = document.getElementById('chat-header');
    if (chatHeader) {
      chatHeader.innerText = `Chatting with: ${username}`;
    } else {
      console.error('Chat header element not found in DOM.');
    }
    fetchMessages();
  }

  // Fetch and display messages
  function fetchMessages() {
    fetch('/messages')
      .then(response => response.json())
      .then(messages => {
        const messageList = document.getElementById('message-list');
        if (messageList) {
          messageList.innerHTML = ''; // Clear old messages
          messages
            .filter(msg => msg.sender === currentRecipient || msg.receiver === currentRecipient)
            .forEach(msg => {
              const messageElement = document.createElement('div');
              messageElement.classList.add('message');
              messageElement.innerText = `${msg.sender}: ${msg.message}`;
              messageList.appendChild(messageElement);
            });
        } else {
          console.error('Message list element not found in DOM.');
        }
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }

  // Send message
  document.getElementById('send-message')?.addEventListener('click', () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput?.value;

    if (!currentRecipient) {
      alert('Please select a user to chat with.');
      return;
    }

    if (!message?.trim()) {
      alert('Message cannot be empty.');
      return;
    }

    fetch('/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient: currentRecipient, message }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error);
          });
        }
        fetchMessages();
        if (messageInput) {
          messageInput.value = ''; // Clear input field
        }
      })
      .catch(error => {
        console.error('Error sending message:', error);
        alert(error.message);
      });
  });
});
