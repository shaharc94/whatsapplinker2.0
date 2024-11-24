
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
        historyList.innerHTML = '';
        history.forEach(function(item, index) {
            var listItem = document.createElement('li');
            listItem.innerHTML = `<strong>מספר טלפון:</strong> ${item.phoneNumber}<br>
                                  <strong>הודעה:</strong> ${item.message || 'אין'}<br>
                                  <a href="#" class="copyLink" data-link="${item.link}" title="לחץ להעתקת הקישור">${item.link}</a><br>
                                  <button class="deleteButton" data-index="${index}">מחק</button>`;
            historyList.appendChild(listItem);
        });
        addCopyEventListeners();
        addDeleteEventListeners();
    }

    function saveToHistory(phoneNumber, message, link) {
        var history = JSON.parse(localStorage.getItem('whatsappLinks')) || [];
        history.push({ phoneNumber, message, link });
        localStorage.setItem('whatsappLinks', JSON.stringify(history));
    }

    function deleteFromHistory(index) {
        var history = JSON.parse(localStorage.getItem('whatsappLinks')) || [];
        history.splice(index, 1);
        localStorage.setItem('whatsappLinks', JSON.stringify(history));
        loadHistory();
    }

    function addDeleteEventListeners() {
        var deleteButtons = document.querySelectorAll('.deleteButton');
        deleteButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var index = this.getAttribute('data-index');
                deleteFromHistory(index);
            });
        });
    }

    function addCopyEventListeners() {
        var copyLinks = document.querySelectorAll('.copyLink');
        copyLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                var linkToCopy = this.getAttribute('data-link');
                navigator.clipboard.writeText(linkToCopy).then(function() {
                    alert('הקישור הועתק ללוח ההעתקות!');
                }).catch(function(err) {
                    console.error('Could not copy text: ', err);
                });
            });

            // Change cursor to pointer on hover
            link.style.cursor = 'pointer';
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
            saveToHistory(phoneNumber, customMessage, whatsappLink);
            loadHistory();
        } else {
            alert('אנא הכנס מספר טלפון תקין');
        }
    });

    loadHistory();
});
