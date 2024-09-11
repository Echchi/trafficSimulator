import React, { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import { cls } from "../utils/cls";
import { AnimatePresence, motion } from "framer-motion";

type IPosition = { lat: number; lng: number; direction: number; id: number };

interface IMenu {
  positions: IPosition[];
  setPositions: React.Dispatch<React.SetStateAction<IPosition[]>>;
}
const Menu = ({ positions, setPositions }: IMenu) => {
  const [parsedData, setParsedData] = useState<any[]>([]);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (!isAnimating && isPaused && currentFrame === 0) {
      updateFramePosition();
    }
  }, [currentFrame, isAnimating, isPaused]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAnimating && !isPaused && parsedData.length > 0) {
      interval = setInterval(() => {
        console.log("currentFrame", currentFrame);
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
    if (parsedData.length === 0) {
      alert("파일을 선택해주세요");
      return;
    }
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

  const updateFramePosition = () => {
    const frameTime = Number(startTime) + Number(currentFrame);
    setCurrentTime(frameTime);
    const frames = parsedData.filter((data) => Number(data.time) === frameTime);

    if (frames && frames.length > 0) {
      const updatedPositions = frames.map((frame) => ({
        lat: parseFloat(frame.y),
        lng: parseFloat(frame.x),
        direction: parseFloat(frame.direction),
        id: frame.VehID,
      }));

      setPositions(updatedPositions);
    }
  };

  const handleClickStartFrame = () => {
    setCurrentFrame(0);
    setTimeout(() => {
      updateFramePosition();
    }, 0);
  };
  const handleClickNextFrame = () => {
    if (!isPaused) return;
    const nextFrame = currentFrame + 1;
    setCurrentFrame(nextFrame);
    updateFramePosition();
  };
  const handleClickPrevFrame = () => {
    if (!isPaused || currentFrame <= 0) return;
    const prevFrame = currentFrame - 1;
    setCurrentFrame(prevFrame);
    updateFramePosition();
  };
  return (
    <div className="w-full h-12 z-10 flex px-5 py-2 bg-white/50 relative">
      <AnimatePresence mode="popLayout">
        {parsedData.length === 0 && (
          <motion.div
            id={`alarm`}
            key={`alarm`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-xl fixed left-1/2 top-20 py-5 px-14 rounded-lg flex items-center justify-center"
          >
            <div>파일을 선택해주세요</div>
          </motion.div>
        )}
      </AnimatePresence>

      <FileUpload parsedData={parsedData} setParsedData={setParsedData} />
      <div className="flex space-x-4">
        <button
          className=" bg-white px-3 py-1 rounded-lg shadow-xl hover:shadow *:fill-blue-600 *:disabled:fill-gray-500 disabled:bg-gray-200 disabled:shadow-none"
          onClick={handleClickStartFrame}
          disabled={parsedData.length === 0 || isAnimating}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="size-6"
          >
            <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
          </svg>
        </button>
        <button
          className=" bg-white px-3 py-1 rounded-lg shadow-xl hover:shadow *:fill-blue-600 *:disabled:fill-gray-500 disabled:bg-gray-200 disabled:shadow-none"
          onClick={startAnimation}
          disabled={parsedData.length === 0 || isAnimating}
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
          className={cls(
            "px-3 py-1 rounded-lg shadow-xl hover:shadow *:fill-blue-600 *:disabled:fill-gray-500 disabled:bg-gray-200 disabled:shadow-none ml-2",
            isPaused
              ? "bg-blue-200 shadow-none hover:shadow-none"
              : "bg-white shadow-xl hover:shadow",
          )}
          onClick={pauseAnimation}
          disabled={!isAnimating && !isPaused}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            className="size-6"
          >
            <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z" />
          </svg>
        </button>
        <div className="flex">
          <button
            className=" bg-white px-3 py-1 rounded-lg shadow-xl hover:shadow *:fill-blue-600 *:disabled:fill-gray-500 disabled:bg-gray-200 disabled:shadow-none ml-2"
            onClick={handleClickPrevFrame}
            disabled={parsedData.length === 0 || !isPaused}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className="size-6"
            >
              <path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-320c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241 64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-145 11.5 9.6 192 160z" />
            </svg>
          </button>
          <button
            className=" bg-white px-3 py-1 rounded-lg shadow-xl hover:shadow *:fill-blue-600 *:disabled:fill-gray-500 disabled:bg-gray-200 disabled:shadow-none ml-2"
            onClick={handleClickNextFrame}
            disabled={parsedData.length === 0 || !isPaused}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className="size-6"
            >
              <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241l0-145c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-145-11.5 9.6-192 160z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="ml-auto text-lg">
        <p>
          현재 시간<span className="font-semibold"> {currentTime}</span>
        </p>
      </div>
    </div>
  );
};

export default Menu;
