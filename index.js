var server_port = 65432;
var server_addr = "192.168.1.130";   // the IP address of your Raspberry PI

function update_data() {
    setInterval(function () {
        // Create a new net connection to the server
        const net = require('net');
        const client = net.createConnection({ port: server_port, host: server_addr }, () => {
            console.log("Connected to Raspberry Pi");

            // Send GET_SENSOR_DATA message to request sensor data
            client.write("GET_SENSOR_DATA");  // Request sensor data from the Pi
        });

        // Handle response for sensor data
        client.on("data", (data) => {   
            try {
                // Parse sensor data if it comes in JSON format
                let sensorData = JSON.parse(data.toString());  // Convert JSON string to object

                document.getElementById("speed").innerText = sensorData.speed;
                document.getElementById("distance").innerText = sensorData.distance;
                document.getElementById("direction").innerText = sensorData.direction;

                console.log("Received data:", sensorData);
            } catch (error) {
                console.error("Error parsing data:", error);
            }
        });

        // Handle any errors in the socket connection
        client.on("error", (error) => {
            console.error("Connection error:", error);
        });

        // Close the client connection after the data is received
        client.on("end", () => {
            console.log("Disconnected from server");
        });
    }, 1000);  // Repeats every 1 seconds (for GET_SENSOR_DATA only)
}

// Function to send one-time data (either chat input or key press)
function send_data(input) {
    const net = require('net');

    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        console.log('connected to server!');
        client.write(`${input}\r\n`);  // Send the input (either key press or chat box input)
    });

    client.on('data', (data) => {
        document.getElementById("bluetooth").innerHTML = data;
        console.log(data.toString());
        client.end();
        client.destroy();
    });

    client.on('end', () => {
        console.log('disconnected from server');
    });

    client.on('error', (error) => {
        console.error("Connection error:", error);
    });
}

// Handle key press events (w, a, s, d)
document.addEventListener('keydown', (e) => {
    if (!e) return;

    switch (e.key.toLowerCase()) {
        case "w":
            document.getElementById("upArrow").style.color = "green";
            send_data("87");  // ASCII code for 'w'
            break;
        case "s":
            document.getElementById("downArrow").style.color = "green";
            send_data("83");  // ASCII code for 's'
            break;
        case "a":
            document.getElementById("leftArrow").style.color = "green";
            send_data("65");  // ASCII code for 'a'
            break;
        case "d":
            document.getElementById("rightArrow").style.color = "green";
            send_data("68");  // ASCII code for 'd'
            break;
    }
});

// Reset key colors on key up
document.addEventListener('keyup', (e) => {
    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
});

// Function to send the message when the "Submit" button is clicked
function update_message() {
    const input = document.getElementById("message").value;
    if (input) {
        send_data(input);  // Send the typed message when "Submit" is clicked
        document.getElementById("message").value = "";  // Clear the input after sending
    }
}

// Immediately call update_data() when the page loads
window.addEventListener("load", () => {
    update_data();// Call update_data immediately after the page loads
    // Add click event listeners for the arrow buttons
    document.getElementById("upArrow").addEventListener("click", () => {
        send_data("87");  // Send 'w' when up arrow is clicked
        document.getElementById("upArrow").style.color = "green";  // Highlight the button

        // Reset button color after a short delay (e.g., 300ms)
        setTimeout(() => {
            document.getElementById("upArrow").style.color = "grey";
        }, 300); // 300ms delay
    });

    document.getElementById("downArrow").addEventListener("click", () => {
        send_data("83");  // Send 's' when down arrow is clicked
        document.getElementById("downArrow").style.color = "green";  // Highlight the button

        // Reset button color after a short delay (e.g., 300ms)
        setTimeout(() => {
            document.getElementById("downArrow").style.color = "grey";
        }, 300); // 300ms delay
    });

    document.getElementById("leftArrow").addEventListener("click", () => {
        send_data("65");  // Send 'a' when left arrow is clicked
        document.getElementById("leftArrow").style.color = "green";  // Highlight the button

        // Reset button color after a short delay (e.g., 300ms)
        setTimeout(() => {
            document.getElementById("leftArrow").style.color = "grey";
        }, 300); // 300ms delay
    });

    document.getElementById("rightArrow").addEventListener("click", () => {
        send_data("68");  // Send 'd' when right arrow is clicked
        document.getElementById("rightArrow").style.color = "green";  // Highlight the button

        // Reset button color after a short delay (e.g., 300ms)
        setTimeout(() => {
            document.getElementById("rightArrow").style.color = "grey";
        }, 300); // 300ms delay
    });
});