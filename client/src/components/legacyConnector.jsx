import { GrMapLocation } from "react-icons/gr";

const LegacyApp = () => {
  const navigateToLatest = () => {
    window.location.href = "https://client-side-deployment.vercel.app/"; // URL of Project 2
  };

  return (
    <div className="flex" style={{ marginLeft: "10px" }}>
      <GrMapLocation />
      <button
        style={{ marginLeft: "10px", fontWeight: "1px" }}
        onClick={navigateToLatest}
      >
        Maps Filter
      </button>
    </div>
  );
};

export default LegacyApp;
