FROM python:3.11-slim AS builder

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

RUN pip install --no-cache-dir --upgrade pip

# Copy the production requirements into the builder stage
COPY requirements.prod.txt .

# Install python dependencies in an isolated environment
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.prod.txt

FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/opt/venv/bin:$PATH

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend into  container
COPY --from=builder /opt/venv /opt/venv
COPY ./backend /app/backend

# Expose the port the FastAPI application runs on
EXPOSE 8000

# Runn the server
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
