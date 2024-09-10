import React, { useCallback, useEffect, useState } from "react";
import MapContext from "./MapContext";
const Map = (
  {
    center,
    level,
    className,
    onZoomChanged,
    onDragEnd,
    children,
    maxLevel,
    onCreate,
  }: any,
  ref: any,
) => {
  const kakao = (window as any).kakao;
  const [map, setMap] = useState<any | null>(null);
  // const handleZoomChanged = useCallback(() => {
  //   if (map) onZoomChanged(map);
  // }, [map, onZoomChanged]);
  //
  // const handleDragEnd = useCallback(() => {
  //   if (map) onDragEnd(map);
  // }, [map, onDragEnd]);

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

  // useEffect(() => {
  //   if (map) {
  //     map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
  //     kakao.maps.event.addListener(map, "dragend", handleDragEnd);
  //     return () => {
  //       kakao.maps.event.removeListener(map, "dragend", handleDragEnd);
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [map, center]);

  // useEffect(() => {
  //   if (map) {
  //     map.setLevel(level);
  //     kakao.maps.event.addListener(map, "zoom_changed", handleZoomChanged);
  //     return () => {
  //       kakao.maps.event.removeListener(map, "zoom_changed", handleZoomChanged);
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [map, level]);

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
