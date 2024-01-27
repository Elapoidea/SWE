import json
import datetime as dt
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from numpy import sin

with open("fake.json") as f:
    data = json.load(f)

x = [
    dt.datetime.strptime(d, "%d/%m/%y").date()
    for d in data["sensor_datas"].keys()
]

y = [
    data[x]["bpm"] for x in x
]

# dates = ["01/02/1991", "01/03/1991", "01/04/1991"]
# x = [dt.datetime.strptime(d, "%m/%d/%Y").date() for d in dates]
# y = range(len(x))  # many thanks to Kyss Tao for setting me straight here

plt.gca().xaxis.set_major_formatter(mdates.DateFormatter("%m/%d/%Y"))
plt.gca().xaxis.set_major_locator(mdates.DayLocator())
plt.plot(x, y)
plt.gcf().autofmt_xdate()

plt.show()
