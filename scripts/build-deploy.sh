root_dir=$(dirname "$0")/..
cd $root_dir

docker-compose up build

rsync -aiR \
    ./docs/dist \
    ./client/dist \
    ./server/dist \
    ./server/nginx-conf \
    ./server/dhparam \
    ./server/package.json \
    ./server/package.json \
    ./server/package-lock.json \
    ./package.json \
    ./docker-compose.yaml \
    ./Dockerfile \
    root@luckyblockmod.com:~/luckyblock-website

ssh root@luckyblockmod.com "cd luckyblock-website && docker exec -t app npx pm2 reload app"
