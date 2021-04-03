import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectratio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem: any, data: any) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: true,
        },
        ticks: {
          callback: function (value: any, index: any, values: any) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineChart({ casesType = "cases", days = 60 }) {
  const [data, setData] = useState({});
  const [color, setColor] = useState("rgba(204, 16, 52, 0.5)");

  const createChartData = (data: any, stype = "cases") => {
    const chartData: any = [];
    let lastPoint: any;
    Object.keys(data[stype]).forEach((date: any) => {
      if (lastPoint) {
        const newDataPoint = {
          x: date,
          y: data[stype][date] - lastPoint,
        };
        chartData.push(newDataPoint);
      }
      lastPoint = data[stype][date];
    });

    if (stype === "recovered") {
      setColor("rgb(11, 145, 0, 0.5)");
    } else if (stype === "deaths") {
      setColor("rgb(38, 37, 37, 0.5)");
    } else {
      setColor("rgba(204, 16, 52, 0.5)");
    }

    return chartData;
  };

  useEffect(() => {
    const fetchedData = async () => {
      axios
        .get("https://disease.sh/v3/covid-19/historical/all?lastdays=" + days)
        .then((data) => {
          const chartData = createChartData(data.data, casesType);
          setData(chartData);
        });
    };

    fetchedData();
  }, [casesType]);

  return (
    <div>
      {Object.keys(data).length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                data: data,
                backgroundColor: color,
                borderColor: "CC1034",
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineChart;
