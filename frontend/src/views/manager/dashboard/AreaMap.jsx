import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// Mock data — replace with your API later
const households = [
  {
    id: 1,
    household: "Apt 12B",
    residents: 4,
    vehicles: 2,
    status: "Tạm trú",
    position: [10.7765, 106.7009] // VN coords example
  },
  {
    id: 2,
    household: "Apt 4A",
    residents: 3,
    vehicles: 1,
    status: "Bình thường",
    position: [10.7772, 106.7013]
  },
  {
    id: 3,
    household: "Apt 20C",
    residents: 2,
    vehicles: 0,
    status: "Tạm vắng",
    position: [10.7769, 106.6998]
  }
];

export default function AreaMap() {
  return (
    <Card sx={{ height: "100%", boxShadow: 2, borderRadius: 2 }}>
      <CardContent sx={{ height: 500 }}>
        <Typography variant="h6" gutterBottom>
          Bản đồ khu vực
        </Typography>

        <MapContainer
          center={[10.7765, 106.7009]}
          zoom={17}
          style={{ width: "100%", height: "430px", borderRadius: 8 }}
        >
          <TileLayer
            attribution='© OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {households.map((h) => (
            <Marker key={h.id} position={h.position}>
              <Popup>
                <Typography variant="subtitle1" fontWeight="bold">
                  {h.household}
                </Typography>

                <Typography variant="body2">
                  👥 Cư dân: {h.residents}
                </Typography>

                <Typography variant="body2">
                  🚗 Phương tiện: {h.vehicles}
                </Typography>

                <Typography variant="body2">
                  📌 Trạng thái:{" "}
                  <span
                    style={{
                      color:
                        h.status === "Tạm trú"
                          ? "#EF6C00"
                          : h.status === "Tạm vắng"
                          ? "#C62828"
                          : "#2E7D32"
                    }}
                  >
                    {h.status}
                  </span>
                </Typography>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}