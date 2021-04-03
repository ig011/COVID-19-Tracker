import { LatLng, LatLngLiteral, LatLngTuple } from "leaflet";
import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { showDataOnMap } from "../../utilities/util";
import { Circle, Popup, CircleMarker } from "react-leaflet";
import "./MapStats.css";
import { useState, useEffect } from "react";

function MapStats(props: any) {
  const [height, SetHeight] = useState(200);

  const updateDimensions = () => {
    const height = window.innerWidth >= 992 ? window.innerHeight - 250 : 485;
    SetHeight(height);
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return window.removeEventListener("resize", updateDimensions);
  }, []);

  if (Object.keys(props.countries).length > 2) {
    return (
      <div className="MapStats" style={{ height: height }}>
        <MapContainer center={props.center} zoom={props.zoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {showDataOnMap(props.countries, props.casesType)}
        </MapContainer>
      </div>
    );
  } else {
    return (
      <div className="MapStats">
        <h3>Loading map...</h3>
      </div>
    );
  }
}

export default MapStats;
