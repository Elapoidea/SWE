#!/usr/bin/env python3

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import uvicorn
from typing import List
import os
from datetime import date, datetime

##### Underlying JSON data helper functions

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
    healthdata = json.load(json_file)
    json_file.close()
    return healthdata

def write_json():
    with open(DB_FILE_NAME, 'w') as f:
        json.dump(HEALTH_DATA, f)

def date_str_to_date_obj(date_str: str) -> date:
    return datetime.strptime(date_str, "%d/%m/%y")

def get_db_sensor_data() -> dict:
    return HEALTH_DATA["sensor_datas"]

def get_db_health_concerns() -> dict:
    return HEALTH_DATA["health_concerns"]

# helper methods for writing data
def add_db_concern(date_str: str, concern: str):
    HEALTH_DATA["health_concerns"][date_str] = concern
    write_json()
    return 0

def remove_db_concern(date_str: str):
    del HEALTH_DATA["health_concerns"][date_str]
    write_json()
    return 0

def add_db_sensor_data(date_str: str, data: dict):
    HEALTH_DATA["sensor_datas"][date_str] = data
    write_json()
    return 0

def remove_db_sensor_data(date_str: str):
    del HEALTH_DATA["sensor_datas"][date_str]
    write_json()
    return 0


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
    return get_db_sensor_data()

@app.get("/get_all_health_concerns")
async def get_all_health_concerns():
    return get_db_health_concerns()

# TODO: WIP add 2 paramas (start/end date)
@app.get("/summarize")
async def get_summary():
    # TODO: merge code here
    summary = "TODO: get via openai API"
    return  {
        "summary": summary
    }

@app.get("/add_concern")
async def add_concern(date_str: str, concern: str):
    date_str = date_str.replace("-", "/")
    status = add_db_concern(date_str, concern)
    return { "status": status }

@app.post("/remove_concern/{date_str}")
async def remove_concern(date_str: str):
    date_str = date_str.replace("-", "/")
    status = remove_db_concern(date_str)
    return { "status": status }

app.mount("/", StaticFiles(directory="../frontend"), name="static")

DB_FILE_NAME = 'data.json'

DEFAULT_FILE={
        "sensor_datas" : [],
        "health_concerns" : []
    }

HEALTH_DATA = read_db()
