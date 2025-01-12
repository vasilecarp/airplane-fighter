import PropTypes from "prop-types";

// Component for rendering the airplane as an SVG
const Airplane = () => (
  <svg viewBox="0 0 16 16" className="w-full h-full">
    {/* Center line of the airplane */}
    <rect x="7" y="0" width="2" height="16" fill="#4FB8E3" />

    {/* Main body of the airplane */}
    <rect x="6" y="2" width="4" height="12" fill="#4FB8E3" />
    <rect x="5" y="3" width="6" height="10" fill="#4FB8E3" />
    <rect x="4" y="4" width="8" height="8" fill="#4FB8E3" />

    {/* Wings */}
    <rect x="2" y="6" width="12" height="4" fill="#4FB8E3" />

    <rect x="1" y="7" width="14" height="2" fill="#4FB8E3" />
    <rect x="0" y="8" width="16" height="1" fill="#4FB8E3" />

    {/* Orange accents */}
    <rect x="3" y="9" width="2" height="1" fill="#FFA500" />
    <rect x="11" y="9" width="2" height="1" fill="#FFA500" />
    <rect x="4" y="10" width="1" height="1" fill="#FFA500" />
    <rect x="11" y="10" width="1" height="1" fill="#FFA500" />

    {/* Red accents */}
    <rect x="3" y="10" width="1" height="1" fill="#FF0000" />
    <rect x="12" y="10" width="1" height="1" fill="#FF0000" />
    <rect x="4" y="11" width="1" height="1" fill="#FF0000" />
    <rect x="11" y="11" width="1" height="1" fill="#FF0000" />
  </svg>
);

// Define the PropTypes for the Airplane component
Airplane.propTypes = {
  color: PropTypes.string,
};

// Default props for the Airplane component
Airplane.defaultProps = {
  color: "#3B82F6",
};

export default Airplane;
