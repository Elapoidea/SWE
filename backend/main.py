#!/usr/bin/env python3

from click import DateTime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import requests
import openai
from starlette.requests import empty_receive
import uvicorn
from typing import List
import os

from parse_health_json import HealthData, SensorData, HealthConcern

##### Underlying JSON data helper functions

DB_FILE_NAME = 'data.json'

DEFAULT_FILE={
        "sensor_datas" : [],
        "health_concerns" : []
    }

def reset_json_db():
    # Reset JSON file to default
    json_file = open(DB_FILE_NAME, 'w')
    json_file.write(json.dumps(DEFAULT_FILE))
    json_file.close()

def read_db():
    try:
        with open(DB_FILE_NAME,"r") as f:
            # Check that file is valid json and contains the expected lists
            json_thing = json.load(f)
            if 'sensor_datas' not in json_thing:
                reset_json_db()
            elif 'health_concerns' not in json_thing:
                reset_json_db()
    except IOError:
        reset_json_db()

    # Load json file
    json_file = open(DB_FILE_NAME, 'r')
    healthdata = HealthData.make_from_json(json.load(json_file))
    json_file.close()
    return healthdata

def write_json():
    with open(DB_FILE_NAME, 'w') as f:
        json.dump(HEALTH_DATA, f)

##### FastAPI server setup
origins = [
    "http://api.arianb.me:8000",
    "*"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"Welcome to my silly little API"}

@app.get("/get_all_sensor_data")
async def get_all_sensor_data():
    data_json_str = json.dumps(HEALTH_DATA.sensor_datas)
    return data_json_str

@app.get("/get_all_health_concerns")
async def get_all_health_concerns():
    data_json_str = json.dumps(HEALTH_DATA.health_concerns)
    return data_json_str

@app.get("/summarize/")
async def get_summary(date_range: DateTime):
    # TODO: merge code here
    summary = "TODO: get via API"
    return  {
        "summary": summary
    }

@app.get("/removeNote/{date}")
async def remove_note(date: DateTime):
    status = HealthData.remove_note(date)
    return { "status": status }

if __name__ == '__main__':
    HEALTH_DATA = read_db()
    uvicorn.run(app, port=8000, host='0.0.0.0')
    print("test")

