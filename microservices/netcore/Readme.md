



docker build -t net-test .

docker run -d --name netContainer -p 9114:9114 net-test

docker tag net-test:latest 654592696339.dkr.ecr.ap-southeast-1.amazonaws.com/net-test:latest
docker push 654592696339.dkr.ecr.ap-southeast-1.amazonaws.com/net-test:latest
