## Starting the client

To start a client, create any simple HTTP server from any sample client within this `client/` directory:

E.g. with Node:

```
# install once
npm install -g http-server
http-server
```

E.g. with Python:

```
python -m SimpleHTTPServer 8080
```

Then open [localhost:8080/client/index.html](http://localhost:8080/client/index.html) in a browser.

Tip: you can use [https://localtunnel.me](https://localtunnel.me) and its CLI `lt` (installed with `npm install -g localtunnel`) to make it easier to test from mobile device.
