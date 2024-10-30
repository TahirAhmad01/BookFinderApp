import React from "react";

function GenreSkeleton({ width }) {
  const widths = ["w-16", "w-20", "w-24", "w-28", "w-36"];
  const selectedWidth =
    width || widths[Math.floor(Math.random() * widths.length)];

  return (
    <div className="animate-pulse flex items-center gap-4 pb-3">
      <div className="h-6 w-6 bg-gray-400 dark:bg-gray-600 rounded-md"></div>
      <div
        className={`h-3 ${selectedWidth} bg-gray-400 dark:bg-gray-600 rounded-md`}
      ></div>
    </div>
  );
}

export default GenreSkeleton;
