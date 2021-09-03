# Planager

## Installation

1. Clone and download this repository. Create a new python virtual environment in the top-level directory: ```python -m venv .venv```. This makes development and managing dependencies MUCH easier; I always recommend working within virtual environments for Python development. To activate your environment, run the activation script: ```source .venv/bin/activate```.
2. Inside your environment, run ```pip install -r requirements.txt``` to install the python requirements.
3. In ```app/static```, run ```npm install``` to install frontend requirements from package.json. This will create ```package-lock.json``` and the ```node_modules``` directory, which are both included in the ```.gitignore```.
4. That's it!

## Run

1. To start the flask server, run ```python app/webapp.py```.
2. To start frontend server: navigate to ```app/static``` and run ```npm run watch```.

## Development

1. Create a virtual environment if you haven't already! I like to name mine ```.venv```. It is included in the ```.gitignore``` because any developer can recreate it on their machine. IDEs such as VScode can automatically source the python interpreter from your virtual environment. I had installed the most up-to-date version of Python in mine at time of writing, which was 3.9.6.
2. To record any additional Python libraries that you may have installed, run ```pip freeze > requirements.txt``` to update the requirements file. Ensure you are working within your virtual environment, otherwise this command with include all of the packages installed globally on your system!
