import LegacyApp from "./legacyConnector";
import "./styles.css";
export const MapFilterPage = () => {
  return (
    <>
      <div className="explore-text">Explore More with Dynamic Real Maps!</div>
      <div className="wavy-button">
        <LegacyApp />
      </div>
    </>
  );
};
