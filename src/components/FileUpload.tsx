import React, { useEffect, useState } from "react";
import { parseCSV } from "../utils/parseCSV";
interface IFileUpload {
  parsedData: any[];
  setParsedData: React.Dispatch<React.SetStateAction<any[]>>;
}
export default function FileUpload({ parsedData, setParsedData }: IFileUpload) {
  useEffect(() => {
    console.log("parsedData", parsedData);
  }, [parsedData]);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target?.result as string;
      const parsed = parseCSV(content);
      setParsedData(parsed);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="file"
      />
    </div>
  );
}
