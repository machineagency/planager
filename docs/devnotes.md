# Development Notes

The end-to-end project has some mildy complex build tooling in order to support dynamic importing of tool modules. I was able to make this work largely in thanks to [Webpack](https://webpack.js.org).

## Dynamic imports

Building the project with dynamic imports is tricky. However, we got it working! Essentially, the problem is that we need to be able to build all of the individual tool module webcomponents, but we do not want to import them all at once. We want to be able to request them when they are needed. This means that we don't want any of the Planager frontend code to care at all about where the tools are coming from. However, we can't build a project this way: if you don't have actual import statements in your code, the modules you might want to import at runtime will not be built to be imported.

Enter _dynamic imports_. See [the webpack docs](https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import) for information on dynamic expressions in imports.
