export function parseCSV(csv: string) {
  const rows = csv.split("\n");

  // 헤더를 제외하고 본문 데이터만 처리
  const result = rows
    .slice(1)
    .map((row) => {
      if (!row || row.trim() === "") return null;

      const columns = row.split(/\s+/); // 공백을 기준으로 분리

      if (columns.length >= 7) {
        // console.log("columns", columns);
        return {
          time: columns[1] ? columns[1].trim() : null,
          VehID: columns[2] ? columns[2].trim() : null,
          direction: columns[3] ? columns[3].trim() : null,
          x: columns[4] ? columns[4].trim() : null,
          y: columns[5] ? columns[5].trim() : null,
          speed: columns[6] ? columns[6].trim() : null,
          mode: columns[7] ? columns[7].trim() : null,
        };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return result;
}
