import React from "react";
import { Circle, Popup, CircleMarker } from "react-leaflet";

const Colors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4442",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
};

export const numberToCommas = (value: { toString: () => string }) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const sortData = (data: any) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

const redOptions = { color: "red" };
const greenOptions = { color: "green" };
const blackOptions = { color: "black" };

const casesTypeColors = {
  cases: {
    color: redOptions,
    multiplier: 300,
  },
  recovered: {
    color: greenOptions,
    multiplier: 300,
  },
  deaths: {
    color: blackOptions,
    multiplier: 1000,
  },
};

export const showDataOnMap = (data: any[], casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      pathOptions={casesTypeColors[casesType].color}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <h3>Country: {country.country}</h3>
        Value of {casesType}:{" "}
        <strong>{numberToCommas(country[casesType])}</strong>
      </Popup>
    </Circle>
  ));
