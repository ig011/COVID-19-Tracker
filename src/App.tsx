import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  ButtonGroup,
  Button,
} from "@material-ui/core";
import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import InfoCards from "./components/InfoCards/InfoCards";
import MapStats from "./components/MapStats/MapStats";
import DataTable from "./components/DataTable/DataTable";
import { sortData, numberToCommas } from "./utilities/util";
import LineChart from "./components/LineChart/LineChart";
import "leaflet/dist/leaflet.css";
import { Spring } from "react-spring/renderprops";

function App() {
  const [countries, setCountries] = useState(["None"]);
  const [days, setDays] = useState(60);
  const [casesType, setCasesType] = useState("cases");
  const [country, setCountry] = useState("Global");
  const [mapCenter, setMapCenter] = useState([1, 1]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState(["None"]);
  const [currentInfo, setCurrentInfo] = useState({
    data: {
      cases: 0,
      todayCases: 0,
      deaths: 0,
      todayDeaths: 0,
      recovered: 0,
      todayRecovered: 0,
      updated: 0,
      countryInfo: { lat: 0, long: 0 },
    },
  });
  const [tableData, setTableData] = useState([
    { cases: 0, country: "Loading" },
  ]);

  const handleCountryChange = async (event: any) => {
    const axios_url =
      event.target.value === "Global"
        ? "https://disease.sh/v3/covid-19/all"
        : "https://disease.sh/v3/covid-19/countries/" + event.target.value;
    await axios.get(axios_url).then((data) => {
      setCountry(event.target.value);
      setCurrentInfo(data);

      if ("countryInfo" in data.data) {
        setMapCenter([data.data.countryInfo.lat, data.data.countryInfo.long]);
      } else {
        setMapCenter([0, 0]);
      }
      setMapZoom(3);
    });
  };

  const convertToDate = (date_number: string | number | Date) => {
    const date = new Date(date_number);
    return date.toDateString();
  };

  useEffect(() => {
    setCountry("Global");
    axios.get("https://disease.sh/v3/covid-19/all").then((data) => {
      setCurrentInfo(data);
    });
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      const fetchedData = await axios.get(
        "https://disease.sh/v3/covid-19/countries"
      );

      const list_of_countries = fetchedData.data.map(
        (country: any) => country.country
      );

      const sortedData = sortData(fetchedData.data);
      setTableData(sortedData);
      setMapCountries(fetchedData.data);
      setCountries(list_of_countries);
    };

    getCountries();
  }, []);

  return (
    <Spring
      from={{ opacity: 0 }}
      to={{ opacity: 2 }}
      config={{ duration: 3000 }}
    >
      {(props) => (
        <div className="App" style={props}>
          <div className="App__header">
            <div>
              <h1>COVID-19 Tracker</h1>
              <strong>Last update:</strong>{" "}
              {convertToDate(currentInfo.data.updated)}
            </div>
            <div className="App__dropdown">
              <h3>Select country: </h3>
              <FormControl>
                <Select
                  variant="outlined"
                  onChange={handleCountryChange}
                  value={country}
                >
                  <MenuItem value="Global">Global</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="test">
            <div className="App__side_left">
              <div className="App__stats_header">
                <h2>Today's data</h2>
              </div>
              <div className="App__stats">
                <InfoCards
                  active={casesType === "cases"}
                  onClick={(e) => setCasesType("cases")}
                  title="Confirmed"
                  cases={currentInfo.data.todayCases}
                  total={currentInfo.data.cases}
                />
                <InfoCards
                  active={casesType === "recovered"}
                  onClick={(e) => setCasesType("recovered")}
                  title="Recovered"
                  cases={currentInfo.data.todayRecovered}
                  total={currentInfo.data.recovered}
                />
                <InfoCards
                  active={casesType === "deaths"}
                  onClick={(e) => setCasesType("deaths")}
                  title="Deaths"
                  cases={currentInfo.data.todayDeaths}
                  total={currentInfo.data.deaths}
                />
              </div>
              <div className="App__mapstats">
                <MapStats
                  countries={mapCountries}
                  casesType={casesType}
                  center={mapCenter}
                  zoom={mapZoom}
                />
              </div>
            </div>
            <div className="App__side_right">
              <Card className="App__side_right_card">
                <CardContent>
                  <h3>Live Cases by country</h3>
                  <DataTable data={tableData} />
                  <br />
                  <h3>Worldwide new {casesType} graph</h3>
                  <h5>(Last {days} days)</h5>
                  <br />
                  <LineChart casesType={casesType} days={days} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
}

export default App;
