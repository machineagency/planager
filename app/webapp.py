# Entry point for the application.
from app import app  # For application discovery by the 'flask' command.
from app import routes  # For import side-effects of setting up routes.
from app import socketio
