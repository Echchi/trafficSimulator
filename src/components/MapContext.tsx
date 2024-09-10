import { createContext } from "react";

const MapContext = createContext<kakao.maps.Map | null>(null);

export default MapContext;
