import requests
from flask import request
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow requests from frontend

API_KEY = "AIzaSyAZNVwPsGBCUTejpyMNLz-lR4pLbMU9Abg"
HEADERS = {"x-api-key": API_KEY}
BASE_URL = "https://api.utdnebula.com"

def search_course(course_prefix, course_number):
    response = requests.get(f"{BASE_URL}/course/sections", params={"course_number": course_number, "subject_prefix": course_prefix}, headers=HEADERS)
    response.raise_for_status()
    results = response.json()
    return results

def get_professor(prof_id):
    response = requests.get(f"{BASE_URL}/professor/{prof_id}", params={}, headers=HEADERS)
    response.raise_for_status()
    results = response.json()
    return results

def get_grade_distribution(course_prefix, course_number, prof_firstname, prof_lastname):
    response = requests.get(f"{BASE_URL}/grades/overall", params={"number": course_number, "prefix": course_prefix, "first_name": prof_firstname, "last_name": prof_lastname}, headers=HEADERS)
    response.raise_for_status()
    results = response.json()
    return results

@app.route("/api/data", methods=["GET"])
def get_data():
    course_prefix = request.args.get("prefix", "").strip().upper()
    course_number = request.args.get("number", "").strip()

    if not course_prefix or not course_number:
        return jsonify({"error": "Missing prefix or number"}), 400

    try:
        course = search_course(course_prefix, course_number)
        course_ids = [section['course_reference'] for section in course['data']]
        instructors = [section['professors'] for section in course['data']]
        professors = [get_professor(prof[0]) for prof in instructors]

        prof_firstnames = [prof["data"]["first_name"] for prof in professors]
        prof_lastnames = [prof["data"]["last_name"] for prof in professors]
        teaching_assistants = [section['teaching_assistants'] for section in course['data']]
        section_number = [section['section_number'] for section in course['data']]

        grades = [get_grade_distribution(course_prefix, course_number, prof_firstnames[i], prof_lastnames[i]) for i in range(len(prof_firstnames))]
        grade_distribution = [item['data'] for item in grades if 'data' in item]

        info = []
        for i in range(len(section_number)):
            info.append([
                f"{course_prefix} {course_number}.{section_number[i]}: ",
                f"Professor: {prof_firstnames[i]} {prof_lastnames[i]}",
                f"TA: {teaching_assistants[i] if teaching_assistants[i] else 'None'}",
                f"{grade_distribution[i]}"
            ])
            print(info[i])

        return jsonify({"data": info if info else None})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)