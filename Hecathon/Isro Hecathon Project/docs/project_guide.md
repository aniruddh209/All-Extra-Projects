# 🛰️ UrbanHeat AI — Comprehensive Developer & Architecture Guide

Welcome to the **UrbanHeat AI** system guide. This document explains the architecture, database strategy, and a step-by-step breakdown of how the platform is designed and implemented.

---

## 💾 1. Database Architecture & Storage Strategy
Unlike typical database-driven web applications (which rely on external relational or non-relational database engines like PostgreSQL, MySQL, or MongoDB), **UrbanHeat AI** employs a **high-performance, hybrid file-based and in-memory data architecture**. 

This design choice was made to:
1. **Optimize GIS Remote Sensing Workflows**: Spatial datasets (satellite readouts from Google Earth Engine) are best represented and processed as flat tables (`.csv` files) using optimized vector math libraries (NumPy, pandas).
2. **Minimize Latency**: The Node.js Gateway serves city coordinates and baseline statistics directly from a pre-compiled JSON registry kept in-memory.
3. **Simplify Deployment**: By removing the need for a separate database container, the platform is lightweight, portable, and easily deployable in secure ISRO sandbox environments.

### Data Storage Breakdown:
* **Satellite Ground Truth (CSV Datasets)**: Located in the `dataset/` directory. These files (e.g., `india_cities_dataset_2021_2025_merged.csv`) act as the primary historical truth. They contain coordinates, NDVI, NDBI, NDWI, Elevation, and Land Surface Temperature (LST).
* **City Registry (In-Memory JSON)**: Located in `backend/data/citiesData.js`. This is the canonical registry of 100+ major Indian cities containing static demographics (population, area) and pre-calculated baseline indices.
* **Cache Storage (RAM-based Node-Cache)**: Used in the backend to cache API calls from OpenWeatherMap (TTL of 900 seconds) to prevent API rate limiting and speed up weather overlays.
* **Model Artifacts (Serialized Joblib)**: Located in `ml-engine/models/`. The trained ML models, scalers, and label encoders are stored as binary payloads.

---

## 🏗️ 2. Step-by-Step Implementation Flow

### STEP 1: Satellite Data Collection (Google Earth Engine)
1. **Sensor Ingestion**: Retrieve Landsat-8/9 and Sentinel-2 satellite data for Indian cities.
2. **Spectral Band Extraction**:
   * **NDVI (Normalized Difference Vegetation Index)**: Formulated as $\frac{NIR - Red}{NIR + Red}$ to measure vegetation cover.
   * **NDBI (Normalized Difference Built-up Index)**: Formulated as $\frac{SWIR - NIR}{SWIR + NIR}$ to identify built-up areas.
   * **NDWI (Normalized Difference Water Index)**: Formulated as $\frac{Green - NIR}{Green + NIR}$ to detect water bodies.
3. **LST Retrieval**: Retrieve Thermal Infrared Sensor (TIRS) bands to estimate Land Surface Temperature in °C.
4. **Export CSVs**: Output spatial data containing columns: `City, State, Latitude, Longitude, Year, Month, NDVI, NDBI, NDWI, Elevation, LST`.

---

### STEP 2: Data Quality & Preprocessing
To prepare the raw datasets for model training, a robust preprocessing pipeline is executed:
1. **Deduplication**: Drop rows containing identical coordinates and timestamps.
2. **Type Coercion**: Ensure float representation for spectral bands (`NDVI`, `NDBI`, `NDWI`) and integer for geographical fields.
3. **Categorical Standardization**: Standardize Month and State names (e.g., fixing casing and typos).
4. **Missing Value Imputation**: Fill missing indices using spatial interpolation (KNN Imputer) or temporal interpolation based on historical values for that city.
5. **Outlier Mitigation**: Detect and trim extreme LST values or coordinates beyond India’s bounding box using IQR (Interquartile Range).
6. **Output generation**: Export the clean dataset as `dataset/processed/master_dataset.csv`.

---

### STEP 3: Advanced Feature Engineering
To improve LST prediction accuracy, we engineer high-level indices:
* **Built-up Density**: Derived from NDBI to isolate high-concentration urban spots.
* **Green Cover Score**: Derived from NDVI to represent canopy-based cooling capacity.
* **Water Influence Score**: Derived from NDWI and proximity to measure surface cooling.
* **Urban Density Score**: Combining high NDBI and low NDVI to capture concrete-jungle characteristics.
* **Vegetation Ratio**: Ratio of NDVI to NDBI to highlight vegetative vs built-up balance.
* **Heat Vulnerability Index (HVI)**: A combination of high LST, low green cover, and high building density.
* **Spatial Temperature Neighborhoods**: Calculates the mean surrounding temperatures based on K-Nearest Neighbors (KNN) to capture localized urban heat islands.

---

### STEP 4: Machine Learning Model Training (ml-engine)
1. **Target**: Predict LST (°C).
2. **Model Selection**: Train multiple algorithms:
   * **XGBoost** (Primary Model)
   * LightGBM
   * CatBoost
   * Random Forest
   * Gradient Boosting Regressor
3. **Cross-Validation**: Apply 5-Fold Cross-Validation to evaluate generalizeability.
4. **Hyperparameter Tuning**: Optimize learning rate, max depth, estimators, and regularization parameters using Optuna or GridSearch.
5. **Explainability**: Compute SHAP values to explain the impact of features like built-up density and vegetation on prediction results.
6. **Serialization**: Save the best model, scaler, and pipeline objects to `ml-engine/models/`.

---

### STEP 5: Express API Gateway Integration (backend)
The backend routes requests from the frontend and communicates with the ML engine:
1. **Server Setup**: `server.js` starts an Express app listening on port 3001.
2. **Auth Service (`/auth`)**: Handles JWT-based authentication for planners.
3. **Cities API (`/cities`)**: Queries the in-memory `citiesData.js` database.
4. **Weather API (`/weather`)**: Integrates OpenWeatherMap to pull live temperature and AQI, with a local cache fallback.
5. **ML Proxy (`/ml/*`)**: Acts as a middleware proxy, translating frontend payloads and invoking the Python FastAPI endpoints.

---

### STEP 6: FastAPI ML Services (ml-engine)
The FastAPI application (`app/main.py` on port 8000) exposes analytical endpoints:
* **`POST /api/v1/ml/predict/`**: Takes spectral variables and returns predicted LST.
* **`POST /api/v1/ml/hotspots/`**: Uses spatial coordinates and DBSCAN clustering to group high-LST areas into active "Urban Heat Islands".
* **`POST /api/v1/ml/explain/`**: Explains model decisions using SHAP impact vectors.
* **`POST /api/v1/ml/simulate/`**: Run simulations of interventions (e.g. increase NDVI by 20%, cool temperature reduction outcome).

---

### STEP 7: Interactive Dashboard Frontend (frontend)
Built using React 19 + TypeScript + Vite + Tailwind CSS v4:
1. **Visual Theme**: An ISRO/NASA-inspired dark theme using glassmorphism components (`backdrop-blur`).
2. **Geospatial Mapping (Leaflet)**: Renders dynamic map layers showing heat islands, NDVI vegetation, and risk zones.
3. **Analytics (Recharts)**: Shows monthly cooling trends, UHI comparison charts, and historical LST shifts.
4. **Mitigation Engine UI**: Interactive cooling simulator where planners can run "What-If" scenarios (e.g., planting trees, adding green roofs) to see estimated temperature reductions and budgets.
5. **Climate Chatbot**: Embedded React component communicating with backend OpenAI/LLM assistant pipelines, providing instant ground-truth information on urban heat.

---

## 🛠️ How to Run the Project Locally
Ensure you have Node.js (v18+) and Python (v3.10+) installed.

### 1. Run the Backend API Gateway
```bash
cd backend
npm install
npm run dev
```

### 2. Run the Machine Learning Engine
```bash
cd ml-engine
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host localhost --port 8000 --reload
```

### 3. Run the Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
