
        // DOM elements
        const passwordField = document.getElementById('password-field');
        const copyBtn = document.getElementById('copy-btn');
        const tooltip = document.getElementById('tooltip');
        const tooltipText = document.getElementById('tooltip-text');
        const strengthFill = document.getElementById('strength-fill');
        const strengthLabel = document.getElementById('strength-label');
        const lengthSlider = document.getElementById('length-slider');
        const lengthValue = document.getElementById('length-value');
        const uppercaseCheckbox = document.getElementById('uppercase');
        const lowercaseCheckbox = document.getElementById('lowercase');
        const numbersCheckbox = document.getElementById('numbers');
        const symbolsCheckbox = document.getElementById('symbols');
        const generateBtn = document.getElementById('generate-btn');
        const resetBtn = document.getElementById('reset-btn');
        const clearHistoryBtn = document.getElementById('clear-history-btn');
        const historyList = document.getElementById('history-list');
        
        // Character sets
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        // Password history
        let passwordHistory = [];
        
        // Event listeners
        copyBtn.addEventListener('click', copyPassword);
        lengthSlider.addEventListener('input', updateLengthValue);
        generateBtn.addEventListener('click', generatePassword);
        resetBtn.addEventListener('click', resetOptions);
        clearHistoryBtn.addEventListener('click', clearHistory);
        
        // Initialize
        updateLengthValue();
        generatePassword();
        
        // Functions
        function updateLengthValue() {
            lengthValue.textContent = lengthSlider.value;
        }
        
        function generatePassword() {
            let charset = '';
            let password = '';
            
            // Build character set based on options
            if (uppercaseCheckbox.checked) charset += uppercaseChars;
            if (lowercaseCheckbox.checked) charset += lowercaseChars;
            if (numbersCheckbox.checked) charset += numberChars;
            if (symbolsCheckbox.checked) charset += symbolChars;
            
            // Check if at least one character set is selected
            if (charset.length === 0) {
                alert('Please select at least one character type for your password.');
                return;
            }
            
            // Generate password
            const length = parseInt(lengthSlider.value);
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            
            // Display password
            passwordField.value = password;
            
            // Calculate and display strength
            updatePasswordStrength(password);
            
            // Add to history
            addToHistory(password);
        }
        
        function updatePasswordStrength(password) {
            let strength = 0;
            
            // Length factor
            if (password.length >= 8) strength += 1;
            if (password.length >= 12) strength += 1;
            if (password.length >= 16) strength += 1;
            
            // Character variety factor
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[a-z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 2;
            
            // Update strength meter
            let strengthPercent = 0;
            let strengthText = '';
            
            if (strength <= 2) {
                strengthPercent = 25;
                strengthText = 'Very Weak';
                strengthFill.style.backgroundColor = '#e74c3c';
            } else if (strength <= 4) {
                strengthPercent = 50;
                strengthText = 'Weak';
                strengthFill.style.backgroundColor = '#f39c12';
            } else if (strength <= 6) {
                strengthPercent = 75;
                strengthText = 'Good';
                strengthFill.style.backgroundColor = '#3498db';
            } else {
                strengthPercent = 100;
                strengthText = 'Strong';
                strengthFill.style.backgroundColor = '#2ecc71';
            }
            
            strengthFill.style.width = `${strengthPercent}%`;
            strengthLabel.textContent = `Password strength: ${strengthText}`;
        }
        
        function copyPassword() {
            if (!passwordField.value) return;
            
            // Copy to clipboard
            navigator.clipboard.writeText(passwordField.value)
                .then(() => {
                    // Show tooltip
                    tooltipText.textContent = 'Copied!';
                    tooltip.classList.add('show');
                    
                    // Hide tooltip after 2 seconds
                    setTimeout(() => {
                        tooltip.classList.remove('show');
                        setTimeout(() => {
                            tooltipText.textContent = 'Copy to clipboard';
                        }, 300);
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy password to clipboard.');
                });
        }
        
        function addToHistory(password) {
            // Add to beginning of history array
            passwordHistory.unshift(password);
            
            // Limit history to 5 items
            if (passwordHistory.length > 5) {
                passwordHistory.pop();
            }
            
            // Update history display
            updateHistoryDisplay();
        }
        
        function updateHistoryDisplay() {
            // Clear current history
            historyList.innerHTML = '';
            
            // Add each password to history
            passwordHistory.forEach((password, index) => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const passwordSpan = document.createElement('span');
                passwordSpan.className = 'history-password';
                passwordSpan.textContent = password;
                
                const copyButton = document.createElement('button');
                copyButton.className = 'history-copy';
                copyButton.innerHTML = '<i class="far fa-copy"></i>';
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(password)
                        .then(() => {
                            copyButton.innerHTML = '<i class="fas fa-check"></i>';
                            setTimeout(() => {
                                copyButton.innerHTML = '<i class="far fa-copy"></i>';
                            }, 2000);
                        });
                });
                
                historyItem.appendChild(passwordSpan);
                historyItem.appendChild(copyButton);
                historyList.appendChild(historyItem);
            });
            
            // Show message if history is empty
            if (passwordHistory.length === 0) {
                historyList.innerHTML = '<div class="history-item">No passwords generated yet</div>';
            }
        }
        
        function resetOptions() {
            lengthSlider.value = 16;
            updateLengthValue();
            uppercaseCheckbox.checked = true;
            lowercaseCheckbox.checked = true;
            numbersCheckbox.checked = true;
            symbolsCheckbox.checked = false;
            generatePassword();
        }
        
        function clearHistory() {
            passwordHistory = [];
            updateHistoryDisplay();
        }
