from app.webapp import app, socketio

# from gevent import pywsgi
# from geventwebsocket.handler import WebSocketHandler

if __name__ == "__main__":
    # app.run()
    socketio.run(app)
    # We can't use the normal flask app.run() command to run this app because
    # the werkzeug environment doesn't support websockets/socket routes.
    # Therfore, we use this gunicorn worker that can serve the socket
    # routes alongside the HTTP routes

    # server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    # server.serve_forever()
