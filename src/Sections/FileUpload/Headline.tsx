
const Headline = ({ alertMessage }: { alertMessage: string }) => {

  return (
    <div className="p-3 bg-[#047ADB]/10 dark:bg-[#047ADB]/20 border border-[#047ADB]/20 dark:border-[#047ADB]/40 rounded-lg">
      <p className="text-sm font-semibold text-[#047ADB] dark:text-white">
        ⓘ &nbsp; Information
      </p>
      <p className="text-xs text-[#047ADB] dark:text-white mt-1">
        {alertMessage}
      </p>
    </div>
  );
};

export default Headline;