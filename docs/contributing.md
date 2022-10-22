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
      "name": "python",
      "request": "launch",
      "type": "python",
      "program": "server.py"
    },
    {
      "name": "javascript",
      "request": "launch",
      "type": "node-terminal",
      "command": "npm run dev"
    }
  ],
  "compounds": [
    {
      "name": "full stack",
      "configurations": ["python", "javascript"]
    }
  ]
}
```

The compound rule `full stack` will run both the frontend and backend
configurations!

## Development

Run the frontend server using webpack dev server.

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
