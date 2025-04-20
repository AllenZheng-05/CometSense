// src/App.jsx
import React, { useEffect, useState } from "react";

const App = () => {
  const [prefix, setPrefix] = useState("");
  const [number, setNumber] = useState("");
  const [data, setData] = useState(null);

  // useEffect(() => {
  //   fetch("http://localhost:5000/api/data")
  //     .then((res) => res.json())
  //     .then((res) => setData(res.data))
  //     .catch((err) => console.error("Error fetching data:", err));
  // }, []);

  const fetchData = () => {
    fetch(`http://localhost:5000/api/data?prefix=${prefix}&number=${number}`)
      .then((res) => res.json())
      .then((res) => setData(res.data || res.error || "None"))
      .catch((err) => console.error("Error fetching data:", err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded">
        <h1 className="text-xl font-semibold mb-4">CometSense</h1>
        <input
          placeholder="Enter course prefix (e.g., CS)"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />
        <input
          placeholder="Enter course number (e.g., 1337)"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >Search</button>
        <pre className="text-gray-700">
          {data ? JSON.stringify(data, null, 2) : "None"}
        </pre>
      </div>
    </div>
  );
};

export default App;