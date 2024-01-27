from dataclasses import dataclass
import datetime
import json


@dataclass
class SensorData:
    bpm: int
    weight: int
    exercise_hours: int


@dataclass
class HealthConcerns:
    concerns: dict[datetime.datetime, str]

    def get_by_date(self, date: datetime.datetime) -> str:
        return self.concerns[date]


@dataclass
class HealthData:
    sensor_data: SensorData
    health_concerns: HealthConcerns


def read_health_from_json(file_path: str) -> HealthData:
    # For expected format, refer to json_example.jsonc
    with open(file_path) as f:
        data = json.load(f)

        s = SensorData(*tuple(data["sensor_data"]))
        print(s)
        return None


def main():
    pass


if __name__ == "__main__":
    main()
