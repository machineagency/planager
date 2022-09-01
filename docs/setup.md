## Install dependencies

### Set up the virtual environment:

1. Install pip for python3: `sudo apt install python3-pip`
2. Install venv for python3.10 if needed: `sudo apt install python3.10-venv`
3. Create virtual environment: `python3-m venv .venv`
4. In VSCodium, close and reopen your terminal. The environment should be selected by default.
5. Install requirements via pip: `pip install -r requirements.txt`

### Frontend dependencies

#### Install nvm and node
I recommend using [`nvm`](https://github.com/nvm-sh/nvm) to manage node versions. `nvm` allows you to install and maintain many different independent versions of Node.js and their associated packages. If you're on Windows, you can use `nvm-windows` instead. This is optional; you can use whatever node installation method you'd like, but `nvm` has worked for me.

At time of writing, we are using `node` version 16.x and `npm` version 8.x. These can be seen in `package.json` section `engine`. Install node 16: `nvm install 16`, and select it for use: `npm use 16`. Ensure that you're running the right version: `node -v` should return `v16.x.x`. Similarly, `npm --version` should return `v8.x.x`.

#### Install npm packages

From the top-level directory, run `npm install`.


## Set up VSCodium

### Extensions

#### Recommended extensions

- Python
- Prettier
- Lit-plugin

#### Optional extensions, good for development

- Markdown All in One

## Run

I have created launch configurations for VSCode, found in `.vscode/launch.json`. In VSCodium they should be detected automatically.