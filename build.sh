rm -rf ./dist
mkdir dist
mkdir dist/server dist/client dist/docs dist/scripts

docker build -t luckyblock-website-build --target build .
container_id=$(docker create luckyblock-website-build)

docker cp $container_id:/app/server/dist ./dist/server/dist
docker cp $container_id:/app/server/node_modules ./dist/server/node_modules
docker cp $container_id:/app/client/dist ./dist/client/dist
docker cp $container_id:/app/docs/dist ./dist/docs/dist

docker rm -v $container_id

cp ./docker-compose.prod.yaml dist/docker-compose.yaml
cp ./package.json dist/
cp ./scripts/ssl_renew.sh dist/scripts/
cp -r ./server/dhparam dist/server/
cp -r ./server/nginx-conf dist/server/

echo "Copied all resources to ./dist"
