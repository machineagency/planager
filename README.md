# Planager

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

1. To start the flask server, run `python run.py`.
2. To run webpack and generate the `bundle.js`, run `npm run dev`. The bundle
   will automatically regenerate when changes are made to frontend files.

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
  - Redis
- Frontend:
  - Javascript
  - Webpack for bundling static files
  - Babel for transpiling JSX/SASS/CSS etc
  - React (JSX) for modularizing the interface
  - npm for managing dependencies
- Local Development:
  - VSCode
  - Redis via a docker image
- Deployment:
  - Heroku for hosting
  - The Heroku Redis addon for the deployed database
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

### Redis and Docker

Planager uses Redis to manage sessions. When doing development locally, you'll
need to run your own Redis instance. The easiest way to do this is via Docker,
where there's a Redis image that works out of the box.

### Debugging

Everyone has their preferences when it comes to IDEs and debuggers, but I find
VSCode to work well for me. I use the following `launch.json` configuration in
the VSCode debugger:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Current File",
      "type": "python",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal"
    },
    {
      "name": "gunicorn",
      "request": "launch",
      "command": "python -m gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 run:app",
      "type": "node-terminal"
    },
    {
      "command": "npm run watch",
      "name": "frontend",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "name": "python flask backend",
      "type": "python",
      "request": "launch",
      "program": "run.py",
      "gevent": true,
      "env": {
        "GEVENT_SUPPORT": "True"
      },
      "console": "integratedTerminal"
    }
  ],
  "compounds": [
    {
      "name": "full stack",
      "configurations": ["frontend", "python flask backend"]
    }
  ]
}
```

The compound rule `full stack` will run both the frontend and backend
configurations! One thing to note is that the python configuration has to be run
with the GEVENT_SUPPORT flag set to true, or else some crucial Flask things will
not work.

### Deployment Notes

The command to start the app once deployed on Heroku is contained in the
`Procfile`.

I have deployed this app on Heroku. There are a few gotchas: Ensure that the
appropriate buildpacks are added. Heroku will automatically detect and use the
python buildpack, but the nodejs buildpack needs to run first in order to call
"npm run build" (specified in the package.json postinstall script) and create
the bundle.js file. To push a build to Heroku, run `git push heroku main`. To
then open the app in browser, run `heroku open`.

I bought the domain `planager.xyz` through GoDaddy, and redirected it to use
Cloudflare's DNS servers. In Cloudflare I pointed any requests for
`planager.xyz` to the heroku app.
