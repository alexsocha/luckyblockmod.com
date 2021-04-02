root_dir=$(dirname "$0")/..
cd $root_dir

# make sure to first run build.sh

if [ -z "$(ls ./dist)" ]; then exit 1; fi

rsync -ai ./dist/ root@luckyblockmod.com:~/luckyblock-website

ssh root@luckyblockmod.com "cd luckyblock-website && docker exec -t --workdir /app app npm run reload-cluster"
