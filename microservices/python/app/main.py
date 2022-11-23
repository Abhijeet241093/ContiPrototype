
from typing import Any, Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import requests
from dotenv import load_dotenv
import uvicorn
import os
from pathlib import Path
import json
from .services.s3services  import create_presigned_url
from .intrusionDetection import dectect

dotenv_path = Path('../config/config.env')
load_dotenv(dotenv_path=dotenv_path)
app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(os.getenv('AWS_ACCESS_ID'))


class ResponseData():
    def __init__(self, isSuccessful, data, message):
        self.isSuccessful = isSuccessful
        self.data = data
        self.message = message


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/healthcheck")
def healthcheck():
    result = ResponseData(True, {"result": "ok"}, "test")
    return result


@app.post("/detect")
def detect(key: str):
    url = create_presigned_url(key)
    if url is not None:
        response = requests.get(url)
    result = dectect(response)
    return ResponseData(True, result, "test")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=9113)
