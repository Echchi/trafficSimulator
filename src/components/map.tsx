import React, { useEffect, useState } from "react";
import MapContext from "./MapContext";
const Map = (
  {
    center,
    level,
    className,

    children,
    maxLevel,
    onCreate,
  }: any,
  ref: any,
) => {
  const kakao = (window as any).kakao;
  const [map, setMap] = useState<any | null>(null);

  useEffect(() => {
    if (map) return;
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level: level,
      maxLevel: maxLevel,
    };
    const newMap = new kakao.maps.Map(container!!, options);
    setMap(newMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map && onCreate) {
      onCreate(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, center]);

  return (
    <>
      <MapContext.Provider value={map}>
        <div id="map" className={className}>
          {children}
        </div>
      </MapContext.Provider>
    </>
  );
};

export default Map;
