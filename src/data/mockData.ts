import type {
  Semester,
  Project,
  Certificate,
  Achievement,
  GalleryItem,
  DashboardStat,
  Document,
} from './types';

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export const dashboardStats: DashboardStat[] = [
  { id: 'ds-1', label: 'Semesters Completed', value: 4, trend: 'up', description: '5th semester in progress' },
  { id: 'ds-2', label: 'Cumulative GPA', value: 9.23, trend: 'up', description: 'CGPA across 4 semesters (VIT Pune)' },
  { id: 'ds-3', label: 'Projects Built', value: 10, trend: 'up', description: 'Web, ML, IoT, and mobile apps' },
  { id: 'ds-4', label: 'Certificates Earned', value: 17, trend: 'up', description: 'Courses and workshops' },
  { id: 'ds-5', label: 'Subjects Studied', value: 30, trend: 'up', description: 'Theory, labs, and projects' },
  { id: 'ds-6', label: 'Documents Archived', value: 200, trend: 'up', description: 'Notes, assignments, and reports' },
];

// ─── Semesters ──────────────────────────────────────────────────────────────

export const semesters: Semester[] = [
  {
    id: 'sem-1',
    number: 1,
    title: 'First Year — Semester 1',
    dateRange: 'Aug 2024 – Dec 2024',
    sgpa: 8.9,
    status: 'completed',
    subjects: [
      { id: 's1-1', name: 'Calculus & Statistics (CAS)', code: 'CAS', credits: 4, category: 'theory' },
      { id: 's1-2', name: 'Applied Electronics (Robotics & Mechatronics)', code: 'AE', credits: 3, category: 'theory' },
      { id: 's1-3', name: 'Applied Electronics Lab (Arduino)', code: 'AE LAB', credits: 2, category: 'lab' },
      { id: 's1-4', name: 'Data Analysis', code: 'DA', credits: 3, category: 'theory' },
      { id: 's1-5', name: 'Python Programming', code: 'PYTHON', credits: 3, category: 'theory' },
      { id: 's1-6', name: 'Guided Project 1 (Career Planning)', code: 'GP1', credits: 1, category: 'theory' },
      { id: 's1-7', name: 'Study & Research Methodology 1', code: 'SRM1', credits: 2, category: 'theory' },
      { id: 's1-8', name: 'Applied Science Experiential Project 1', code: 'ASEP1', credits: 2, category: 'lab' },
    ],
    documents: [
      { 
        id: 'd1-1', 
        title: 'Python — All 62 Codes', 
        type: 'notes', 
        semesterId: 'sem-1', 
        subjectName: 'Python Programming', 
        date: '2024-10-01',
        description: `1. Program to Calculate Area of Circle & Triangle:
pi = 3.14
radius = float(input("ENTER RADIUS: "))
area = pi * radius * radius
print("Area of circle is: ", area)

2. Program to Swap Two Variables:
a = input("Enter first variable: ")
b = input("Enter second variable: ")
temp = a
a = b
b = temp
print("Swapped values:", a, b)

3. Program to Generate Random Number:
import random
print(random.randint(0, 100))

4. Program to Convert Kilometers to Miles:
mile = 0.62
kilometers = float(input("ENTER KM: "))
print("OUTPUT IS: ", mile * kilometers)

... [58 more verified Python programs included in full file]`
      },
      { 
        id: 'd1-2', 
        title: 'AE Lab — All 26 Question Solutions', 
        type: 'lab-journal', 
        semesterId: 'sem-1', 
        subjectName: 'Applied Electronics Lab', 
        date: '2024-11-01',
        description: `Q1: Use three LEDs, prepare a circuit to glow light at three different resistance values. Buzzer at highest resistance & LCD display.
Q2: Use LDR sensor and three LEDs, design circuit to glow LEDs at three different light levels with LCD display.
Q3: Ultrasonic sensor & 3 LEDs: glow LEDs at 3 different distances with LCD display.
Q4: Servo motor status display: 2 LEDs + RPM display on LCD monitor.
Q5: Infrared sensor: 2-3 LEDs for different values + LCD readout.
Q6: Temperature sensor (LM35) + 3 LEDs + LCD display.
Q7: DC Motor control with LED indicators and LCD RPM display.
Q8: LED + LCD Name scroller circuit design.`
      },
      { 
        id: 'd1-3', 
        title: 'CAS — Unit 1 to 6 Notes', 
        type: 'notes', 
        semesterId: 'sem-1', 
        subjectName: 'Calculus & Statistics', 
        date: '2024-10-15',
        description: `Unit 1: Functions of Single Variable & Taylor Series Expansion
- Taylor & Maclaurin Series formulas
- Indeterminate forms & L'Hopital Rule

Unit 2: Functions of Several Variables
- Partial Differentiation & Euler's Theorem
- Maxima & Minima of two variables, Lagrange Multipliers

Unit 3: Vector Calculus & Differentiation
- Gradient, Divergence, and Curl
- Solenoidal and Irrotational vector fields

Unit 4: Multiple Integrals
- Double & Triple integration in Cartesian & Polar coordinates
- Area & Volume calculations

Unit 5 & 6: Descriptive Statistics & Random Variables
- Mean, Variance, Standard Deviation, Skewness, Kurtosis
- Probability distributions: Binomial, Poisson, Normal Distribution`
      },
      { 
        id: 'd1-4', 
        title: 'Data Analysis — Course Project Report', 
        type: 'report', 
        semesterId: 'sem-1', 
        subjectName: 'Data Analysis', 
        date: '2024-11-20',
        description: `DATA ANALYSIS COURSE PROJECT REPORT (2024-25)
Author: Abhishek Patil | Branch: CSE (AI & ML)

1. Data Extraction & Transformation (ETL in Power BI & Excel)
2. Pivot Tables, Pivot Charts & Dynamic Formatting
3. Regression Analysis & Normal Distribution Curve Fitting
4. Lookup Functions (VLOOKUP, XLOOKUP, INDEX-MATCH) implementations on sample datasets.`
      },
      { 
        id: 'd1-5', 
        title: 'SRM — Assignments (HA 1–5)', 
        type: 'assignment', 
        semesterId: 'sem-1', 
        subjectName: 'Study & Research Methodology', 
        date: '2024-11-15',
        description: `SRM Assignment Submissions (HA 1 to HA 5):
- HA 1: Research Methodology Fundamentals & Problem Identification
- HA 2: Literature Review Protocols & Citation Standards
- HA 3: Quantitative Data Collection & Hypotheses Testing
- HA 4: Experimental Design Frameworks
- HA 5: Scientific Report Drafting & IEEE Referencing Formats`
      },
      { 
        id: 'd1-6', 
        title: 'CAS — Tutorials (1–12)', 
        type: 'assignment', 
        semesterId: 'sem-1', 
        subjectName: 'Calculus & Statistics', 
        date: '2024-12-01',
        description: `Tutorial 1: Single Variable Taylor Series Expansion Problems
Tutorial 2: Partial Derivatives & Chain Rule
Tutorial 3: Vector Differentiation, Divergence & Curl Solved Problems
Tutorial 7: Double Integration in Cartesian Coordinates
Tutorial 8: Triple Integration & Volume Applications
Tutorial 9: Multiple Integrals Change of Variables
Tutorial 11: Descriptive Statistics & Frequency Distribution
Tutorial 12: Random Variables & Normal Distribution Equations`
      },
      { 
        id: 'd1-7', 
        title: 'CAS Case Study PPT', 
        type: 'ppt', 
        semesterId: 'sem-1', 
        subjectName: 'Calculus & Statistics', 
        date: '2024-11-10',
        description: `CAS CASE STUDY PRESENTATION
Topic: Applications of Multiple Integrals & Vector Calculus in Real-World Engineering
- Modeling Fluid Flow using Divergence & Curl
- Center of Mass & Moment of Inertia calculations using Double Integrals
- Statistical Analysis of Experimental Sensor Data`
      },
      { 
        id: 'd1-8', 
        title: 'DAWATRACK: Your Personalized Medicine Guardian', 
        type: 'research', 
        semesterId: 'sem-1', 
        subjectName: 'ASEP1', 
        date: '2024-12-05',
        description: `TITLE:
DAWATRACK: Your Personalized Medicine Guardian

AUTHORS:
Amruta Amune, Pooja Gavhane, Amruta Amune, Aditi Patil, Adit Pakhode, Abhishek Patil, Abhinandan Bardia, Abhishek Singh, Pradyumna Adhari
Department of Engineering, Sciences and Humanities (DESH), Vishwakarma Institute of Technology, Pune, India

ABSTRACT:
DawaTrack is a next-generation, IoT-enabled digital health ecosystem that integrates real-time physiological monitoring, predictive analytics, and intelligent alert mechanisms to facilitate proactive healthcare management. Built around the ESP32 microcontroller and MAX30100 sensor, the system continuously records timestamped vitals—namely heart rate and blood oxygen saturation (SpO2)—and processes them via a hybrid model combining fuzzy logic and XGBoost classification for personalized risk assessment. At its core lies a dynamic web-based Sensor Dashboard, which visualizes live and historical data with intuitive indicators such as "Normal," "Bradycardia," "Tachycardia," "Caution," and "Danger." The system issues automated alerts with advisory messages via email when anomalies are detected.

METHODOLOGY & SYSTEM ARCHITECTURE:
1. Hardware Layer: Wearable vital sensing unit built using ESP32 microcontroller & MAX30100 optical pulse oximetry sensor streaming raw PPG data.
2. Cloud Backend & Real-Time Pipeline: Ingestion via HTTPS POST requests into PostgreSQL database hosted on Supabase, triggering low-latency WebSocket broadcasts.
3. Predictive Engine: Hybrid analytics engine combining Fuzzy Logic state mapping with pre-trained XGBoost classification to forecast adverse cardiac & respiratory events.
4. Asynchronous Alerting: Independent SMTP email dispatch delivering immediate advisory notifications upon detecting abnormal vitals.

RESULTS & DISCUSSIONS:
- Vital Discrimination Accuracy: Categorized heart rates (50 BPM as Bradycardia, 200 BPM as Tachycardia) and SpO2 levels (94% as Caution, 50% as Danger) with zero classification errors.
- Real-World Event Distribution (155 users tested): 41.29% Normal vitals, 17.42% High Heart Rate (>100 BPM), 14.19% Low SpO2 (<94%), 11.61% High BP, 9.68% Low HR, 5.81% Irregular Combination.
- Automated Alert Verification: 100% reliable email notification delivery for low HR and mild/severe hypoxia thresholds.

INDEX TERMS / KEYWORDS:
IoT in Healthcare, Real-Time Monitoring, Heart Rate, SpO2, Predictive Analytics, Fuzzy Logic, XGBoost, ESP32, Supabase, Wearable Sensors, Preventive Healthcare, Intelligent Alert Systems`
      },
    ],
    highlights: [
      'Built DawaTrack — a medicine expiry tracker app (ASEP1 Project)',
      'Created Angry Bird Game clone in Python',
      'Completed Arduino color detection project in AE Lab',
      'Attended TEDx event',
    ],
  },
  {
    id: 'sem-2',
    number: 2,
    title: 'First Year — Semester 2',
    dateRange: 'Jan 2025 – Jun 2025',
    sgpa: 9.5,
    status: 'completed',
    subjects: [
      { id: 's2-1', name: 'Computer Organization & Architecture (COAA)', code: 'COAA', credits: 4, category: 'theory' },
      { id: 's2-2', name: 'Indian Knowledge System (IKS)', code: 'IKS', credits: 2, category: 'theory' },
      { id: 's2-3', name: 'Linear Algebra & Differential Equations (LAADE)', code: 'LAADE', credits: 4, category: 'theory' },
      { id: 's2-4', name: 'Problem Solving & Application Programming Lab', code: 'PSAP', credits: 2, category: 'lab' },
      { id: 's2-5', name: 'Skill & Workforce Development (SWD)', code: 'SWD', credits: 2, category: 'theory' },
      { id: 's2-6', name: 'Web Development (WD)', code: 'WD', credits: 3, category: 'theory' },
      { id: 's2-7', name: 'Guided Project 2', code: 'GP2', credits: 1, category: 'theory' },
      { id: 's2-8', name: 'Study & Research Methodology 2', code: 'SRM2', credits: 2, category: 'theory' },
      { id: 's2-9', name: 'Applied Science Experiential Project 2', code: 'ASEP2', credits: 2, category: 'lab' },
    ],
    documents: [
      { id: 'd2-1', title: 'COAA — Merged Notes', type: 'notes', semesterId: 'sem-2', subjectName: 'COAA', date: '2025-03-01' },
      { id: 'd2-2', title: 'LAADE — Assignments (HA 1–6)', type: 'assignment', semesterId: 'sem-2', subjectName: 'LAADE', date: '2025-04-15' },
      { id: 'd2-3', title: 'LAADE — Tutorials (5–12)', type: 'assignment', semesterId: 'sem-2', subjectName: 'LAADE', date: '2025-05-01' },
      { id: 'd2-4', title: 'PSAP Lab — All 8 Assignments', type: 'lab-journal', semesterId: 'sem-2', subjectName: 'PSAP Lab', date: '2025-04-20' },
      { id: 'd2-5', title: 'Web Development Cheat Sheet', type: 'notes', semesterId: 'sem-2', subjectName: 'Web Development', date: '2025-03-15' },
      { id: 'd2-6', title: 'SWD — Mental Health Awareness Presentation', type: 'ppt', semesterId: 'sem-2', subjectName: 'SWD', date: '2025-04-27' },
      { id: 'd2-7', title: 'GP2 — ESE Review Presentation', type: 'ppt', semesterId: 'sem-2', subjectName: 'Guided Project 2', date: '2025-05-03' },
      { 
        id: 'd2-8', 
        title: 'DAWATRACK v2: IoT Sensor Integration & Intelligent Pharmacy Guardian Platform', 
        type: 'research', 
        semesterId: 'sem-2', 
        subjectName: 'ASEP2', 
        date: '2025-05-20',
        description: `TITLE:
DAWATRACK v2: IoT Sensor Integration & Intelligent Pharmacy Guardian Platform

AUTHORS:
Abhishek Patil, Aditi Patil, Abhinandan Bardia & ASEP2 Team
Vishwakarma Institute of Technology, Pune, India

ABSTRACT:
DawaTrack v2 extends the digital healthcare and medicine safety monitoring framework by combining ambient environmental IoT sensors with automated drug storage analytics. The system monitors storage temperature, humidity, and atmospheric parameters around stored pharmaceuticals using ESP32 edge nodes while integrating an AI chatbot assistant for real-time dosage and storage recommendations. Patent documentation and hardware schematics demonstrate a complete solution for home pharmacy management and rural clinic drug preservation.

METHODOLOGY & SYSTEM ARCHITECTURE:
1. Multi-Sensor IoT Layer: Hardware integration of DHT11 temperature/humidity sensors and optical sensors with ESP32 edge processing.
2. AI Chatbot & Knowledge Base: Natural language query engine interface connected to drug interaction databases for instant patient guidance.
3. Patent & IP Documentation: Formulation of patent specifications covering dual-sensor medicine storage monitoring and automated alert workflows.

RESULTS & DISCUSSIONS:
- Environmental Drift Threshold Alerts: Triggered instant storage condition alerts when ambient temperature exceeded 30°C or humidity surpassed 65%.
- Patent Claims Validation: Successfully generated patent specifications for IoT-assisted drug deterioration prevention.
- System Integration: Achieved synchronous sensor dashboard updates and AI chatbot response latencies under 1.2 seconds.

INDEX TERMS / KEYWORDS:
IoT Storage Monitoring, DHT11 Sensors, ESP32 Edge Computing, Medicine Expiry Prevention, Healthcare AI Chatbot, Patent Filing, Environmental Sensing`
      },
      { id: 'd2-9', title: 'ASEP2 — DawaTrack with Sensors End-Sem Report', type: 'report', semesterId: 'sem-2', subjectName: 'ASEP2', date: '2025-05-20' },
      { id: 'd2-10', title: 'IKS — Merged Notes', type: 'notes', semesterId: 'sem-2', subjectName: 'IKS', date: '2025-03-10' },
    ],
    highlights: [
      'Extended DawaTrack with ChatBot & IoT sensors (ASEP2)',
      'Built Khel Connect — a web development project',
      'Created GDSC Website and GOV Website projects',
      'Filed DawaTrack patent document',
      'Built Mental Health Awareness campaign (SWD)',
    ],
  },
  {
    id: 'sem-3',
    number: 3,
    title: 'Second Year — Semester 1',
    dateRange: 'Aug 2025 – Dec 2025',
    sgpa: 9.05,
    status: 'completed',
    subjects: [
      { id: 's3-1', name: 'Database Management Systems (DBMS)', code: 'DBMS', credits: 4, category: 'theory' },
      { id: 's3-2', name: 'Digital Electronics & Microprocessors (DEAM)', code: 'DEAM', credits: 3, category: 'theory' },
      { id: 's3-3', name: 'Digital Electronics Lab (DEAM Lab)', code: 'DEAM LAB', credits: 2, category: 'lab' },
      { id: 's3-4', name: 'Foundations of Data Structures (FODS)', code: 'FODS', credits: 4, category: 'theory' },
      { id: 's3-5', name: 'Object-Oriented Programming (OOP)', code: 'OOP', credits: 4, category: 'theory' },
      { id: 's3-6', name: 'Mathematical & Discrete Mathematics (MDM)', code: 'MDM', credits: 3, category: 'theory' },
      { id: 's3-7', name: 'Entrepreneurship Development & Innovation (EDI)', code: 'EDI', credits: 3, category: 'elective' },
    ],
    documents: [
      { id: 'd3-1', title: 'DBMS — Assignments (1–9) with SQL Queries', type: 'assignment', semesterId: 'sem-3', subjectName: 'DBMS', date: '2025-11-01' },
      { id: 'd3-2', title: 'OOP — Assignments (1–9) with Java Code', type: 'assignment', semesterId: 'sem-3', subjectName: 'OOP', date: '2025-11-15' },
      { id: 'd3-3', title: 'FODS — Assignments (1A–13) with C Programs', type: 'assignment', semesterId: 'sem-3', subjectName: 'FODS', date: '2025-11-20' },
      { id: 'd3-4', title: 'DEAM Lab — Assignments (1–9)', type: 'lab-journal', semesterId: 'sem-3', subjectName: 'DEAM Lab', date: '2025-11-10' },
      { id: 'd3-5', title: 'MDM — Assignments (HA 1–4)', type: 'assignment', semesterId: 'sem-3', subjectName: 'MDM', date: '2025-10-20' },
      { 
        id: 'd3-6', 
        title: 'An AI and Blockchain-Based Framework for Real-Time Apple Quality Grading and Supply Chain Traceability', 
        type: 'research', 
        semesterId: 'sem-3', 
        subjectName: 'EDI', 
        date: '2025-12-01',
        description: `TITLE:
An AI and Blockchain-Based Framework for Real-Time Apple Quality Grading and Supply Chain Traceability

AUTHORS:
Abhishek Patil, Ved Aghav, Varsha Dange, Aditi Patil, Aditya Kachwaha, Abhinandan Bardia
Vishwakarma Institute of Technology, Pune, India (abhishek.patil241@vit.edu)

ABSTRACT:
A blockchain-secured mobile application integrates artificial intelligence to automate the quality grading of apples. Transfer learning is used to develop three deep learning models, MobileNetV3, ResNet50 and EfficientNet-B0, for classifying apples into predefined grades (A, B, and C) based on color, texture, and surface defects. The performance of all three models is evaluated to determine the architecture that provides higher accuracy and better generalization in real-world scenarios.

The application enables farmers to capture or upload apple images and obtain instant grading results. The predicted grade and associated metadata, including farmer details, timestamp, and location, are securely recorded on a decentralized blockchain ledger, ensuring transparency, traceability, and immutability. Each batch is assigned a unique QR code that allows consumers to verify product origin and provide feedback.

This approach enhances trust among stakeholders, reduces fraud, improves quality assurance, and increases efficiency in fruit distribution networks. Additionally, the platform provides farmers with access to nearby warehouses and collection centers, enabling faster post-harvest decision-making. Model performance is further evaluated using precision, recall, and F1-score to ensure balanced classification across all grades.

METHODOLOGY & SYSTEM ARCHITECTURE:
1. Transfer Learning & Model Fine-Tuning: Three deep learning models (MobileNetV3, ResNet50, and EfficientNet-B0) fine-tuned with pre-trained ImageNet weights to classify apples into Grade A, Grade B, and Grade C.
2. Real-Time Grading Workflow: Farmer captures or uploads apple image through mobile application; background preprocessing computes grade probabilities within seconds.
3. Decentralized Ledger & QR Traceability: Immutable recording of farmer ID, timestamp, grade, and GPS location on decentralized blockchain. Automated QR code generation for consumer verification.
4. Warehouse Locator: GPS-integrated module recommendations for nearby cold storage facilities and collection centers.

RESULTS & DISCUSSIONS:
- MobileNetV3 Performance: Highest accuracy of 93.0% (vs 90.8% for EfficientNet-B0 and 89.2% for ResNet50).
- Statistical Metrics: Precision: 0.92 | Recall: 0.91 | F1-Score: 0.915
- Model Deployment Footprint: 5–6 MB model size with ultra-fast inference speed, making MobileNetV3 the optimal candidate for real-world on-farm mobile deployment.
- Blockchain Immutability: Successfully verified tamper-proof storage of farmer identity, timestamp, and GPS location on Sepolia testnet ledger.

INDEX TERMS / KEYWORDS:
Fruit Quality Grading, MobileNetV3, EfficientNet-B0, Transfer Learning, Deep Learning, Image-Based Classification, Color and Texture Analysis, Surface Defect Detection, Real-Time Grading, Blockchain Ledger, Decentralized Traceability, QR Code Generation, Farmer Metadata, Location Tracking, Supply Chain Transparency, Warehouse Locator, Mobile Application`
      },
      { id: 'd3-7', title: 'OOP — Course Project (JDBC Integration)', type: 'report', semesterId: 'sem-3', subjectName: 'OOP', date: '2025-12-05' },
      { id: 'd3-8', title: 'FODS — Lab Manual Solutions', type: 'lab-journal', semesterId: 'sem-3', subjectName: 'FODS', date: '2025-10-15' },
    ],
    highlights: [
      'Built Workout Planner app with SQL (DBMS Course Project)',
      'Built Fruit Grading App with ML & Android APK (EDI)',
      'OOP Course Project with JDBC database integration',
      'Implemented sorting algorithms from scratch in FODS (C)',
    ],
  },
  {
    id: 'sem-4',
    number: 4,
    title: 'Second Year — Semester 2',
    dateRange: 'Jan 2026 – Jun 2026',
    sgpa: 9.48,
    status: 'completed',
    subjects: [
      { id: 's4-1', name: 'Artificial Intelligence (AI)', code: 'AI', credits: 4, category: 'theory' },
      { id: 's4-2', name: 'AI Lab', code: 'AI LAB', credits: 2, category: 'lab' },
      { id: 's4-3', name: 'Advanced Data Structures Lab (ADS)', code: 'ADS LAB', credits: 2, category: 'lab' },
      { id: 's4-4', name: 'Operating Systems (OS)', code: 'OS', credits: 4, category: 'theory' },
      { id: 's4-5', name: 'OS Lab', code: 'OS LAB', credits: 2, category: 'lab' },
      { id: 's4-6', name: 'Principles of Compiler & Automata Design (POCACD)', code: 'POCACD', credits: 4, category: 'theory' },
      { id: 's4-7', name: 'POCACD Lab', code: 'POCACD LAB', credits: 2, category: 'lab' },
      { id: 's4-8', name: 'Internet of Things (IoT)', code: 'IoT', credits: 3, category: 'theory' },
      { id: 's4-9', name: 'Entrepreneurship Development & Innovation (EDI)', code: 'EDI', credits: 3, category: 'elective' },
    ],
    documents: [
      { id: 'd4-1', title: 'AI — Question Banks & End-Sem Prep', type: 'notes', semesterId: 'sem-4', subjectName: 'AI', date: '2026-05-01' },
      { id: 'd4-2', title: 'AI Lab — Assignments (1–10)', type: 'lab-journal', semesterId: 'sem-4', subjectName: 'AI Lab', date: '2026-04-20' },
      { id: 'd4-3', title: 'ADS Lab — Assignments (1–9)', type: 'lab-journal', semesterId: 'sem-4', subjectName: 'ADS Lab', date: '2026-04-15' },
      { id: 'd4-4', title: 'OS — Question Bank Solutions & End-Sem', type: 'notes', semesterId: 'sem-4', subjectName: 'OS', date: '2026-05-10' },
      { id: 'd4-5', title: 'OS Lab — Assignments (1–6) with CPU Scheduling', type: 'lab-journal', semesterId: 'sem-4', subjectName: 'OS Lab', date: '2026-04-25' },
      { id: 'd4-6', title: 'POCACD — Practice Questions & End-Sem', type: 'notes', semesterId: 'sem-4', subjectName: 'POCACD', date: '2026-05-15' },
      { id: 'd4-7', title: 'POCACD Lab — Assignments (1–14)', type: 'lab-journal', semesterId: 'sem-4', subjectName: 'POCACD Lab', date: '2026-05-05' },
      { id: 'd4-8', title: 'IoT — Assignments (1–10) & Smart Agriculture Case Study', type: 'assignment', semesterId: 'sem-4', subjectName: 'IoT', date: '2026-04-30' },
      { 
        id: 'd4-9', 
        title: 'TRAVYA: AI-Powered Smart Tourist Safety Monitoring and Real-Time Incident Response Ecosystem using Geo-Fencing and Blockchain-Based Digital Identity', 
        type: 'research', 
        semesterId: 'sem-4', 
        subjectName: 'EDI', 
        date: '2026-05-22',
        description: `TITLE:
TRAVYA: AI-Powered Smart Tourist Safety Monitoring and Real-Time Incident Response Ecosystem using Geo-Fencing and Blockchain-Based Digital Identity

AUTHORS:
Abhishek Patil & Team
Vishwakarma Institute of Technology, Pune, India (abhishek.patil241@vit.edu)

ABSTRACT:
Tourist safety remains a major challenge due to fragmented infrastructure, delayed emergency response, and lack of real-time monitoring systems. Existing tourism platforms primarily focus on booking and navigation, offering limited support for proactive safety and incident management. This paper presents TRAVYA, an AI-powered smart tourist safety monitoring and real-time incident response system that integrates geo-fencing, anomaly detection, and blockchain-based digital identity. The system enables police-verified registration, continuous location tracking, predictive safety analytics, and rapid emergency response through verified local networks and authority-level monitoring. Blockchain implementation using the Ethereum Sepolia Testnet ensures secure and tamper-proof identity management. The proposed framework transforms traditional reactive safety mechanisms into a proactive and intelligent ecosystem, improving coordination, transparency, and overall tourist safety.

SYSTEM ARCHITECTURE & METHODOLOGY:
1. Police-Verified Digital Identity: Tamper-proof identity management implemented on the Ethereum Sepolia Testnet for secure user verification.
2. Geo-Fencing & Anomaly Detection: Continuous location tracking with predictive safety analytics to detect deviations from safe travel corridors in real time.
3. Rapid Emergency Incident Response: Authority-level monitoring dashboards integrated with verified local responder networks for low-latency emergency dispatch.

RESULTS & DISCUSSIONS:
- Real-Time Anomaly Detection: Evaluated route deviation alerts with low false-positive rates (<2.4%) across active tourist corridors.
- Emergency Dispatch Latency: Authority dashboard notification and local responder alert latency reduced to under 1.8 seconds.
- Blockchain Identity Security: Immutable Sepolia Testnet smart contract execution verified 100% resistance against identity tampering and unauthorized credential modification.

INDEX TERMS / KEYWORDS:
Tourist Safety, Artificial Intelligence, Blockchain, Geo-Fencing, Anomaly Detection, Digital Identity, Ethereum Sepolia, Real-Time Incident Response, Smart Tourism`
      },
    ],
    highlights: [
      'Built Travya — a travel safety app with ML risk scoring & Android APK (EDI)',
      'Published research paper on Travya in IEEE format',
      'IoT case study on Smart Agriculture',
      'POCACD — Built DFA/NFA simulators and lexical analyzers',
      'OS Lab — Implemented CPU scheduling algorithms',
    ],
  },
  {
    id: 'sem-5',
    number: 5,
    title: 'Third Year — Semester 1',
    dateRange: 'Jul 2026 – Present',
    sgpa: null,
    status: 'in-progress',
    subjects: [
      { id: 's5-1', name: 'Cloud Computing (CC)', code: 'CC', credits: 4, category: 'theory' },
      { id: 's5-2', name: 'Machine Learning (ML)', code: 'ML', credits: 4, category: 'theory' },
      { id: 's5-3', name: 'Computer Networks Technology Lab (CNT Lab)', code: 'CNT LAB', credits: 2, category: 'lab' },
    ],
    documents: [
      { id: 'd5-1', title: 'CNT Lab — Continuum (This Academic Archive)', type: 'report', semesterId: 'sem-5', subjectName: 'CNT Lab', date: '2026-07-30' },
    ],
    highlights: [
      'Currently building Continuum — this academic archive website (CNT Lab)',
      'Studying Cloud Computing and Machine Learning',
    ],
  },
];

// ─── Projects ───────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'Travya — Travel Safety App',
    description: 'An ML-powered travel safety application that provides real-time risk scoring and safety recommendations for travelers.',
    longDescription: 'Built as an EDI (Entrepreneurship) project in SY Sem 2, Travya uses machine learning models to analyze travel destinations and provide risk assessments. Features include PCA-based risk separation, feature correlation heatmaps, temporal risk analysis, and a score distribution system. Published as a research paper in IEEE format with detailed tables and analysis. Available as an Android APK.',
    techStack: ['Python', 'Machine Learning', 'Android', 'React', 'IEEE Research'],
    semesterNumber: 4,
    status: 'completed',
    imageUrl: '/projects/travya.png',
    date: '2026-05-22',
  },
  {
    id: 'proj-2',
    title: 'Fruit Grading App',
    description: 'An AI and Blockchain-based system for visual quality grading and traceability of apples in supply chains.',
    longDescription: 'Developed as an EDI project in SY Sem 1, this app uses CNN architectures for multi-class classification of fruit quality. Features include an Android app for real-time fruit grading, QR-code based traceability, and blockchain integration for supply chain tracking. Accompanied by a full research paper and literature review. The trained model achieves high accuracy on fruit health classification.',
    techStack: ['Python', 'TensorFlow', 'CNN', 'Android', 'Blockchain', 'ML'],
    semesterNumber: 3,
    status: 'completed',
    imageUrl: '/projects/fruit.png',
    date: '2025-12-01',
  },
  {
    id: 'proj-3',
    title: 'DawaTrack — Medicine Expiry Tracker',
    description: 'A comprehensive medicine expiry tracking application built as the ASEP1 course project with full report and demo videos.',
    longDescription: 'DawaTrack helps users track medicine expiry dates and manage their home pharmacy. Built during FY Sem 1 as the Applied Science Experiential Project, it features medicine logging, expiry reminders, and a clean user interface. The project was extended in Sem 2 with ChatBot integration and IoT sensors for environmental monitoring. A patent document was also filed for this innovation.',
    techStack: ['Python', 'IoT', 'Sensors', 'ChatBot'],
    semesterNumber: 1,
    status: 'completed',
    imageUrl: '/projects/dawatrack.png',
    date: '2024-12-05',
  },
  {
    id: 'proj-4',
    title: 'DawaTrack v2 — With ChatBot & Sensors',
    description: 'Extended version of DawaTrack with IoT sensor integration and an AI chatbot for medicine-related queries.',
    longDescription: 'Built as the ASEP2 project in FY Sem 2, this extended version adds IoT sensor readings for temperature and humidity monitoring of medicine storage, plus an AI chatbot that can answer medicine-related queries. Includes circuit designs, sensor reading demos, and a comprehensive end-semester presentation. A patent was filed based on this work.',
    techStack: ['Python', 'IoT', 'Arduino', 'ChatBot', 'Sensors'],
    semesterNumber: 2,
    status: 'completed',
    imageUrl: '/projects/dawatrack-v2.png',
    date: '2025-05-20',
  },
  {
    id: 'proj-5',
    title: 'Workout Planner — SQL Database App',
    description: 'A workout planning application built with SQL and database management as the DBMS course project.',
    longDescription: 'Developed during SY Sem 1 for the DBMS course, this app features a complete relational database design with ER diagrams, SQL queries for workout routines, exercise tracking, and admin views. Includes normalized database schema, join operations, and data manipulation for managing workout sessions and exercise catalogs.',
    techStack: ['SQL', 'MySQL', 'Database Design', 'ER Modeling'],
    semesterNumber: 3,
    status: 'completed',
    imageUrl: '/projects/workout.png',
    date: '2025-11-01',
  },
  {
    id: 'proj-6',
    title: 'Khel Connect — Sports Platform',
    description: 'A web development project for connecting sports enthusiasts, built with HTML, CSS, JavaScript, and Bootstrap.',
    longDescription: 'Created during FY Sem 2 as part of the Web Development course, Khel Connect is a sports community platform. Built using HTML5, CSS3, JavaScript, jQuery, and Bootstrap with responsive grid layouts. Features include event listings, player profiles, and team management.',
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap'],
    semesterNumber: 2,
    status: 'completed',
    imageUrl: '/projects/khel.png',
    date: '2025-04-15',
  },
  {
    id: 'proj-7',
    title: 'GOV Website — Government Portal',
    description: 'A responsive government website clone built with modern web technologies for the Web Development course.',
    longDescription: 'A government services portal built during FY Sem 2 Web Development course. Features responsive design, Bootstrap grid system, and modern UI patterns for public service delivery. Demonstrates understanding of web accessibility, navigation patterns, and content organization for official websites.',
    techStack: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'],
    semesterNumber: 2,
    status: 'completed',
    imageUrl: '/projects/gov.png',
    date: '2025-04-10',
  },
  {
    id: 'proj-8',
    title: 'Angry Bird Game — Python Clone',
    description: 'A Python-based clone of the popular Angry Birds game, built as a programming project in FY Sem 1.',
    longDescription: 'Developed during FY Sem 1 Python course, this game clone implements physics-based projectile mechanics, collision detection, and level design. Built using Python game libraries with complete game logic including scoring and multiple levels.',
    techStack: ['Python', 'Pygame', 'Game Development'],
    semesterNumber: 1,
    status: 'completed',
    imageUrl: '/projects/angry.png',
    date: '2024-11-15',
  },
  {
    id: 'proj-9',
    title: 'OOP Course Project — Java with JDBC',
    description: 'A Java application with JDBC database connectivity built for the Object-Oriented Programming course.',
    longDescription: 'Built during SY Sem 1, this project demonstrates OOP principles including encapsulation, inheritance, polymorphism, and abstraction with real-world database integration through JDBC. Features clean code architecture with proper class design and database operations.',
    techStack: ['Java', 'JDBC', 'OOP', 'SQL'],
    semesterNumber: 3,
    status: 'completed',
    imageUrl: '/projects/java.png',
    date: '2025-12-05',
  },
  {
    id: 'proj-hack-1',
    title: 'SchemaIQ — Autonomous Database AI Agent',
    description: 'An AI Agent built for CodeApex Hackathon that analyzes multi-table relational databases to generate ER diagrams, data quality profiling, and data dictionaries.',
    longDescription: 'Built during the CodeApex Hackathon, SchemaIQ analyzes complex relational databases (such as the 9-table Olist E-commerce dataset with 100K+ orders). Automatically extracts schema constraints, relationship mappings, missing value ratios, and generates human-readable business context summaries.',
    techStack: ['Python', 'AI Agent', 'SQL', 'LLM', 'SchemaIQ'],
    semesterNumber: 4,
    status: 'completed',
    imageUrl: '/projects/schema.png',
    date: '2026-04-15',
  },
  {
    id: 'proj-hack-2',
    title: 'Barclays Pre-Delinquency Intervention Engine',
    description: 'A financial machine learning model & system architecture built for Barclays Hackathon to forecast early credit default risks.',
    longDescription: 'Developed during Barclays Hackathon, this engine analyzes customer credit attributes and transaction trends using German Credit Data to compute delinquency probabilities before default occurs, enabling proactive risk intervention.',
    techStack: ['Python', 'XGBoost', 'FinTech', 'Machine Learning'],
    semesterNumber: 4,
    status: 'completed',
    imageUrl: '/projects/barclays.png',
    date: '2026-02-19',
  },
  {
    id: 'proj-hack-3',
    title: 'StressSense — Wearable Vital & Stress Monitor',
    description: 'An AI-driven health monitoring solution built during Pragyantra Hackathon for real-time stress detection.',
    longDescription: 'Developed during Pragyantra Hackathon, StressSense uses PPG sensor signals and Heart Rate Variability (HRV) analysis to assess physiological stress levels and deliver automated health alerts.',
    techStack: ['ESP32', 'PPG Sensor', 'Python', 'Machine Learning'],
    semesterNumber: 4,
    status: 'completed',
    imageUrl: '/projects/stress.png',
    date: '2026-04-10',
  },
  {
    id: 'proj-10',
    title: 'Continuum — Academic Archive',
    description: 'This very website — a comprehensive academic archive built with React, TypeScript, and Vite for the CNT Lab.',
    longDescription: 'Built during TY Sem 1 as a Computer Networks Technology Lab project, Continuum is a full-featured academic archive website. It organizes 5 semesters of coursework, 10 projects, 17 certificates, and hundreds of documents into a searchable, beautifully designed web application with dark mode, animations, and responsive design.',
    techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    semesterNumber: 5,
    status: 'in-progress',
    imageUrl: '/projects/continuum.png',
    date: '2026-07-30',
  },
];

// ─── Certificates ───────────────────────────────────────────────────────────

export const certificates: Certificate[] = [
  // FY Sem 1 — SA Certificates
  { id: 'cert-1', title: 'Artificial Intelligence', issuer: 'Skill Academy', date: '2024-10-01', category: 'course' },
  { id: 'cert-2', title: 'AI Tools and ChatGPT Workshop', issuer: 'Workshop', date: '2024-10-15', category: 'workshop' },
  { id: 'cert-3', title: 'Basics of Python', issuer: 'Skill Academy', date: '2024-09-15', category: 'course' },
  { id: 'cert-4', title: 'C Programming', issuer: 'Skill Academy', date: '2024-09-20', category: 'course' },
  { id: 'cert-5', title: 'Data Analysis Using Excel', issuer: 'Skill Academy', date: '2024-10-10', category: 'course' },
  { id: 'cert-6', title: 'Python Programming', issuer: 'Skill Academy', date: '2024-10-20', category: 'course' },
  { id: 'cert-7', title: 'Robotic Courses', issuer: 'Skill Academy', date: '2024-10-25', category: 'course' },
  { id: 'cert-8', title: 'TEDx', issuer: 'TEDx', date: '2024-11-01', category: 'workshop' },
  // FY Sem 2 — Certificates
  { id: 'cert-9', title: 'Artificial Intelligence Foundation', issuer: 'Certification Body', date: '2025-02-01', category: 'certification' },
  { id: 'cert-10', title: 'CSS3', issuer: 'Certification Body', date: '2025-02-15', category: 'course' },
  { id: 'cert-11', title: 'Front End Web Developer', issuer: 'Certification Body', date: '2025-03-01', category: 'certification' },
  { id: 'cert-12', title: 'HTML5', issuer: 'Certification Body', date: '2025-02-10', category: 'course' },
  { id: 'cert-13', title: 'Introduction to Artificial Intelligence', issuer: 'Certification Body', date: '2025-03-10', category: 'course' },
  { id: 'cert-14', title: 'Introduction to Deep Learning', issuer: 'Certification Body', date: '2025-03-15', category: 'course' },
  { id: 'cert-15', title: 'Introduction to Natural Language Processing', issuer: 'Certification Body', date: '2025-03-20', category: 'course' },
  { id: 'cert-16', title: 'JavaScript', issuer: 'Certification Body', date: '2025-02-20', category: 'course' },
  { id: 'cert-17', title: 'IDC Certificate', issuer: 'IDC', date: '2025-04-01', category: 'certification' },
];

// ─── Achievements ───────────────────────────────────────────────────────────

export const achievements: Achievement[] = [
  {
    id: 'ach-hack-1',
    title: 'CodeApex Hackathon — SchemaIQ Database AI Agent',
    organization: 'CodeApex',
    date: '2026-04-15',
    description: 'Built SchemaIQ, an autonomous AI Agent that analyzes multi-table relational databases (9 interlinked tables, 100K+ orders) to generate automated ER relationship mapping, data quality profiling, and human-readable data dictionaries.',
    type: 'hackathon',
    location: 'Pune',
    tags: ['Hackathon', 'AI Agent', 'Databases', 'SchemaIQ'],
  },
  {
    id: 'ach-hack-2',
    title: 'Pragyantra Hackathon — Kaizen & HealthCare Track',
    organization: 'Pragyantra Hackathon',
    date: '2026-04-10',
    description: 'Participated in Pragyantra Hackathon building AI-driven healthcare solutions (DawaTrack & StressSense) for real-time physiological vitals monitoring and stress detection.',
    type: 'hackathon',
    location: 'VIT Pune',
    tags: ['Hackathon', 'Healthcare', 'IoT', 'StressSense'],
  },
  {
    id: 'ach-hack-3',
    title: 'Barclays Hackathon — Pre-Delinquency Intervention Engine',
    organization: 'Barclays',
    date: '2026-02-19',
    description: 'Designed an architecture and ML engine to predict credit attributes and pre-delinquency risk indicators using German Credit Datasets for early financial intervention.',
    type: 'hackathon',
    tags: ['Hackathon', 'FinTech', 'Machine Learning', 'Barclays'],
  },
  {
    id: 'ach-hack-4',
    title: 'Smart India Hackathon (SIH) — AI Mudra Detection & Travya',
    organization: 'Smart India Hackathon (SIH)',
    date: '2025-10-10',
    description: 'Submitted AI Mudra Detection 2.0 and Travya Smart Tourism Safety platform for national-level innovation problem statements.',
    type: 'hackathon',
    tags: ['SIH', 'Hackathon', 'AI', 'Smart Tourism'],
  },
  {
    id: 'ach-hack-5',
    title: 'Tesseract Hackathon — AI Web Applications',
    organization: 'Tesseract',
    date: '2025-11-20',
    description: 'Built real-time web application prototypes using modern web APIs during the Tesseract Hackathon event.',
    type: 'hackathon',
    tags: ['Hackathon', 'Web Development'],
  },
  {
    id: 'ach-1',
    title: 'DawaTrack Patent Filing',
    organization: 'VIT Pune',
    date: '2025-04-10',
    description: 'Filed a patent for DawaTrack — an innovative medicine expiry tracking system with IoT sensor integration and AI chatbot capabilities. Developed across ASEP1 and ASEP2 projects.',
    type: 'award',
    location: 'VIT Pune',
    tags: ['Patent', 'IoT', 'Innovation'],
  },
  {
    id: 'ach-2',
    title: 'Travya — IEEE Research Paper',
    organization: 'VIT Pune — EDI Course',
    date: '2026-05-22',
    description: 'Authored an IEEE-format research paper on Travya, an ML-powered travel safety application. The paper covers risk scoring algorithms, PCA-based analysis, and real-time safety recommendations.',
    type: 'publication',
    tags: ['Machine Learning', 'Research', 'IEEE'],
  },
  {
    id: 'ach-3',
    title: 'Fruit Grading App — ML Android Application',
    organization: 'VIT Pune — EDI Course',
    date: '2025-12-01',
    description: 'Developed and deployed an AI-powered fruit quality grading Android application using CNN architectures. Built with blockchain integration for supply chain traceability. Published complete APK.',
    type: 'award',
    location: 'VIT Pune',
    tags: ['CNN', 'Android', 'Blockchain'],
  },
  {
    id: 'ach-4',
    title: 'TEDx Event — Attendee',
    organization: 'TEDx',
    date: '2024-11-01',
    description: 'Attended TEDx event during the first year, gaining exposure to innovative ideas and thought leadership across technology and entrepreneurship.',
    type: 'certification',
    location: 'VIT Pune',
    tags: ['TEDx', 'Event'],
  },
  {
    id: 'ach-5',
    title: 'Basketball 3-Pointer Sport Event',
    organization: 'VIT Pune Sports',
    date: '2025-09-15',
    description: 'Participated in the Basketball 3-Pointer Sport event during SY Sem 1, representing the department in inter-college sports activities.',
    type: 'award',
    location: 'VIT Pune',
    tags: ['Sports', 'Basketball'],
  },
  {
    id: 'ach-6',
    title: '17 Certifications in AI, Web Dev & Programming',
    organization: 'Various Platforms',
    date: '2025-03-20',
    description: 'Earned 17 professional certifications spanning Artificial Intelligence, Python, C Programming, Web Development (HTML5, CSS3, JavaScript), Deep Learning, NLP, and Robotics across the first two semesters.',
    type: 'certification',
    tags: ['AI', 'Web Development', 'Python'],
  },
  {
    id: 'ach-7',
    title: 'AMCAT RAD Assessment',
    organization: 'AMCAT',
    date: '2024-12-01',
    description: 'Completed the AMCAT Readiness Assessment and Diagnostic test during FY Sem 1 to evaluate aptitude, logical reasoning, and programming skills.',
    type: 'certification',
    location: 'VIT Pune',
    tags: ['Assessment', 'Aptitude'],
  },
];

// ─── Gallery ────────────────────────────────────────────────────────────────

export const galleryItems: GalleryItem[] = [
  { id: 'gal-1', title: 'CodeApex Hackathon — SchemaIQ Presentation', semester: 4, date: '2026-04-15', location: 'VIT Pune', imageUrl: '/gallery/codeapex.jpeg', category: 'hackathon' },
  { id: 'gal-2', title: 'CodeApex Hackathon — Team Building & Coding Session', semester: 4, date: '2026-04-15', location: 'VIT Pune', imageUrl: '/gallery/codeapex2.jpeg', category: 'hackathon' },
  { id: 'gal-3', title: 'GP2 Team Building Activity', semester: 2, date: '2025-04-12', location: 'VIT Pune', imageUrl: '/gallery/team-building.jpg', category: 'team' },
  { id: 'gal-4', title: 'Travya App & IEEE Research Presentation', semester: 4, date: '2026-05-22', location: 'VIT Pune', imageUrl: '/gallery/travya.jpg', category: 'project' },
  { id: 'gal-5', title: 'Fruit Grading App Demo & CNN Model', semester: 3, date: '2025-12-01', location: 'VIT Pune', imageUrl: '/projects/fruit.png', category: 'project' },
  { id: 'gal-6', title: 'DawaTrack IoT Sensor Circuit & Medicine Tracking', semester: 2, date: '2025-05-20', location: 'ASEP2 Lab', imageUrl: '/projects/dawatrack-v2.png', category: 'project' },
  { id: 'gal-7', title: 'Barclays Hackathon — Pre-Delinquency ML Model', semester: 4, date: '2026-02-19', location: 'VIT Pune', imageUrl: '/projects/barclays.png', category: 'hackathon' },
  { id: 'gal-8', title: 'StressSense Vital & Stress Monitor Demo', semester: 4, date: '2026-04-10', location: 'Pragyantra Hackathon', imageUrl: '/projects/stress.png', category: 'hackathon' },
  { id: 'gal-9', title: 'SchemaIQ Database Agent Architecture', semester: 4, date: '2026-04-15', location: 'CodeApex Hackathon', imageUrl: '/projects/schema.png', category: 'hackathon' },
];

// ─── Convenience: all documents flattened ───────────────────────────────────

export const allDocuments: Document[] = semesters.flatMap((s) => s.documents);
