const uncheckGiveUpMessages = [
    "Do you really want to see M.Elon's garbage?", 
    "Of course you are an adult!",
    "Here you go, almost there!",
    "Open sesame open!"];

    document.addEventListener('DOMContentLoaded', function() {
        const checkbox = document.getElementById('toggleRedirect');
        const message = document.getElementById('message');
        const explain = document.getElementById('explain');
        const theSwitchButton = document.querySelector('.switch');
        const toggleLabel = document.querySelector('.toggle-label');
        let attempts = 0;
        
        function updateToggleLabel(isEnabled) {
            toggleLabel.textContent = isEnabled ? "Redirection Enabled" : "Redirection Disabled";
            explain.textContent = isEnabled ? ' You need to remove 4 rocks to open the gate. (Open sesame open!)': 'Now you can visit twitter.com (come back soon)';
            theSwitchButton.title = isEnabled ? 'Click to disable redirection (need few clicks)' : 'Click to enable redirection';
        }
    
        // Load the current state
        chrome.storage.sync.get('redirectEnabled', function(data) {
            checkbox.checked = data.redirectEnabled !== false;
            updateToggleLabel(checkbox.checked);
        });
      
        // Save state changes and implement the trick
        checkbox.addEventListener('change', function(event) {
            if (checkbox.checked) {
                // If checking the box, allow it and reset attempts
                attempts = 0;
                message.textContent = '';
                message.style.display = 'none';  // Hide the message
                chrome.storage.sync.set({redirectEnabled: true});
                chrome.runtime.sendMessage({action: "toggleRedirect", enabled: true});
                updateToggleLabel(true);
            } else {
                // If unchecking, implement the trick
                event.preventDefault(); // Prevent unchecking
                attempts++;
                
                if (attempts < 5) {
                    checkbox.checked = true; // Keep it checked
                    message.textContent = `${uncheckGiveUpMessages[attempts-1]} (${5-attempts} rocks left)`;
                    message.style.display = 'block';  // Show the message
                } else {
                    // Third attempt
                    message.textContent = "Redirection disabled. Don't stay there too long.";
                    message.style.display = 'block';  // Show the message
                    checkbox.checked = false;
                    chrome.storage.sync.set({redirectEnabled: false});
                    chrome.runtime.sendMessage({action: "toggleRedirect", enabled: false});
                    updateToggleLabel(false);
                }
            }
        });
    });