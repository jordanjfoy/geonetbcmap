import MapContext from '../../context/MapContext';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { applyStyle } from 'ol-mapbox-style';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { XYZ } from 'ol/source';
import LayerGroup from 'ol/layer/Group';

function createBCVectorLayer() {
  const layer = new VectorTileLayer({
    visible: false,
    properties: { name: 'BC Vector' },
    source: new VectorTileSource({
      format: new MVT(),
      url: 'https://tiles.arcgis.com/tiles/ubm4tcTYICKBpist/arcgis/rest/services/BC_BASEMAP_20240307/VectorTileServer/tile/{z}/{y}/{x}.pbf'
    })
  });

  // ✅ Apply style immediately
  applyStyle(
    layer,
    "https://www.arcgis.com/sharing/rest/content/items/b1624fea73bd46c681fab55be53d96ae/resources/styles/root.json"
  ).catch(err => console.error(err));

  return layer;
}


export default function BaseLayersComponent(): LayerGroup {
    const baseLayers = new LayerGroup({
      layers: [
        new TileLayer({
          source: new OSM(),
          visible: true, // ✅ default base layer
          properties: { name: 'OSM' }
        }),

        createBCVectorLayer(),

        new TileLayer({
          visible: false,
          properties: { name: 'Imagery' },
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maxZoom: 19
          })
        })
        
      ]
      
    })
    return baseLayers;
    

}


