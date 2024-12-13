import { GeoJsonLayer } from "@deck.gl/layers";

export type BlockProperties = {
  name: string;
  coordinates: [longitude: number, latitude: number];
};

type Props = {
  id: string;
  polygonData: string;
};

export function MyCustomLayers({ id, polygonData }: Props): GeoJsonLayer[] {
  const layers = [
    new GeoJsonLayer({
      id: `polygon-layer-${id}`,
      data: polygonData,
      stroked: true,
      opacity: 0.6,
      filled: true,
      extruded: false,
      wireframe: false,
      getElevation: () => 0,
      getLineColor: [255, 255, 255, 255],
      getFillColor: [220, 20, 60, 80],
      lineWidthMinPixels: 1,
      getLineWidth: () => 1,
      pickable: false,
      parameters: {
        depthTest: false,
        blend: true,
        blendFunc: [770, 771]
      },
      _dataDiff: () => [{
        startRow: 0,
        endRow: undefined
      }],
      autoHighlight: false,
      updateTriggers: {
        getFillColor: polygonData,
        getLineColor: polygonData,
        getPosition: polygonData
      },
      visible: true,
      extensions: [],
      beforeId: undefined
    })
  ];
  
  return layers;
}
