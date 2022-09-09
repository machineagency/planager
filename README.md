# Building Dynamic Toolchains with the Planager

Welcome to the Planager, a system for building dynamic toolchains!

## Installation

1. Clone and download this repository. Create a new python virtual environment
   in the top-level directory: `python -m venv .venv`. This makes development
   and managing dependencies MUCH easier; I always recommend working within
   virtual environments for Python development. To activate your environment,
   run the activation script: `source .venv/bin/activate`.
2. Inside your environment, run `pip install -r requirements.txt` to install the
   python requirements.
3. Run `npm install` to install frontend requirements from `package.json`. This
   will create `package-lock.json` and the `node_modules` directory, which are
   both included in the `.gitignore`.
4. That's it!

## Running locally

1. To start the flask server, run `python server.py`.
2. To start the frontend, run `npm run start`.
3. Navigate to `localhost:8000` in your browser. It should open automatically.

## Development

During development, I switch between platforms frequently (mainly Ubuntu and
Windows). This allows me to make sure that everything is working as it should
across different operating systems, so you can be reasonably optimistic that
Planager will run on whatever you're running. VSCode helps immensely with this,
as it automatically saves your workspace configuration and extensions. You are
of course free to choose any development environment you wish.

Here is a quick overview of the main technologies used to build Planager:

- Backend:
  - Python/Flask
  - Flask SocketIO
- Frontend:
  - Javascript
  - Lit for creating web components
  - npm for managing dependencies
- Local Development:
  - VSCode
  - web dev server
- Deployment:
  - ~~Heroku for hosting~~ Figuring out an alternative because Heroku is dying.
  - Cloudflare for DNS management

### Virtual Environments

I highly recommend creating a virtual environment if you haven't already! I like
to name mine `.venv`, which is included in the `.gitignore` because any
developer can recreate it on their machine. IDEs such as VScode can
automatically source the python interpreter from your virtual environment.

### Managing dependencies

To record any additional Python libraries that you may have installed, run
`pip freeze > requirements.txt` to update the requirements file. Ensure you are
working within your virtual environment, otherwise this command with include all
of the packages installed globally on your system!

Node modules are stored in the `/node_modules` directory, which is created when
you run `npm install`. To install a new node module, run
`npm install modulename --save`. The `--save` flag will save the module as a
production dependency, and `--save-dev` will save it as a development
dependency.


### Debugging

Everyone has their preferences when it comes to IDEs and debuggers, but I find
VSCode to work well for me. I included a `launch.json` configuration in `.vscode/`.
The compound rule `full stack` will run both the frontend and backend
configurations! One thing to note is that the python configuration has to be run
with the GEVENT_SUPPORT flag set to true, or else some crucial Flask things will
not work.
