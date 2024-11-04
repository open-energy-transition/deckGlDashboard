import { GeoJsonLayer, PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";

export type BlockProperties = {
  name: string;
  coordinates: [longitude: number, latitude: number];
};

// data needed to prepare Geojson layer
type Props = {
  id: string;
  polygonData: string;
};

export function MyCustomLayers({ id, polygonData }: Props): GeoJsonLayer[] {
  const layers = [
    new GeoJsonLayer({
      id: `polygon-layer${id}`,
      data: polygonData,
      stroked: true,
      opacity: 0.25,
      filled: true,
      extruded: false,
      wireframe: false,
      getElevation: 0,
      getLineColor: [75, 75, 75],
      getFillColor: [225, 75, 75, 20],
      lineWidthMinPixels: 2,
      // lineWidthScale: 20,
      dashArray: [10, 5],
      getLineWidth: 10,
      pickable: true,
    }),
  ];
  return layers;
}
