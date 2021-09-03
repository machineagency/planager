# Planager Frontend

This is the directory where the Planaeger frontend code is stored. Ensure you have node installed and updated to the latest version. To install the required node modules and create package_lock.json, run ```npm install``` or ```npm i```.

There are two scripts included in the ```package.json```:

- ```npm run build``` runs webpack to bundle all of the static files into one file, ```dist/bundle.js```. This is included in the gitignore.
- ```npm run watch``` starts a server that automatically re-bundles the frontend code when changes are made. This is useful to run during development, as you will not need to constantly run the build command.

## Dependencies

Here I'll talk a bit about the bones of the frontend, as all the different web technologies can be confusing to get the hang of.

### Webpack

All you *really* need to know about webpack is that it takes all of the javascript and css files for the frontend and packs them all into one file, ```dist/bundle.js```. Then, instead of having to include every file individually in our HTML, we can include it all with one line! The webpack configuration file is found in ```webpack.config.js```. I tried to make it accessible and readable. Many of the example webpack config files are overwhelmingly long and include a lot of options that are unnecessary for smaller projects. I've added comments to try to explain what it is doing, as this helps me too.

### Babel

Babel is a *transpiler* that tells webpack how to condense different file types. At time of writing, I've included a babel-loader for JS/JSX files and one for CSS files.

### React

React is a great front-end library for breaking interface components up into manageable chunks. Most of the Planager interface is written in React. In order to familiarize yourself with React, I reccommend their comprehensive Tic-tac-toe tutorial:

The React documentation is also very clear and well-maintained.
