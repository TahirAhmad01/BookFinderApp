const SkeletonCard = ({ disableWhitelistButton }) => {
  return (
    <div className="animate-pulse w-full border rounded-lg overflow-hidden flex flex-col justify-between p-2 shadow-sm">
      <div
        className={`flex w-full items-center gap-3 ${
          disableWhitelistButton ? "max-h[70px]" : "max-h-[270px]"
        }`}
      >
        <div className="w-56 h-56 bg-gray-400"></div>
        <div className="w-full">
          <div className="w-3/4 h-7 bg-gray-400 rounded-md mb-3"></div>
          <div className="flex flex-wrap mb-3 gap-2">
            <div className="w-1/2 h-4 bg-gray-400 rounded-md"></div>
            {!disableWhitelistButton && (
              <>
                <div className="w-1/3 h-4 bg-gray-400 rounded-md"></div>
                <div className="w-1/4 h-4 bg-gray-400 rounded-md"></div>
              </>
            )}
          </div>

          {!disableWhitelistButton && (
            <div className="w-10 h-10 rounded-md bg-gray-400"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
