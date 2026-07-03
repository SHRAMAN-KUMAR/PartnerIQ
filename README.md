# PartnerIQ

PartnerIQ is an AI-powered company intelligence and partnership readiness platform. It uses Google's Gemini LLM (with live Google Search capabilities) to deeply analyze a target company, scrape its website, and generate a comprehensive assessment of its business profile, key strengths, and partnership opportunities.

## Capabilities

* **Automated Company Profiling**: Input any company name (and optional website URL), and PartnerIQ will scrape the site and synthesize data into a structured profile.
* **Partnership Readiness Scoring**: Uses AI to evaluate and score how ready or viable a company is for a strategic partnership, providing specific strengths, risks, and recommendations.
* **Intelligent Dashboard**: A modern React (Vite) frontend with TailwindCSS to view past reports, analyze new companies, and navigate findings easily.
* **PDF Exporting**: Instantly generate and download beautifully formatted PDF reports for any analyzed company.
* **Data Persistence**: All reports are safely stored locally via a FastAPI backend using SQLite and SQLModel.

---

## Tech Stack

* **Frontend**: React 19, Vite, TailwindCSS, Axios, React Router.
* **Backend**: FastAPI, SQLModel (SQLite), Uvicorn.
* **AI & Scraping**: `google-genai` SDK (Gemini 2.5 Flash), BeautifulSoup4, httpx.
* **Document Generation**: ReportLab (PDFs), Markdown.

---

## How to Run Locally (Cloning the Repo)

### 1. Clone the Repository
```bash
git clone https://github.com/SHRAMAN-KUMAR/PartnerIQ.git
cd PartnerIQ
```

### 2. Setup the Backend
Open a terminal and navigate to the `backend` folder:
```bash
cd backend
```
Create a virtual environment and activate it:
```bash
python -m venv .venv

# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```
Install the Python dependencies:
```bash
pip install -r requirements.txt
```
Configure your environment variables:
1. Copy `.env.example` to a new file named `.env`.
2. Add your Google Gemini API key inside the `.env` file:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
Start the backend server:
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*(The API documentation will be available at `http://127.0.0.1:8000/docs`)*

### 3. Setup the Frontend
Open a **new** terminal window and navigate to the `frontend` folder:
```bash
cd frontend
```
Install the Node dependencies:
```bash
npm install
```
Start the frontend development server:
```bash
npm run dev
```
*(The frontend will be available at `http://localhost:5173`)*

---

## How to Run via GitHub Codespaces (Browser)

If you don't want to run the project locally on your machine, you can spin it up entirely in the cloud using GitHub Codespaces.

1. Go to the [PartnerIQ GitHub Repository](https://github.com/SHRAMAN-KUMAR/PartnerIQ).
2. Click the green **`<> Code`** button.
3. Switch to the **Codespaces** tab and click **Create codespace on main**.
4. Once the environment loads, open the terminal. 
5. Add your `GEMINI_API_KEY` to your environment by running:
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```
6. Open two separate terminal instances in your Codespace:
   - **Terminal 1 (Backend):** `cd backend && pip install -r requirements.txt && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000`
   - **Terminal 2 (Frontend):** `cd frontend && npm install && npm run dev`
7. GitHub Codespaces will automatically forward ports `8000` and `5173`. Click the forwarded local links in the "Ports" tab to view the app!

---

## Security Note
* Do not commit your `.env` file or hardcode your `GEMINI_API_KEY` into the source code. GitHub Push Protection is enabled.
