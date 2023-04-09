aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 842803216398.dkr.ecr.ap-northeast-1.amazonaws.com

docker build -t ndx-app-store .
docker tag ndx-app-store:latest 842803216398.dkr.ecr.ap-northeast-1.amazonaws.com/ndx-app-store:latest
docker push 842803216398.dkr.ecr.ap-northeast-1.amazonaws.com/ndx-app-store:latest
