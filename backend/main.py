import requests

API_KEY = "AIzaSyAZNVwPsGBCUTejpyMNLz-lR4pLbMU9Abg"
HEADERS = {
    "x-api-key": API_KEY
}

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

def main():
    course_prefix = input("Enter course prefix (e.g., CS): ").strip().upper()
    course_number = input("Enter course number (e.g., 1337): ").strip()

    course = search_course(course_prefix, course_number)
    if not course:
        print("Course not found.")
        return

    course_ids = [section['course_reference'] for section in course['data']]
    instructors = [section['professors'] for section in course['data']]
    start_date = [section['start_date'] for section in course['data']]
    professors = []
    for prof in instructors:
        professors.append(get_professor(prof[0]))
    prof_firstnames = []
    prof_lastnames = []
    for prof in professors:
        prof_firstnames.append(prof["data"]["first_name"])
        prof_lastnames.append(prof["data"]["last_name"])
    teaching_assistants = [section['teaching_assistants'] for section in course['data']]
    section_number = [section['section_number'] for section in course['data']]
    grades = []
    for prof in range(len(prof_firstnames)):
        grades.append(get_grade_distribution(course_prefix, course_number, prof_firstnames[prof], prof_lastnames[prof]))
    grade_distribution = [item['data'] for item in grades if 'data' in item]

    info = []
    for i in range(len(section_number)):
        info[i].append([f"{course_prefix} {course_number}.{section_number[i]}: ",
        f"Start date: {start_date[i]}"
        f"Professor: {prof_firstnames[i]} {prof_lastnames[i]}",
        f"TA: {teaching_assistants[i] if teaching_assistants[i] else "None"}",
        f"{grade_distribution[i]}"])

if __name__ == "__main__":
    main()
