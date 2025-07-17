FROM python:3.13-alpine

WORKDIR /App

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY /backend /App

# Expose the port the app runs on
EXPOSE 5000

# Command to run the FastAPI application with uvicorn supervision for hot reloading
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000", "--reload", "--reload-exclude", "'/App/__pycache__/'"]
#CMD ["sh", "-c", "python /App/init_admin.py && uvicorn main:app --host 0.0.0.0 --port 5000 --reload --reload-exclude '/App/__pycache__/'" ]
CMD ["sh", "-c", "alembic upgrade head && python /App/init_admin.py && uvicorn main:app --host 0.0.0.0 --port 5000 --reload"]
