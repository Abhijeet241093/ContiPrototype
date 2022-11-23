python -m venv .env
.env\Scripts\activate


pip install pipreqs
pip3 freeze > requirements.txt 
pip install -r requirements.txt

docker build -t python-test .

docker run -d --name pythonContainer -p 9113:9113 python-test


docker tag python-test:latest 654592696339.dkr.ecr.ap-southeast-1.amazonaws.com/python-test:latest
docker push 654592696339.dkr.ecr.ap-southeast-1.amazonaws.com/python-test:latest


uvicorn app.main:app --port 9113 --reload