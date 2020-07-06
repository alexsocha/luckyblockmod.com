root_dir=$(dirname "$0")/..

rsync -ai --filter=':- .gitignore' --exclude '.git' $root_dir root@157.245.139.214:~/luckyblock-website

ssh root@157.245.139.214 "cd luckyblock-website && docker-compose up --force-recreate app webserver-local"
