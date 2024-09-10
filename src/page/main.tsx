import React, { useEffect, useState } from "react";
import Map from "../components/map";
import CustomOverlay from "../components/CustomOverlayMap";
import { ReactComponent as CarIcon } from "../assets/car.svg";
import FileUpload from "../components/FileUpload";

const Main = () => {
  const kakao = (window as any).kakao;
  const [map, setMap] = useState<any | null>(null);
  const [positions, setPositions] = useState<
    { lat: number; lng: number; direction: number; id: number }[]
  >([]);
  const [parsedData, setParsedData] = useState<any[]>([]);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  useEffect(() => {}, [startTime]);

  useEffect(() => {
    if (parsedData.length > 0) {
      setStartTime(parsedData[0].time);
    }
  }, [parsedData]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAnimating && !isPaused && parsedData.length > 0) {
      interval = setInterval(() => {
        const frameTime = Number(startTime) + Number(currentFrame);
        setCurrentTime(frameTime);
        const frames = parsedData.filter(
          (data) => Number(data.time) === frameTime,
        );

        if (frames && frames.length > 0) {
          const updatedPositions = frames.map((frame) => ({
            lat: parseFloat(frame.y),
            lng: parseFloat(frame.x),
            direction: parseFloat(frame.direction),
            id: frame.VehID,
          }));

          setPositions(updatedPositions);
          setCurrentFrame((prevFrame) => prevFrame + 1);
        } else {
          clearInterval(interval!);
          setIsAnimating(false);
        }
      }, 100);
    } else {
      clearInterval(interval!);
      setIsAnimating(false);
    }

    return () => clearInterval(interval!);
  }, [parsedData, isAnimating, currentFrame, startTime]);

  const startAnimation = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsPaused(false);
      if (currentFrame === 0) {
        setStartTime(parsedData[0].time || 0);
      }
    } else if (isPaused) {
      setIsPaused(false);
    }
  };
  const pauseAnimation = () => {
    setIsPaused(true);
  };

  return (
    <Map
      center={{ lat: 35.501606, lng: 129.30275 }}
      level={8}
      className="w-screen h-screen"
      onCreate={setMap}
      maxLevel={13}
    >
      <div className="fixed w-full h-12 z-10 flex px-5 py-2">
        <FileUpload parsedData={parsedData} setParsedData={setParsedData} />
        <button
          className=" bg-white px-3 py-1 rounded-lg shadow-xl hover:shadow *:fill-blue-600 *:disabled:fill-gray-500 disabled:bg-gray-200 disabled:shadow-none"
          onClick={startAnimation}
          disabled={isAnimating && !isPaused}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          className=" bg-white px-3 py-1 rounded-lg shadow-xl hover:shadow *:fill-blue-600 *:disabled:fill-gray-500 disabled:bg-gray-200 disabled:shadow-none ml-2"
          onClick={pauseAnimation}
          disabled={!isAnimating || isPaused}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            className="size-6"
          >
            <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z" />
          </svg>
        </button>
        <div className="ml-auto text-xl">
          <strong>현재 시간: {currentTime}</strong>
        </div>
      </div>
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
