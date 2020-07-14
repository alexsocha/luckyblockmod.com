root_dir=$(dirname "$0")/..

rsync -ai --filter=':- .gitignore' --exclude '.git' $root_dir root@luckyblockmod.com:~/luckyblock-website

ssh root@luckyblockmod.com "cd luckyblock-website && docker-compose up --force-recreate app webserver certbot"
