FROM python:3.11-slim

# These env variables are declared to prevent .pyc files and output buffer
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory in container
WORKDIR /app

# Install sys dependencies
# libmagic1 is needed for python-magic and unstructured (our project relies on it heavily for file type detection and content extraction)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

# Copy the requirements into the container....assuming Docker build context is the root dir
COPY requirements.txt .

# Install python dependencies
# RUN pip install --no-cache-dir --use-deprecated=legacy-resolver -r requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend into  container
COPY ./backend /app/backend

# Expose the port the FastAPI application runs on
EXPOSE 8000

# Runn the server
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
