import React from 'react';
import './Map.css'
import {MapContainer as LeafletMap ,TileLayer} from "react-leaflet";
import {showDataOnMap} from "./util";

function Map({countries,casesType,center,zoom}) {
    return (
        <div className ="map">
            <LeafletMap key={(center[0],zoom)}  center={center} zoom={zoom}>
              {console.log("zoom  ar center",zoom,center)}
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                  {showDataOnMap(countries, casesType)}
                {/*looping through the countries and drawing hotspts circles */}
            </LeafletMap>
        </div>
    );
}

export default Map;
