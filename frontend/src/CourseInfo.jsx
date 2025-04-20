import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const App = () => {
  const [prefix, setPrefix] = useState("");
  const [number, setNumber] = useState("");
  const [data, setData] = useState(null);

  const fetchData = () => {
    fetch(`http://localhost:5000/api/data?prefix=${prefix}&number=${number}`)
      .then((res) => res.json())
      .then((res) => setData(res.data || res.error || "None"))
      .catch((err) => console.error("Error fetching data:", err));
  };

  const gradeKeys = [
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "D-",
    "F",
    "W",
  ];

  const toGradeObject = (grades) => {
    const gradeObj = {};
    gradeKeys.forEach((key, index) => {
      gradeObj[key] = grades[index] || 0;
    });
    return gradeObj;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fdf6e3",
        padding: "2rem",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          backgroundColor: "#fff8dc",
          border: "2px solid #deb887",
          borderRadius: "10px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#228B22",
          }}
        >
          CometSense
        </h1>

        <input
          placeholder="Enter course prefix (e.g., CS)"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          style={{
            display: "block",
            marginBottom: "1rem",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          placeholder="Enter course number (e.g., 1337)"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={{
            display: "block",
            marginBottom: "1rem",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={fetchData}
          style={{
            backgroundColor: "#cd853f",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>

        {Array.isArray(data) ? (
          data.map((entry, i) => {
            const [course, professor, ta, startDate, gradeArray] = entry;
            const gradeData = Object.entries(toGradeObject(gradeArray)).map(
              ([grade, count]) => ({
                grade,
                count,
              })
            );

            return (
              <div
                key={i}
                style={{
                  backgroundColor: "#fff",
                  marginTop: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              >
                <div style={{ marginBottom: "0.5rem" }}>{course}</div>
                <div style={{ marginBottom: "0.5rem" }}>{professor}</div>
                <div style={{ marginBottom: "0.5rem" }}>{ta}</div>
                <div style={{ marginBottom: "1rem" }}>{startDate}</div>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={gradeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#cd853f" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            );
          })
        ) : (
          <div style={{ marginTop: "1rem", color: "#b22222" }}>{data}</div>
        )}
      </div>
    </div>
  );
};

export default App;
