# Contributing

## Project layout

    src/
    planager/
    app/
    docs/ # Documentation website things
    mkdocs.yml    # Documentation config

## VSCode

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
configurations! One thing to note is that the Python configuration has to be run
with the GEVENT_SUPPORT flag set to true, or else some crucial Flask things will
not work.

## Development

Run the frontend server using web-dev server. An introduction guide is found
[here](https://modern-web.dev/guides/dev-server/getting-started/).

## Editing Documentation

We use [mkdocs](https://www.mkdocs.org/) to generate documentation for the
Planager.

- `mkdocs new [dir-name]` - Create a new project.
- `mkdocs serve` - Start the live-reloading docs server.
- `mkdocs build` - Build the documentation site.
- `mkdocs -h` - Print help message and exit.

To deploy to the Github Pages site: `mkdocs gh-deploy`.

!!! note You must be on the main branch to deploy to github pages.

## Web Component Analyzer

See the
[web-component-analyzer](https://runem.github.io/web-component-analyzer/)
package.
