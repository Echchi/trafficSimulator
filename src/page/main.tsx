import React, { useEffect, useState } from "react";
import Map from "../components/map";
import CustomOverlay from "../components/CustomOverlayMap";
import { ReactComponent as CarIcon } from "../assets/car.svg";
import FileUpload from "../components/FileUpload";
import { cls } from "../utils/cls";
import Menu from "../components/Menu";

const Main = () => {
  const kakao = (window as any).kakao;
  const [map, setMap] = useState<any | null>(null);
  const [positions, setPositions] = useState<
    { lat: number; lng: number; direction: number; id: number }[]
  >([]);

  return (
    <Map
      center={{ lat: 35.501606, lng: 129.30275 }}
      level={8}
      className="w-screen h-screen"
      onCreate={setMap}
      maxLevel={13}
    >
      <Menu positions={positions} setPositions={setPositions} />
      {positions.map((vehicle) => (
        <CustomOverlay
          key={vehicle.id}
          position={{ lat: vehicle.lat, lng: vehicle.lng }}
        >
          <CarIcon
            className="size-fit fill-blue-600"
            style={{
              transform: `rotate(${vehicle.direction}deg)`,
              transformOrigin: "center",
            }}
          />
        </CustomOverlay>
      ))}
    </Map>
  );
};

export default Main;
