"use client";
import * as React from "react";
import { useState, useMemo } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl/maplibre";
import CITIES from "./cities.json";
import Pin from "./pin";
import { DeckGL } from "@deck.gl/react";

const MAP_STYLE =
  // "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export default function HtmlMap() {
  const [popupInfo, setPopupInfo] = useState(null);

  const pins = useMemo(
    () =>
      CITIES.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <>
      <DeckGL controller={true}>
        <Map
          initialViewState={{
            latitude: 40,
            longitude: -100,
            zoom: 3.5,
            bearing: 0,
            pitch: 0,
          }}
          mapStyle={MAP_STYLE}
        >
          {/* <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl /> */}

          {pins}

          {popupInfo && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.longitude)}
              latitude={Number(popupInfo.latitude)}
              onClose={() => setPopupInfo(null)}
            >
              <div>
                {popupInfo.city}, {popupInfo.state} |{" "}
                <a
                  target="_new"
                  href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.city}, ${popupInfo.state}`}
                >
                  Wikipedia
                </a>
              </div>
              <img width="100%" src={popupInfo.image} />
            </Popup>
          )}
        </Map>
      </DeckGL>
    </>
  );
}
