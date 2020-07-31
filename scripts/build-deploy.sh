root_dir=$(dirname "$0")/..
cd $root_dir

# make sure to first run 'docker-compose up build'

if [ -z "$(ls - server/dist)" ]; then
   echo "Empty"
fi


