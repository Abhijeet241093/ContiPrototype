aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 238454137191.dkr.ecr.ap-northeast-2.amazonaws.com
docker build -t nodejs-test .
docker tag nodejs-test:latest 238454137191.dkr.ecr.ap-northeast-2.amazonaws.com/nodejs-test:latest
docker push 238454137191.dkr.ecr.ap-northeast-2.amazonaws.com/nodejs-test:latest
