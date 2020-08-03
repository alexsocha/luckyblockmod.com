root_dir=$(dirname "$0")/..
cd $root_dir

# make sure to first run 'docker-compose up build'

if [ -z "$(ls server/dist)" ]; then exit 1; fi
if [ -z "$(ls client/dist)" ]; then exit 1; fi
if [ -z "$(ls docs/dist)" ]; then exit 1; fi

rsync -aiR \
    ./docs/dist \
    ./client/dist \
    ./server/dist \
    ./server/nginx-conf \
    ./server/dhparam \
    ./server/package.json \
    ./server/package.json \
    ./server/package-lock.json \
    ./scripts/ssl_renew.sh \
    ./package.json \
    ./docker-compose.yaml \
    ./Dockerfile \
    root@luckyblockmod.com:~/luckyblock-website

ssh root@luckyblockmod.com "cd luckyblock-website && docker exec -t app npx pm2 reload app"
