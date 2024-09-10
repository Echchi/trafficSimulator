import React, {
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MapContext from "./MapContext";
import ReactDOM from "react-dom";

const CustomOverlay = ({ position, children }: any, ref: any) => {
  const kakao = (window as any).kakao;

  const [zoomLevel, setZoomLevel] = useState<number | null>(null);
  const overlayPosition = useMemo(() => {
    return new kakao.maps.LatLng(position.lat, position.lng);
  }, [position.lat, position.lng]);

  const container = useRef(document.createElement("div"));
  const map = useContext(MapContext);

  const overlay = useMemo(() => {
    const CustomOverlay = new kakao.maps.CustomOverlay({
      position: overlayPosition,
      content: container.current,
    });

    return CustomOverlay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, children]);

  useLayoutEffect(() => {
    if (!map) return;

    const handleZoomChange = () => {
      const currentZoom = map.getLevel();
      setZoomLevel(currentZoom);
    };

    kakao.maps.event.addListener(map, "zoom_changed", handleZoomChange);

    return () => {
      kakao.maps.event.removeListener(map, "zoom_changed", handleZoomChange);
    };
  }, [map]);

  useLayoutEffect(() => {
    if (!map) return;

    overlay.setMap(map);
    return () => {
      overlay.setMap(null);
    };
  }, [map, overlay]);
  const svgSize = zoomLevel ? Math.max(10, 40 - zoomLevel * 5) : 20;
  return (
    container.current.parentElement &&
    ReactDOM.createPortal(
      <div style={{ width: svgSize, height: svgSize }}>{children}</div>,
      container.current.parentElement,
    )
    // ReactDOM.createPortal(children, container.current.parentElement)
  );
};

export default CustomOverlay;
