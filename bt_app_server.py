from bluedot.btcomm import BluetoothServer
from signal import pause
from picarx import Picarx

px = Picarx()

def data_received(data):

    px.forward(10)
    print(f"Received: {data}")
    s.send(data)

s = BluetoothServer(data_received)
pause()