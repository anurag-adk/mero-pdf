# Setup Guide

This guide will help you set up the **mero_pdf** project on your local machine.

## Prerequisites

- **Python 3.12** or higher
- **Git**
- **pip** (Python package manager)

---

## 🐧 Linux Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mero_pdf
```

### 2. Create a Virtual Environment

```bash
cd backend
python3 -m venv venv
```

### 3. Activate the Virtual Environment

```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

Or using `pyproject.toml`:

```bash
pip install .
```

### 5. Run the Application

```bash
python main.py
```

### 6. Deactivate the Virtual Environment (when done)

```bash
deactivate
```

---

## 🪟 Windows Setup

### 1. Clone the Repository

```powershell
git clone <repository-url>
cd mero_pdf
```

### 2. Create a Virtual Environment

```powershell
cd backend
python -m venv venv
```

### 3. Activate the Virtual Environment

**Command Prompt:**
```cmd
venv\Scripts\activate.bat
```

**PowerShell:**
```powershell
venv\Scripts\Activate.ps1
```

> **Note:** If you encounter an execution policy error in PowerShell, run:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### 4. Install Dependencies

```powershell
pip install -r requirements.txt
```

Or using `pyproject.toml`:

```powershell
pip install .
```

### 5. Run the Application

```powershell
python main.py
```

### 6. Deactivate the Virtual Environment (when done)

```powershell
deactivate
```

---

## 📦 Dependencies

| Package | Description |
|---------|-------------|
| `langchain-community` | LangChain community integrations for RAG |
| `pypdf` | PDF parsing and text extraction |

---

## 📁 Project Structure

```
mero_pdf/
├── README.md
├── SETUP.md
├── backend/
│   ├── main.py
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── data/
│   └── notebooks/
│       └── mero_pdf.ipynb
└── frontend/
```

---

## 🛠️ Troubleshooting

### Python version issues

Make sure you have Python 3.12+ installed:

**Linux:**
```bash
python3 --version
```

**Windows:**
```powershell
python --version
```

### Virtual environment not activating

- **Linux:** Ensure you're using `source` command
- **Windows PowerShell:** Check execution policy (see note above)

### Package installation fails

Try upgrading pip first:

```bash
pip install --upgrade pip
```

---

## 📝 Notes

- Place your PDF files in the `backend/data/` directory for processing
- The Jupyter notebook `mero_pdf.ipynb` can be used for experimentation

---

## Need Help?

If you encounter any issues, please reach out to the team or create an issue in the repository.
