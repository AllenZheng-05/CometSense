import React, { useState } from "react";
import axios from "axios";

const API_KEY = "AIzaSyAZNVwPsGBCUTejpyMNLz-lR4pLbMU9Abg";
const HEADERS = {
  headers: {
    "x-api-key": API_KEY,
  },
};

const CourseInfo = () => {
  const [prefix, setPrefix] = useState("");
  const [number, setNumber] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const courseResponse = await axios.get(
        `https://api.utdnebula.com/course/sections`,
        {
          params: { course_number: number, subject_prefix: prefix },
          ...HEADERS,
        }
      );
      const courseData = courseResponse.data.data;

      const professorPromises = courseData.map((section) =>
        axios.get(
          `https://api.utdnebula.com/professor/${section.professors[0]}`,
          HEADERS
        )
      );
      const professorResponses = await Promise.all(professorPromises);
      const professors = professorResponses.map((res) => res.data.data);

      const gradePromises = professors.map((prof) =>
        axios.get(
          `https://api.utdnebula.com/grades/overall`,
          {
            params: {
              number,
              prefix,
              first_name: prof.first_name,
              last_name: prof.last_name,
            },
            ...HEADERS,
          }
        )
      );
      const gradeResponses = await Promise.all(gradePromises);
      const grades = gradeResponses.map((res) => res.data);

      setData({ courseData, professors, grades });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">UTD Course Info Viewer</h1>
      <div className="flex gap-4 mb-4">
        <input
          className="border p-2 rounded w-1/4"
          placeholder="Course Prefix (e.g. CS)"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />
        <input
          className="border p-2 rounded w-1/4"
          placeholder="Course Number (e.g. 1337)"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white p-2 rounded"
          onClick={fetchCourseData}
        >
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {data && (
        <div className="space-y-4">
          {data.courseData.map((section, idx) => (
            <div
              key={section.course_reference}
              className="border p-4 rounded shadow"
            >
              <h2 className="text-xl font-semibold">
                Section {section.section_number}
              </h2>
              <p><strong>Instructor:</strong> {data.professors[idx].first_name} {data.professors[idx].last_name}</p>
              <p><strong>TA(s):</strong> {section.teaching_assistants.join(", ") || "None"}</p>
              <div className="mt-2">
                <strong>Grade Distribution:</strong>
                <pre className="bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(data.grades[idx], null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseInfo;
