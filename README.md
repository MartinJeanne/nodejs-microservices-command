# Run mongdb
docker run -d --name mongo-produit -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=martin -e MONGO_INITDB_ROOT_PASSWORD=martin mongo