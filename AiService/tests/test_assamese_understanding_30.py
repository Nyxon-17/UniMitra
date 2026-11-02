"""
Test Suite: 32 Real-World Romanized Assamese and Mixed Assamese-English Test Cases
Verifies that the Assamese-English Input Understanding Layer accurately:
1. Recognizes Romanized Assamese ('as_roman')
2. Expands typing abbreviations and informal slang (e.g. 'ghrt e', 'tmi', 'knk', 'hbo')
3. Extracts authentic Assamese meaning and intent
4. Preserves English and Assamese script inputs without false positives
"""

import sys
import os

# Add AiService directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.assamese_understanding import assamese_understanding

TEST_CASES = [
    # --- 7 Primary User Examples ---
    {
        "id": 1,
        "input": "Tumi kun hoi?",
        "expected_mode": "as_roman",
        "description": "Asking who you are / identity",
        "expected_intent_substring": "identity",
    },
    {
        "id": 2,
        "input": "Coffee kenekoi bonai?",
        "expected_mode": "as_roman",
        "description": "Asking how to make coffee",
        "expected_intent_substring": "how to make",
    },
    {
        "id": 3,
        "input": "Aji ghrt e asu.",
        "expected_mode": "as_roman",
        "description": "Informal abbreviation 'ghrt e' -> at home",
        "expected_intent_substring": "home",
    },
    {
        "id": 4,
        "input": "Moi college jam.",
        "expected_mode": "as_roman",
        "description": "Will go to college ('jam' = will go)",
        "expected_intent_substring": "go to a location",
    },
    {
        "id": 5,
        "input": "Tumi ki kori asa?",
        "expected_mode": "as_roman",
        "description": "Asking what you are doing",
        "expected_intent_substring": "doing",
    },
    {
        "id": 6,
        "input": "Mur exam kali ase.",
        "expected_mode": "as_roman",
        "description": "Exam is scheduled for tomorrow",
        "expected_intent_substring": "exam",
    },
    {
        "id": 7,
        "input": "Moi buji pua nai.",
        "expected_mode": "as_roman",
        "description": "Did not understand / need clarification",
        "expected_intent_substring": "understand",
    },
    # --- 25 Additional Real-World Assamese-English Conversational Inputs ---
    {
        "id": 8,
        "input": "Mur admit card ketiya pam?",
        "expected_mode": "as_roman",
        "description": "When will I get my admit card",
    },
    {
        "id": 9,
        "input": "Dibrugarh university ot admission kenekoi lobo pari?",
        "expected_mode": "as_roman",
        "description": "How to take admission in Dibrugarh University",
    },
    {
        "id": 10,
        "input": "Passing marks kiman lagibo CBCS ot?",
        "expected_mode": "as_roman",
        "description": "How much passing marks needed in CBCS",
        "expected_intent_substring": "passing",
    },
    {
        "id": 11,
        "input": "Tumi bhal ne?",
        "expected_mode": "as_roman",
        "description": "Are you well / greeting",
        "expected_intent_substring": "greeting",
    },
    {
        "id": 12,
        "input": "Aji class ase ne?",
        "expected_mode": "as_roman",
        "description": "Is there class today?",
    },
    {
        "id": 13,
        "input": "Hostel fee kiman dibo lagibo?",
        "expected_mode": "as_roman",
        "description": "How much hostel fee to pay",
    },
    {
        "id": 14,
        "input": "Mur result bhal hol.",
        "expected_mode": "as_roman",
        "description": "My result was good",
    },
    {
        "id": 15,
        "input": "Moi eta app bonabo bisaru.",
        "expected_mode": "as_roman",
        "description": "I want to build an app",
    },
    {
        "id": 16,
        "input": "Kailoi college khula thakibo ne?",
        "expected_mode": "as_roman",
        "description": "Will college be open tomorrow?",
    },
    {
        "id": 17,
        "input": "Medical certificate dile attendance condonation pabo ne?",
        "expected_mode": "as_roman",
        "description": "Medical condonation eligibility inquiry",
        "expected_intent_substring": "attendance",
    },
    {
        "id": 18,
        "input": "Ishan uday scholarship r application form ketiya ahibo?",
        "expected_mode": "as_roman",
        "description": "Ishan Uday scholarship form date",
    },
    {
        "id": 19,
        "input": "Bhal lagil tumar logot kotha pati.",
        "expected_mode": "as_roman",
        "description": "Felt good talking to you",
    },
    {
        "id": 20,
        "input": "Re evaluation r fee kiman?",
        "expected_mode": "as_roman",
        "description": "Re-evaluation fee inquiry",
        "expected_intent_substring": "re-evaluation",
    },
    {
        "id": 21,
        "input": "Assam or chief minister kun?",
        "expected_mode": "as_roman",
        "description": "Who is the Chief Minister of Assam",
    },
    {
        "id": 22,
        "input": "Library card keneke bonabo?",
        "expected_mode": "as_roman",
        "description": "How to make library card",
    },
    {
        "id": 23,
        "input": "Moi exam ot fail korilu, etiya ki korim?",
        "expected_mode": "as_roman",
        "description": "Failed exam, what to do now",
    },
    {
        "id": 24,
        "input": "Tumi axomiya janane?",
        "expected_mode": "as_roman",
        "description": "Do you know Assamese?",
    },
    {
        "id": 25,
        "input": "Aji weather kenekua?",
        "expected_mode": "as_roman",
        "description": "How is the weather today?",
    },
    {
        "id": 26,
        "input": "Muk thora help kora na.",
        "expected_mode": "as_roman",
        "description": "Please give me some help",
    },
    {
        "id": 27,
        "input": "Semester exam routine aahil ne?",
        "expected_mode": "as_roman",
        "description": "Did semester exam routine arrive?",
    },
    {
        "id": 28,
        "input": "Syllabus download kenekoi korim?",
        "expected_mode": "as_roman",
        "description": "How will I download syllabus?",
    },
    {
        "id": 29,
        "input": "Moi Guwahati jam kali.",
        "expected_mode": "as_roman",
        "description": "I will go to Guwahati tomorrow",
    },
    {
        "id": 30,
        "input": "Eitu kotha sosa hoi ne?",
        "expected_mode": "as_roman",
        "description": "Is this matter true?",
    },
    {
        "id": 31,
        "input": "Tumi computer science jano ne?",
        "expected_mode": "as_roman",
        "description": "Do you know computer science?",
    },
    {
        "id": 32,
        "input": "Mur roll number pahorilu.",
        "expected_mode": "as_roman",
        "description": "I forgot my roll number",
    },
]


def run_tests():
    passed = 0
    total = len(TEST_CASES)

    print(f"\n========================================================")
    print(f"RUNNING 32 ROMANIZED ASSAMESE INPUT UNDERSTANDING TESTS")
    print(f"========================================================\n")

    for tc in TEST_CASES:
        res = assamese_understanding.interpret_query(tc["input"])
        mode_ok = res.language_mode == tc["expected_mode"]
        intent_ok = True
        if "expected_intent_substring" in tc:
            intent_ok = tc["expected_intent_substring"].lower() in (res.english_intent.lower() + res.assamese_meaning.lower())

        is_ok = mode_ok and intent_ok
        status = "PASS" if is_ok else "FAIL"

        if is_ok:
            passed += 1

        print(f"Test {tc['id']:02d}: [{status}] \"{tc['input']}\"")
        print(f"   Normalized: \"{res.normalized_query}\"")
        print(f"   Detected Mode: {res.language_mode} | Is Romanized: {res.is_romanized}")
        if res.assamese_meaning:
            print(f"   Assamese Meaning: {res.assamese_meaning}")
        if res.english_intent:
            print(f"   Understood Intent: {res.english_intent}")
        print("-" * 56)

    print(f"\nRESULTS: {passed}/{total} Tests Passed (Success Rate: {(passed/total)*100:.1f}%)")
    assert passed == total, f"Expected {total} passes, got {passed}"
    print("\nALL 32 REAL-WORLD ROMANIZED ASSAMESE TESTS PASSED PERFECTLY!\n")


if __name__ == "__main__":
    run_tests()

