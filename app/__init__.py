import redis
import os
import fnmatch
import inspect

from flask import Flask
from flask_session import Session
from importlib import import_module

from .planager.packages.axidraw.axidraw_blueprint import axidraw_blueprint
from .planager.packages.math.math_blueprint import math_blueprint
from .planager.packages.paml.paml_blueprint import paml_blueprint

from .planager.workflow.Action import Action

app = Flask(__name__, template_folder="static")

# Register the blueprints for different actions
# The url prefix allows for easier management of routes and prevents
# routes from different actionsets from overriding eachother
# TODO: package importing and blueprint registration should be dynamic
app.register_blueprint(axidraw_blueprint, url_prefix="/axidraw")
app.register_blueprint(math_blueprint, url_prefix="/math")
app.register_blueprint(paml_blueprint, url_prefix="/paml")


# Create a tree of planager packages and blocks
blocks = []
package_dir = "./app/planager/packages"

# Use os to walk the packages directory
for root, directories, files in os.walk(package_dir, topdown=True):
    for file in files:
        # Look for all the python files
        if fnmatch.fnmatch(file, '*.py'):
            full_path = os.path.normpath(os.path.join(root,file))
            module_filename, _ = os.path.splitext(os.path.split(full_path)[1])
            # Remove any __init__.py files
            if module_filename == "__init__":
                continue
            
            # Create the module path by replacing slashes with periods
            module_path = os.path.splitext(full_path)[0].replace("\\", ".")
            module = import_module(module_path)

            # Build the list of blocks
            try:
                # Get the members of the module
                for name, obj in inspect.getmembers(module):
                    # Check if the member is a class
                    if inspect.isclass(obj):
                        # Check if it is a subclass of Action
                        if issubclass(obj, Action):
                            # Append to the blocks list
                            blocks.append(module_filename)
            except:
                continue


# NOTE: The secret key is used to cryptographically sign the cookies used for storing
#       the session identifier.
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
redis_url = os.getenv("REDISTOGO_URL", "redis://localhost:6379")

# Configure Redis for storing the session data on the server-side
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_REDIS"] = redis.from_url(redis_url)

# Create and initialize the Flask-Session object. Flask-Session is a flask
# extension that adds support for server-side sessions, rather than Flask's
# default client-side sessions. Don't ever access the Session object
# directly; just use the built in Flask session interface.
app.config["SESSION_COOKIE_SECURE"] = True
server_session = Session(app)
