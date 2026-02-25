
const Headline = ({ alertMessage }: { alertMessage: string }) => {

  return (
    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
        ⚠️ High Alert!
      </p>
      <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
        {alertMessage}
      </p>
    </div>
  );
};

export default Headline;