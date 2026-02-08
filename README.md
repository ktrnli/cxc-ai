# Maestro

A one-liner that I willl come up with later.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Backend (Python Flask)](#backend-python-flask)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Maestro is an educative and creatively designed web app that is designed for music students to leverage as a tool for self-practice. The front-end of our project is built with React, Electron, and FigmaMake, while the backend of our project uses PythonFlask and CREPE. CREPE is a deep-learning based AI pitch detection model that is used to estimate the frequency of audio input, enabling for accurate real-time note detection and pitch feedback for music practice.

---

## Features

- Structured practice sessions with AI-powered pitch detection
- Live audio processing for immediate feedback on accuracy of pitch, notes, and total degree of offset
- Audio-reactive visual background for enhanced engagement
- Uploading student sheet music so that practice sessions are relevant to student progress

---

## Tech Stack

- **Frontend:** React, Electron, FigmaMake 
- **Backend:** Python, Flask, CREPE
- **AI:** CREPE for audio capture and processing 
- **Other:** Python virtual environment for backend dependencies

---

## Setup Instructions

### Backend (Python Flask)

1. Install Python (>=3.8 recommended)  
2. Create and activate a virtual environment:

   ```bash
   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate

   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
   
3. Install required packages:

   ```bash
   pip install flask flask-cors python-dotenv crepe
   ```

4. Run the Flask backend:

  ```bash
  python app.py
 ```

### Frontend (React + Vite)

1. Install Node.js (>=16 recommended)  
2. Install project dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm start
   ```
4. In another terminal:

   ```bash
   npm run electron
   ```

## Usage
