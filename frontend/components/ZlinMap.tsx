"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { waterSources, zlínDistricts } from "@/lib/data";

// Fix for default marker icon in Next.js
const waterIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ZlinMapProps {
  onSelectSource?: (sourceId: string) => void;
  onSelectDistrict?: (districtId: string) => void;
  selectedSource?: string | null;
  selectedDistrict?: string | null;
}

export default function ZlinMap({
  onSelectSource,
  onSelectDistrict,
  selectedSource,
  selectedDistrict,
}: ZlinMapProps) {
  // Střed Zlína
  const zlinCenter: LatLngExpression = [49.2265, 17.6683];

  // Přibližné pozice městských částí
  const districtPositions: Record<string, LatLngExpression> = {
    "centrum": [49.2265, 17.6683],
    "jizni-svahy": [49.2150, 17.6750],
    "malenovice": [49.2100, 17.6200],
    "kudlov": [49.2400, 17.7000],
    "lesni-ctvrt": [49.2350, 17.6400],
    "louky": [49.2180, 17.6500],
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 92) return "#22c55e"; // fresh-500
    if (quality >= 85) return "#0ea5e9"; // water-500
    return "#eab308"; // yellow-500
  };

  return (
    <MapContainer
      center={zlinCenter}
      zoom={12}
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Úpravny vody */}
      {waterSources.map((source) => (
        <Marker
          key={source.id}
          position={[source.location.lat, source.location.lng]}
          icon={waterIcon}
          eventHandlers={{
            click: () => onSelectSource?.(source.id),
          }}
        >
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-base mb-1">{source.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{source.waterType}</p>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-500">Kvalita:</span>{" "}
                  <span className="font-semibold text-green-600">{source.quality}/100</span>
                </p>
                <p>
                  <span className="text-gray-500">Tvrdost:</span>{" "}
                  <span className="font-semibold">{source.hardness} °dH</span>
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Městské části jako kruhy */}
      {zlínDistricts.map((district) => {
        const position = districtPositions[district.id];
        if (!position) return null;

        return (
          <Circle
            key={district.id}
            center={position}
            radius={600}
            pathOptions={{
              color: selectedDistrict === district.id ? "#0369a1" : getQualityColor(district.quality),
              fillColor: getQualityColor(district.quality),
              fillOpacity: selectedDistrict === district.id ? 0.6 : 0.3,
              weight: selectedDistrict === district.id ? 3 : 2,
            }}
            eventHandlers={{
              click: () => onSelectDistrict?.(district.id),
            }}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-base mb-1">{district.name}</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-gray-500">Kvalita:</span>{" "}
                    <span className="font-semibold text-green-600">{district.quality}/100</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Tvrdost:</span>{" "}
                    <span className="font-semibold">{district.hardness} °dH</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Obyvatel:</span>{" "}
                    <span className="font-semibold">{district.population.toLocaleString("cs-CZ")}</span>
                  </p>
                </div>
              </div>
            </Popup>
          </Circle>
        );
      })}
    </MapContainer>
  );
}
