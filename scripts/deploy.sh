root_dir=$(dirname "$0")/..
cd $root_dir

# make sure to first run build.sh first

if [ -z "$(ls/dist)" ]; then exit 1; fi

rsync -aiR ./dist root@luckyblockmod.com:~/luckyblock-website

ssh root@luckyblockmod.com "cd luckyblock-website && docker exec -t app npx pm2 reload app"
