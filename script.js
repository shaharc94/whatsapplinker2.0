
document.addEventListener('DOMContentLoaded', function() {
    var createLinkButton = document.getElementById('createLink');
    var openChatButton = document.getElementById('openChat');
    var phoneNumberInput = document.getElementById('phoneNumber');
    var countryCodeSelect = document.getElementById('countryCode');
    var customMessageInput = document.getElementById('customMessage');
    var historyList = document.getElementById('historyList');

    // Load history from localStorage on page load
    function loadHistory() {
        var history = JSON.parse(localStorage.getItem('whatsappLinks')) || [];
        historyList.innerHTML = ''; // Clear existing history in the UI
        history.forEach(function(item, index) {
            var listItem = document.createElement('li');
            listItem.innerHTML = `<strong>מספר טלפון:</strong> ${item.phoneNumber}<br>
                                  <strong>הודעה:</strong> ${item.message || 'אין'}<br>
                                  <a href="${item.link}" target="_blank">${item.link}</a><br>
                                  <button class="deleteButton" data-index="${index}">מחק</button>`;
            historyList.appendChild(listItem);
        });
        addDeleteEventListeners();
    }

    // Save a new link to localStorage
    function saveToHistory(phoneNumber, message, link) {
        var history = JSON.parse(localStorage.getItem('whatsappLinks')) || [];
        history.push({ phoneNumber, message, link });
        localStorage.setItem('whatsappLinks', JSON.stringify(history));
    }

    // Delete a specific link from localStorage
    function deleteFromHistory(index) {
        var history = JSON.parse(localStorage.getItem('whatsappLinks')) || [];
        history.splice(index, 1); // Remove the item at the given index
        localStorage.setItem('whatsappLinks', JSON.stringify(history));
        loadHistory(); // Reload the history in the UI
    }

    // Add delete event listeners to buttons
    function addDeleteEventListeners() {
        var deleteButtons = document.querySelectorAll('.deleteButton');
        deleteButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var index = this.getAttribute('data-index');
                deleteFromHistory(index);
            });
        });
    }

    createLinkButton.addEventListener('click', function() {
        var phoneNumber = phoneNumberInput.value.replace(/\D/g,'');
        var countryCode = countryCodeSelect.value;
        var customMessage = customMessageInput.value.trim();
        
        if (phoneNumber) {
            var whatsappLink = 'https://wa.me/' + countryCode + phoneNumber;
            if (customMessage) {
                whatsappLink += '?text=' + encodeURIComponent(customMessage);
            }

            // Add detailed information to history without the country code in the displayed phone number
            var listItem = document.createElement('li');
            listItem.innerHTML = `<strong>מספר טלפון:</strong> ${phoneNumber}<br>
                                  <strong>הודעה:</strong> ${customMessage || 'אין'}<br>
                                  <a href="${whatsappLink}" target="_blank">${whatsappLink}</a>`;
            historyList.appendChild(listItem);

            // Save to localStorage
            saveToHistory(phoneNumber, customMessage, whatsappLink);

            // Copy to clipboard
            navigator.clipboard.writeText(whatsappLink).then(function() {
                createLinkButton.textContent = 'הקישור הועתק!';
                // Reset the button text after 2 seconds
                setTimeout(function() {
                    createLinkButton.textContent = 'צור והעתק קישור';
                }, 2000);
            }, function(err) {
                console.error('Could not copy text: ', err);
            });

            loadHistory(); // Reload the history to include the new link
        } else {
            alert('אנא הכנס מספר טלפון תקין');
        }
    });

    openChatButton.addEventListener('click', function() {
        var phoneNumber = phoneNumberInput.value.replace(/\D/g,'');
        var countryCode = countryCodeSelect.value;
        var customMessage = customMessageInput.value.trim();
        
        if (phoneNumber) {
            var whatsappLink = 'https://wa.me/' + countryCode + phoneNumber;
            if (customMessage) {
                whatsappLink += '?text=' + encodeURIComponent(customMessage);
            }
            window.open(whatsappLink, '_blank'); // Open the chat in a new tab
        } else {
            alert('אנא הכנס מספר טלפון תקין לפתיחת הצ\'אט');
        }
    });

    // Load history on page load
    loadHistory();
});
