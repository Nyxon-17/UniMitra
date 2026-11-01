import os
import pymupdf

def create_notice_pdf(filename, title, dept, ref_no, date, subject, paragraphs, signature_title):
    os.makedirs('Frontend/public/notices', exist_ok=True)
    filepath = os.path.join('Frontend/public/notices', filename)
    
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842) # Standard A4 (595 x 842 points)
    
    # Header - University Name
    page.draw_rect(pymupdf.Rect(40, 35, 555, 105), color=(0.07, 0.24, 0.23), width=1.5)
    page.insert_text((160, 60), "DIBRUGARH UNIVERSITY", fontsize=18, fontname="helv", color=(0.07, 0.24, 0.23))
    page.insert_text((185, 76), "RAJABHETA, DIBRUGARH - 786004, ASSAM", fontsize=10, fontname="helv", color=(0.2, 0.2, 0.2))
    page.insert_text((195, 92), dept.upper(), fontsize=11, fontname="helv", color=(0.83, 0.58, 0.1))
    
    # Ref No and Date line
    page.insert_text((45, 128), f"Ref. No.: {ref_no}", fontsize=10, fontname="helv", color=(0.1, 0.1, 0.1))
    page.insert_text((430, 128), f"Date: {date}", fontsize=10, fontname="helv", color=(0.1, 0.1, 0.1))
    
    page.draw_line((40, 138), (555, 138), color=(0.7, 0.7, 0.7), width=0.8)
    
    # Notice Title Banner
    page.draw_rect(pymupdf.Rect(210, 150, 385, 175), color=(0.07, 0.24, 0.23), fill=(0.91, 0.94, 0.93))
    page.insert_text((250, 168), "NOTIFICATION / CIRCULAR", fontsize=12, fontname="helv", color=(0.07, 0.24, 0.23))
    
    # Subject
    page.insert_text((45, 202), f"SUB: {subject.upper()}", fontsize=10.5, fontname="helv", color=(0.0, 0.0, 0.0))
    page.draw_line((45, 206), (550, 206), color=(0.0, 0.0, 0.0), width=0.5)
    
    y = 230
    for p in paragraphs:
        # Wrap text nicely
        rect = pymupdf.Rect(45, y, 550, y + 120)
        rc = page.insert_textbox(rect, p, fontsize=10, fontname="helv", color=(0.15, 0.15, 0.15), align=pymupdf.TEXT_ALIGN_LEFT)
        y += max(50, int(len(p) / 1.5))
        if y > 680:
            y = 680
    
    # Official Signature Block
    page.draw_line((380, 740), (530, 740), color=(0.3, 0.3, 0.3), width=0.8)
    page.insert_text((400, 755), f"Sd/-", fontsize=10, fontname="helv", color=(0.2, 0.2, 0.2))
    page.insert_text((370, 770), signature_title, fontsize=10, fontname="helv", color=(0.07, 0.24, 0.23))
    page.insert_text((370, 784), "Dibrugarh University", fontsize=9.5, fontname="helv", color=(0.3, 0.3, 0.3))
    
    # Footer Stamp
    page.draw_line((40, 805), (555, 805), color=(0.7, 0.7, 0.7), width=0.5)
    page.insert_text((45, 820), "UniMitra Digital Repository | Verified Institutional Document | https://dibru.ac.in", fontsize=8, fontname="helv", color=(0.5, 0.5, 0.5))
    
    doc.save(filepath)
    doc.close()
    print(f"Generated: {filepath}")

# 1. Exam Form Fillup Notice
create_notice_pdf(
    filename="DU_Odd_Sem_Exam_Form_Fillup_2024.pdf",
    title="Examination Form Fill-up Notification",
    dept="Office of the Controller of Examinations",
    ref_no="DU/EXAM/NOT/2024/912",
    date="28 October 2024",
    subject="Submission of Examination Forms for Odd Semester BA/B.Sc/B.Com & PG Examinations 2024",
    paragraphs=[
        "It is hereby notified for information of all concerned that the web portal for online submission of Examination Forms for the upcoming Odd Semester (1st, 3rd & 5th Semester) Under-Graduate (CBCS & FYUGP) and Post-Graduate Examinations 2024 will be activated from 1st November 2024 to 15th November 2024.",
        "Students are directed to log in to the official examination portal (https://dibru.exam.in) using their university registration credentials, verify their enrolled course codes, upload recent passport-size photograph, and pay the requisite examination fee via online payment gateway.",
        "A late fine of Rs. 300/- (Rupees Three Hundred only) per candidate shall be applicable for submissions made between 16th November 2024 and 20th November 2024. No further extension shall be entertained under any circumstances.",
        "Principals of affiliated colleges and Heads of University Departments are requested to scrutinize and approve the examination forms strictly adhering to the mandatory 75% minimum attendance requirement."
    ],
    signature_title="Controller of Examinations"
)

# 2. DUPGET Admission Counselling Notice
create_notice_pdf(
    filename="DU_DUPGET_Admission_Counselling_2024.pdf",
    title="PG Admission & Counselling Notification",
    dept="Office of the Academic Registrar",
    ref_no="DU/ACAD/ADM/2024/441",
    date="20 October 2024",
    subject="DUPGET-2024 Merit List Publication and Departmental Counselling Schedule for PG Admissions",
    paragraphs=[
        "This is for information of all candidates who appeared in the Dibrugarh University Post Graduate Entrance Test (DUPGET) 2024 that the provisional subject-wise merit lists have been published on the university website (https://dibru.ac.in).",
        "Physical document verification and counselling for provisional seat allotment will commence from 25th October 2024 at respective Teaching Departments and Centres for Studies.",
        "Candidates must present all original credentials along with self-attested photocopies: (1) High School and Higher Secondary Marksheets, (2) Degree Final Semester Marksheets/Grade Cards, (3) Permanent Residence Certificate (PRC) of Assam, (4) Caste/EWS certificate if applicable, and (5) DUPGET Scorecard.",
        "Admission fee payment must be completed within 24 hours of seat verification via SBI Collect. Failure to pay within the stipulated window will result in automatic forfeiture of the allotted seat."
    ],
    signature_title="Academic Registrar"
)

# 3. Medical Attendance Condonation Notice
create_notice_pdf(
    filename="DU_Medical_Attendance_Condonation_2024.pdf",
    title="Regulations on Attendance & Medical Exemption",
    dept="Office of the Dean, Academic Affairs",
    ref_no="DU/ACAD/ATT/2024/108",
    date="02 August 2024",
    subject="Statutory Regulations on Class Attendance and Medical Condonation (Section 4.3)",
    paragraphs=[
        "Pursuant to the resolutions of the Academic Council, all enrolled students across undergraduate and postgraduate programmes are reminded that a minimum of 75% attendance in lectures, practicals, and tutorials is strictly mandatory to be eligible to sit for End-Semester Examinations.",
        "Under statutory Clause 4.3 of Dibrugarh University Regulations, condonation of shortage of attendance up to a maximum of 10% (i.e. attendance between 65% and 74.9%) may be granted exclusively on valid medical grounds.",
        "Application for medical condonation must be submitted to the Head of the Department within 7 calendar days of resuming classes, duly endorsed by a prescription/discharge certificate countersigned by the Chief Medical Officer (CMO), Dibrugarh University Health Centre.",
        "Students with attendance below 65% shall not be eligible for condonation under any circumstances and must repeat the semester courses in the subsequent academic session."
    ],
    signature_title="Dean, Academic Affairs"
)

# 4. Ishan Uday Scholarship Notification
create_notice_pdf(
    filename="DU_Ishan_Uday_Scholarship_2024.pdf",
    title="Scholarship Notification - Ishan Uday & DHE Schemes",
    dept="Scholarship Cell & Student Welfare Section",
    ref_no="DU/SCHOL/UGC/2024/67",
    date="15 October 2024",
    subject="National Scholarship Portal (NSP) Ishan Uday Special Scholarship for North Eastern Region (NER) 2024-25",
    paragraphs=[
        "Applications are invited from eligible 1st year Undergraduate students of Dibrugarh University and affiliated colleges for the 'Ishan Uday Special Scholarship Scheme for North Eastern Region' sponsored by University Grants Commission (UGC) for the academic session 2024-25.",
        "Quantum of Scholarship: Selected scholars pursuing general degree courses will receive Rs. 5,400/- per month, and students enrolled in technical/professional degree programmes will receive Rs. 7,800/- per month for the entire duration of the degree course.",
        "Eligibility Criteria: (1) Domicile certificate of North Eastern States (Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura), (2) Passed 10+2 examination in 2024 with minimum 60% marks, (3) Annual parental income from all sources not exceeding Rs. 4.5 Lakhs.",
        "Online applications must be submitted on the National Scholarship Portal (https://scholarships.gov.in) on or before 30th November 2024. The university verification desk will scrutinize Aadhaar-seeded bank accounts and institutional documents."
    ],
    signature_title="Coordinator, Scholarship Cell"
)

print("All 4 official PDF notices generated successfully!")

