const chatbox = document.getElementById("chatbox");

function sendMessage() {
    const userInput = document.getElementById("userInput").value;

    // user message ko display karta
    displayMessage("User: " + userInput, "user");

    //AI response ko stimulate karta
    let aiResponse = getAIResponse(userInput);
    displayMessage("AI: " + aiResponse, "ai");

    // clrscr
    document.getElementById("userInput").value = "";
}

function displayMessage(message, sender) {
    let messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageElement.classList.add(sender);
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;  //battom pe auto scroll hota
}

function getAIResponse(userInput) {
    // Basic AI logic medical assisstance ke vaste
    if (userInput.toLowerCase().includes("headache")) {
        return "It seems like you have a headache. Drink plenty of water and rest. If the pain persists, consult a doctor.";
    } else if (userInput.toLowerCase().includes("fever")) {
        return "If you're experiencing a fever, monitor your temperature and stay hydrated. If it exceeds 102°F, seek medical advice.";
    } else {
        return "I’m sorry, I’m unable to understand. Please provide more details.";
    }
}

// tablet scan ki shuwaat
function simulateTabletScan() {
    const resultElement = document.getElementById('resultMessage');
    
    // list tablets ki
    const tabletData = {
        "paracetamol": "Paracetamol is used to treat mild to moderate pain and fever.",
    };
    
    // scanning[lyt hai kuuch bhi dedeta]
    const randomTablet = Object.keys(tabletData)[Math.floor(Math.random() * Object.keys(tabletData).length)];
    const resultMessage = tabletData[randomTablet];
    
    // Update result s
    resultElement.textContent = `AI has detected: ${randomTablet.toUpperCase()}. ${resultMessage}`;
}

//image upload karke hold karna
function processTabletImage() {
    const resultElement = document.getElementById('resultMessage');
    resultElement.textContent = "Image uploaded! Click 'Simulate AI Scan' to analyze.";
}

// khareeb ke hptls and user ki exact location
function findHospitals() {
    if (navigator.geolocation) {
        // user ki current location nakalre
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('hospitalList').innerHTML = 'Geolocation is not supported by this browser.';
    }
}

// Function hsptls fetch karne aut location hold karne
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    //local API ko request bhejna
    fetch('http://localhost:3000/api/hospitals?lat=' + latitude + '&lng=' + longitude)
        .then(response => response.json())
        .then(data => {
            //API response se data use karo
            displayHospitals(data.results);
        })
        .catch(error => {
            console.error('Error fetching hospitals:', error);
            document.getElementById('hospitalList').innerHTML = 'Error fetching hospitals: ' + error.message;
        });
}

// Function hsptl page pe display karne
function displayHospitals(hospitals) {
    const hospitalListDiv = document.getElementById('hospitalList');
    hospitalListDiv.innerHTML = ''; //clrscrr

    if (hospitals.length === 0) {
        hospitalListDiv.innerHTML = '<p>No nearby hospitals found.</p>';
        return;
    }

    hospitals.forEach(hospital => {
        const hospitalDiv = document.createElement('div');
        hospitalDiv.classList.add('hospital');
        hospitalDiv.innerHTML = `
            <h3>${hospital.name}</h3>
            <p>Rating: ${hospital.rating || 'N/A'}</p>
            <p>${hospital.vicinity}</p>
        `;
        hospitalListDiv.appendChild(hospitalDiv);
    });
}

// Function  geolocation errors handle karne
function showError(error) {
    const hospitalListDiv = document.getElementById('hospitalList');
    switch (error.code) {
        case error.PERMISSION_DENIED:
            hospitalListDiv.innerHTML = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            hospitalListDiv.innerHTML = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            hospitalListDiv.innerHTML = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            hospitalListDiv.innerHTML = 'An unknown error occurred.';
            break;
    }
}

// button click event listner ke vaste
document.querySelector('button').addEventListener('click', findHospitals);
