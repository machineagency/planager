from app import app, routes, sio

if __name__ == "__main__":
    sio.run(app, debug=True)
