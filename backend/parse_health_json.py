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
    date: date
    concern: str


@dataclass
class HealthData:
    sensor_datas: list[SensorData]
    health_concerns: list[HealthConcern]

    @staticmethod
    def make_from_json(file_path: str) -> "HealthData":
        # For expected format, refer to json_example.jsonc
        with open(file_path) as f:
            data = json.load(f)

            sensor_datas = []
            for date_str, datas in data["sensor_datas"].items():
                sensor_date = datetime.strptime(date_str, "%d/%m/%y").date()

                s = SensorData(*datas.values())
                sensor_datas.append(s)

            health_concerns = []
            for date_str, concern in data["health_concerns"].items():
                concern_date = datetime.strptime(date_str, "%d/%m/%y").date()

                hc = HealthConcern(concern_date, concern)
                health_concerns.append(hc)

            return HealthData(sensor_datas, health_concerns)


def main():
    hd = HealthData.make_from_json("./json_example.json")
    print(hd)


if __name__ == "__main__":
    main()
