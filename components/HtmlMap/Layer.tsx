import { GeoJsonLayer, PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";

type BlockProperties = {
  name: string;
  coordinates: [longitude: number, latitude: number];
};

export function MyCustomLayers(
  MY_CLEAN_SUBSTATIONS,
  MY_BUS_DATA,
  MY_LINES_DATA,
  MY_OFF_SHORE_DATA,
  id,
  selectedLineIds,
  handleLineClick
) {
  return [
    new GeoJsonLayer<BlockProperties>({
      id: `geojson${id}`,
      data: MY_CLEAN_SUBSTATIONS,
      opacity: 0.8,
      stroked: false,
      filled: true,
      pointType: "circle",
      wireframe: true,
      getPointRadius: 400,
      pointRadiusScale: 30,
      getFillColor: [79, 167, 70],
      pickable: true,
    }),
    new GeoJsonLayer<BlockProperties>({
      id: `Buses${id}`,
      data: MY_BUS_DATA,
      opacity: 1,
      stroked: false,
      filled: true,
      pointType: "circle",
      wireframe: true,
      getPointRadius: 400,
      pointRadiusScale: 100,
      getFillColor: [72, 123, 182],
      pickable: true,
    }),
    // new GeoJsonLayer<BlockProperties>({
    //   id: `Lines${id}`,
    //   data: MY_LINES_DATA,
    //   opacity: 0.8,
    //   stroked: true,
    //   filled: true,
    //   getLineWidth: 500,
    //   lineWidthScale: 20,
    //   getLineColor: [227, 26, 28],
    //   getFillColor: [227, 26, 28],
    //   pickable: true,
    //   autoHighlight: true,
    // }),
    new GeoJsonLayer({
      id: `Lines${id}`,
      data: MY_LINES_DATA,
      opacity: 0.8,
      stroked: true,
      filled: true,
      getLineWidth: (feature) => {
        const featureId = feature.properties.id;
        return selectedLineIds.includes(featureId) ? 1000 : 500;
      },
      lineWidthScale: 20,
      getLineColor: [227, 26, 28],
      getFillColor: [227, 26, 28],
      pickable: true,
      autoHighlight: true,
      onHover: () => {},
      onClick: (info, event) => {
        console.log("Clicked:", info, event);
        handleLineClick();
      },
    }),
    new GeoJsonLayer({
      id: `polygon-layer${id}`,
      data: MY_OFF_SHORE_DATA,
      stroked: true,
      opacity: 0.25,
      filled: true,
      extruded: false,
      wireframe: false,
      getElevation: 0,
      getLineColor: [225, 75, 75, 0.2],
      getFillColor: [225, 75, 75],
      dashArray: [10, 5],
      getLineWidth: 2,
      pickable: true,
    }),

    // new ScatterplotLayer<BlockProperties>({
    //   id: "ScatterplotLayer",
    //   // data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json",
    //   data,
    //   stroked: true,
    //   getPosition: (d) => {
    //     return d.coordinates;
    //   },
    //   getRadius: (d: BlockProperties) => Math.sqrt(49),
    //   getFillColor: [255, 140, 0],
    //   getLineColor: [0, 0, 0],
    //   getLineWidth: 10,
    //   radiusScale: 6,
    //   pickable: true,
    //   onDataLoad: (d) => {
    //     console.log(d);
    //   },
    // }),
  ];
}
