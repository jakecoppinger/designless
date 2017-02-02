# Designless
Jake Coppinger, 2015

# Please note:
Front end URL routing doesn't work with a standard Python or Apache server. You will be able to navigate to the /create page but with a reload you will get a 404. The server needs to be specially configured to send all requests to the index.html page, where the JavaScript will route it.

To see a demo of this in action, see designless.io

## Building from source
Designless is also hosted at Designless.io, however this will be updated.
To run a pre-build local version, spin up a web server from the dist/ directory. For example,
`python -m SimpleHTTPServer`
will start a web server on http://localhost:8000.

To build on Ubuntu/Debian:

- Install Node and NPM package manager. Instructions at https://nodejs.org/en/ and https://docs.npmjs.com/cli/install

- Install Bower, a front end package manager

	```npm install -g bower```

- Install bower dependencies and then npm dependencies. This will take a while, possibly over 10 minutes.

	```
	bower install
	npm install
	```

- Build SemanticUI (the front end framework).

	```
	cd semantic
	gulp build
	cd ..
	```

- Build departing.io with Gulp in project root directory:

	```
	gulp build
	```
	
- Spin up live reloading server

	```
	gulp serve
	```