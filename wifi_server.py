import socket
import time
import json

HOST = "192.168.3.49"  # IP address of your Raspberry Pi
PORT = 65432           # Port to listen on (non-privileged ports are > 1023)

# Simulate data (speed, distance, direction)
def generate_sensor_data():
    # Generate some dummy data for testing
    return {
        "speed": round(50 + (time.time() % 10), 2),  # Speed will vary between 50 and 60
        "distance": round(100 + (time.time() % 20), 2),  # Distance will vary between 100 and 120
        "direction": "North" if int(time.time()) % 2 == 0 else "South"  # Alternate between North and South
    }

# Create and bind server
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()

    print(f"Server listening on {HOST}:{PORT}")
    while True:
        try:
            client, client_info = s.accept()
            print(f"Server connected to: {client_info}")
            with client:
                while True:
                    data = client.recv(1024)
                    if data:
                        message = data.decode("utf-8").strip()
                        print(f"Received from client: {message}")

                        if message == "GET_SENSOR_DATA":
                            # Send simulated sensor data as JSON
                            sensor_data = generate_sensor_data()
                            client.sendall(json.dumps(sensor_data).encode())  # Send back JSON-encoded data
                        else:
                            # Echo other messages back to the client
                            client.sendall(data)
                    else:
                        print(f"Connection lost with {client_info}")
                        break  # Break out of the inner loop if connection is lost
        except Exception as e:
            print(f"An error occurred: {e}")
            break  # Exit the server loop if there is any exception
    print("Server shutting down.")