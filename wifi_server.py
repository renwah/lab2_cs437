import socket
import time
import json
from picarx import Picarx

HOST = "192.168.3.49"  # IP address of your Raspberry Pi
PORT = 65432           # Port to listen on (non-privileged ports are > 1023)
px = Picarx()

# Simulate data (speed, distance, direction)
def generate_sensor_data():
    # Generate some dummy data for testing
    return {
        "speed": "Need to Fix.",  
        "distance": px.ultrasonic.read(),
    }

# Function to control PiCar-X movement
def control_car(command):
    if command == "87":  # 'w' - Move forward
        px.forward(50)  # Adjust speed as needed
        time.sleep(1)  # Drive for 1 second
        px.stop()
    elif command == "83":  # 's' - Move backward
        px.backward(50)
        time.sleep(1)
        px.stop()
    elif command == "65":  # 'a' - Turn left
        px.set_dir_servo_angle(-30)
        time.sleep(1)
        px.set_dir_servo_angle(0)  # Reset steering
    elif command == "68":  # 'd' - Turn right
        px.set_dir_servo_angle(30)
        time.sleep(1)
        px.set_dir_servo_angle(0)  # Reset steering
    elif command == "STOP":  # Stop command
        px.stop()
    else:
        print("Unknown command received")

# Create and bind server
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()

    print(f"Server listening on {HOST}:{PORT}")
    while True:
        try:
            client, client_info = s.accept()
            print(f"Server connected to: {client_info}")
            data = client.recv(1024)
            if data:
                message = data.decode("utf-8").strip()
                print(f"Received from client: {message}")

                if message == "GET_SENSOR_DATA":
                # Send simulated sensor data as JSON
                    sensor_data = generate_sensor_data()
                    client.sendall(json.dumps(sensor_data).encode())  # Send back JSON-encoded data
                elif message in ["87", "83", "65", "68", "STOP"]:  # Only valid movement commands
                    control_car(message)  # Move the PiCar-X
                else:
                    print(message)  # Ignore random messages
            else:
                print(f"Connection lost with {client_info}")
                break  # Exit loop on disconnect
        except Exception as e:
            print(f"An error occurred: {e}")
            break  # Exit the server loop if there is any exception
    s.close()
    print("Server shutting down.")
