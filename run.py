from app import app, sio, routes

if __name__ == "__main__":
    sio.run(app, debug=True, use_reloader=True)
