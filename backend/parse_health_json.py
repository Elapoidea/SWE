from dataclasses import dataclass
from datetime import date, datetime
import json

@dataclass
class SensorData:
    bpm: int
    weight: int
    exercise_hours: int


@dataclass
class HealthConcern:
    concern: str


@dataclass
class HealthData:
    sensor_datas: dict[datetime, SensorData]
    health_concerns: dict[date, HealthConcern]

    @staticmethod
    def make_from_json(data: dict) -> "HealthData":
        # For expected format, refer to json_example.jsonc
        sensor_datas = []
        for date_str, sensor_data in data["sensor_datas"].items():
            sensor_date = datetime.strptime(date_str, "%d/%m/%y")

            sensor_datas[sensor_date, SensorData(sensor_data.value())]

        # health_concerns = []
        # for date_str, concern in data["health_concerns"].items():
        #     concern_date = datetime.strptime(date_str, "%d/%m/%y").date()
        #
        #     hc = HealthConcern(concern_date, concern)
        #     health_concerns.append(hc)
        #
        return HealthData(sensor_datas, health_concerns)

    # Accessors
    def get_sensor_data_range(self, start_date: datetime, end_date: datetime) -> dict:
        data_from_range = {}
        # TODO: get data within range
        return data_from_range


    # Remove methods
