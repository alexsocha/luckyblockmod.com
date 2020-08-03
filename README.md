# Lucky Block Website

![build](https://github.com/alexsocha/luckyblock-website/workflows/build/badge.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

The official website and documentation of the [Lucky Block](https://github.com/alexsocha/luckyblock) mod for Minecraft, live at [luckyblockmod.com](https://www.luckyblockmod.com). Built with:

- [Handlebars](https://handlebarsjs.com/) templates on the client build, docs build, and server-side rendering.
- [Docsify](https://github.com/docsifyjs/docsify) for rendering the docs pages.
- [Express](https://github.com/expressjs/express) on the backend.
- [NGINX](https://www.nginx.com/) as a reverse proxy and webserver.
- [PM2](https://github.com/Unitech/pm2) for running the app in a cluster, load balancing, and 0 downtime deploys.

## Development

After an initial
```
npm install
```

you can concurrently watch the server/client/docs on `localhost:8080` with
```
npm run watch
```

To run the complete webserver on `localhost:80`, use
```
docker-compose up build
docker-compose up app webserver-http
```

## Deploy

**Initial**

After building the app with
```
docker-compose up build
```

upload the relevant files (see `scripts/deploy.sh`) to a webserver. On the server, run
```
docker-compose up app webserver-http certbot
```

to obtain an SSL certificate, followed by 
```
docker-compose down
docker-compose up app webserver
```

**Updates**

Build the app as before, and simply run 
```
./scripts/deploy.sh
```
