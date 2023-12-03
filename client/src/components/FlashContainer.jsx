import { useEffect, useState } from "react";

const FlashContainer = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    // Cleanup function to clear the timer if the component is unmounted before 1500ms
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${
        isVisible ? "block" : "hidden"
      } fixed left-[15%] top-3 z-50 w-[70%] rounded bg-[#d1d1d1] px-2 py-4 text-center text-sm text-red-600 shadow-md transition-transform duration-300 ease-out sm:text-base`}
      role="alert"
    >
      <p className="font-bold">{message}</p>
    </div>
  );
};

export default FlashContainer;
