import { useState } from "react";
import axios from "axios";

const LanguageDetection = () => {
  const [text, setText] = useState(""); // State to store input text
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle text input changes
  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the page from reloading on form submit

    const data = new FormData();
    data.append("q", text);

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2/detect",
      headers: {
        "x-rapidapi-key": "bb4376584dmsh85c9ba6514ee6d9p16c1e0jsn8f5d2343a9b4",
        "x-rapidapi-host": "google-translate1.p.rapidapi.com",
        "Accept-Encoding": "application/gzip",
      },
      data: data,
    };

    try {
      const response = await axios.request(options);
      setResponseData(response.data); // Set the response data
      setError(null); // Reset error on successful request
    } catch (err) {
      setError(err); // Set error if API request fails
      setResponseData(null); // Clear any previous response
    }
  };

  return (
    <div>
      <h1>Language Detection</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Enter text to detect language:
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder="Type text here"
          />
        </label>
        <button type="submit">Detect Language</button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {responseData ? (
        <div>
          <h2>Detected Language</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      ) : (
        <p>Enter some text and click Detect Language.</p>
      )}
    </div>
  );
};

export default LanguageDetection;
