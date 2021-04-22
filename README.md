# Lucky Block Website

![build](https://github.com/alexsocha/luckyblock-website/workflows/build/badge.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

The official website and documentation of the [Lucky Block](https://github.com/alexsocha/luckyblock) mod for Minecraft, live at [luckyblockmod.com](https://www.luckyblockmod.com). Built with:

-   [Handlebars](https://handlebarsjs.com/) templates on the client build, docs build, and server-side rendering.
-   [Docsify](https://github.com/docsifyjs/docsify) for rendering the docs pages.
-   [Express](https://github.com/expressjs/express) on the backend.
-   [NGINX](https://www.nginx.com/) as a reverse proxy and webserver.
-   [PM2](https://github.com/Unitech/pm2) for running the app in a cluster, load balancing, and 0 downtime deploys.

## Development

Install dependencies:

```
npm install
```

You can concurrently watch the server/client/docs on `localhost:8080` with:

```
npm run watch
```

## Deploy

**Initial**

Start by building the app:

```
./build.sh
```

Upload the files in `./dist` to a server.

Replace the webserver service in `docker-compose.prod.yaml` with the non-https one in `docker-compose.yaml`, then generate an SSL certificate with:

```
docker-compose --file docker-compose.prod.yaml up webserver certbot
```

Note that you can detach from the container with `ctrl-z`. Revert `docker-compose.prod.yaml`, and
start the https server with:

```
docker-compose down
docker-compose up webserver
```

Finally, use `crontab -e` to schedule a task which renews the certificate every 4 days, by
appending:

```
0 0 */4 * * ~/luckyblock-website/scripts/ssl_renew.sh >> /var/log/cron.log 2>&1
```

**Updates**

Build the app as above, then run:

```
./scripts/deploy.sh
```
