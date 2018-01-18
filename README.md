# ar-content-anchoring

## Starting the client

To start the client, create any simple HTTP server from `client/` directory:

E.g. with Node:

```
# install once
npm install -g http-server

# from root of repo
http-server
```

E.g. with Python:

```
python -m SimpleHTTPServer 8080
```

Then open [localhost:8080/client/index.html](http://localhost:8080/client/index.html) in a browser

## Starting the service

First, install Node dependancies:

```
cd crawl-AR/
npm install
```

Then start service:

```
npm start
```
