// Auth Logic for Kairo

const Auth = {
    // Send OTP via Backend
    sendOTP: async (email) => {
        if (!email) {
            alert("Please enter a valid email address.");
            return null;
        }

        try {
            const response = await fetch(window.API_CONFIG.ENDPOINTS.SEND_OTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store OTP in localStorage for verification
                const pendingAuth = {
                    email: email,
                    otp: data.otp, // In a production app, verify on server!
                    timestamp: Date.now()
                };
                localStorage.setItem('pendingAuth', JSON.stringify(pendingAuth));
                return true;
            } else {
                alert("Failed to send OTP: " + data.message);
                return false;
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Could not connect to the server. Please check your internet connection or try again later.");
            return false;
        }
    },

    // Verify OTP and Create Account (Signup)
    verifyAndSignup: (enteredOtp) => {
        const pendingAuthString = localStorage.getItem('pendingAuth');
        if (!pendingAuthString) {
            alert("No pending signup found. Please try again.");
            return false;
        }

        const pendingAuth = JSON.parse(pendingAuthString);

        if (enteredOtp === pendingAuth.otp) {
            // Success! Create user record
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Check if user already exists
            if (users.find(u => u.email === pendingAuth.email)) {
                alert("User already exists! Please login.");
                return true; // Treat as success to redirect
            }

            users.push({
                email: pendingAuth.email,
                joined: new Date().toISOString()
            });

            localStorage.setItem('users', JSON.stringify(users));
            localStorage.removeItem('pendingAuth'); // Clear pending
            return true;
        } else {
            alert("Invalid OTP. Please try again.");
            return false;
        }
    },

    // Initiate Login (Check User + Send OTP)
    loginInitiate: async (email) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);

        if (!user) {
            alert("User not found. Please sign up first.");
            return false;
        }

        // User exists, send OTP
        return await Auth.sendOTP(email);
    },

    // Verify Login OTP
    loginVerify: (enteredOtp) => {
        const pendingAuthString = localStorage.getItem('pendingAuth');
        if (!pendingAuthString) {
            alert("Session expired. Please try again.");
            return false;
        }

        const pendingAuth = JSON.parse(pendingAuthString);

        if (enteredOtp === pendingAuth.otp) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', pendingAuth.email);
            localStorage.removeItem('pendingAuth');
            return true;
        } else {
            alert("Invalid OTP. Please try again.");
            return false;
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },

    // Check Auth Status
    checkAuth: () => {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
        }
    }
};