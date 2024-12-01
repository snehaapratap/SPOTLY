import  { useState } from "react";
import axios from "axios";

const CityHotelSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchHotels = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "https://tripadvisor-com1.p.rapidapi.com/hotels/search",
        {
          params: {
            geoId: "60763", // Note: In a real implementation, you'd first need to get the geoId for the searched city
            query: searchTerm,
          },
          headers: {
            "x-rapidapi-key":
              "27d3276526msh16b981be8d4e029p1fd91bjsn63d725281e6e",
            "x-rapidapi-host": "tripadvisor-com1.p.rapidapi.com",
          },
        }
      );

      if (response.data && response.data.data) {
        setHotels(response.data.data);
      } else {
        setError("No hotels found for this location");
      }
    } catch (error) {
      setError("Error fetching hotels. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchHotels();
  };

  return (
    <div style={styles.container}>
      {/* Search Section */}
      <div style={styles.searchSection}>
        <h1 style={styles.title}>Find Hotels in Your City</h1>
        <form onSubmit={handleSubmit} style={styles.searchForm}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter city name..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton} disabled={loading}>
            {loading ? "Searching..." : "Search Hotels"}
          </button>
        </form>
        {error && <div style={styles.error}>{error}</div>}
      </div>

      {/* Results Section */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>Searching for hotels...</p>
        </div>
      ) : (
        <div style={styles.resultsContainer}>
          {hotels.length > 0 && (
            <h2 style={styles.resultsTitle}>Hotels found in {searchTerm}</h2>
          )}
          <div style={styles.hotelGrid}>
            {hotels.map((hotel) => (
              <div key={hotel.location_id} style={styles.hotelCard}>
                <div style={styles.imageContainer}>
                  <img
                    src={
                      hotel.photo?.images?.medium?.url ||
                      "/api/placeholder/300/200"
                    }
                    alt={hotel.name}
                    style={styles.hotelImage}
                  />
                  {hotel.price && (
                    <div style={styles.priceTag}>From {hotel.price}</div>
                  )}
                </div>
                <div style={styles.hotelInfo}>
                  <h3 style={styles.hotelName}>{hotel.name}</h3>
                  <div style={styles.ratingContainer}>
                    <span style={styles.rating}>{hotel.rating} ★</span>
                    <span style={styles.reviewCount}>
                      ({hotel.num_reviews} reviews)
                    </span>
                  </div>
                  <p style={styles.location}>{hotel.location_string}</p>
                  {hotel.amenities && (
                    <div style={styles.amenities}>
                      {hotel.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} style={styles.amenityTag}>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  searchSection: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  searchForm: {
    display: "flex",
    maxWidth: "600px",
    margin: "0 auto",
    gap: "10px",
  },
  searchInput: {
    flex: 1,
    padding: "15px",
    fontSize: "16px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  searchButton: {
    padding: "15px 30px",
    fontSize: "16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "#e74c3c",
    marginTop: "10px",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "40px",
  },
  loadingSpinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  resultsContainer: {
    padding: "20px 0",
  },
  resultsTitle: {
    fontSize: "1.8rem",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  hotelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px 0",
  },
  hotelCard: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
  },
  imageContainer: {
    position: "relative",
  },
  hotelImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  priceTag: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    backgroundColor: "rgba(52, 152, 219, 0.9)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "14px",
  },
  hotelInfo: {
    padding: "20px",
  },
  hotelName: {
    fontSize: "1.2rem",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginBottom: "10px",
  },
  rating: {
    color: "#f1c40f",
    fontWeight: "bold",
  },
  reviewCount: {
    color: "#7f8c8d",
    fontSize: "14px",
  },
  location: {
    color: "#7f8c8d",
    fontSize: "14px",
    marginBottom: "10px",
  },
  amenities: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },
  amenityTag: {
    backgroundColor: "#f0f0f0",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#666",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

export default CityHotelSearch;
