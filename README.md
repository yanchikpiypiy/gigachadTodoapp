# **To-Do App with FastAPI, Celery, Docker, React and JWT Authentication**

## **Overview**
This project is a **To-Do List application** built with **FastAPI, Celery, Docker, JWT authentication, PostgreSQL (via SQLAlchemy), and React**. It supports user authentication, task management, and scheduled reminders using Celery and Flower for task monitoring. The entire application is containerized using Docker with six services.

---

## **Tech Stack**

### **Backend**
- [FastAPI](https://fastapi.tiangolo.com/) – High-performance Python web framework
- [JWT Authentication](https://jwt.io/) – Secure user authentication
- [SQLAlchemy](https://www.sqlalchemy.org/) – ORM for database interactions
- [Celery](https://docs.celeryq.dev/en/stable/) – Task queue for background task processing
- [Flower](https://flower.readthedocs.io/en/latest/) – Celery task monitoring tool
- [Redis](https://redis.io/) – Message broker for Celery
- [PostgreSQL](https://www.postgresql.org/) – Relational database

### **Frontend**
- [React](https://reactjs.org/) – Modern JavaScript library for UI development
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [FastAPI Frontend Integration](https://fastapi.tiangolo.com/advanced/frontend/) – Integration with backend APIs

### **Containerization & Deployment**
- [Docker](https://www.docker.com/) – Containerized development and deployment
- [Docker Compose](https://docs.docker.com/compose/) – Multi-container orchestration

---

## **System Architecture**
The application is composed of **seven Docker containers**:

1. **FastAPI Backend** – Handles API requests
2. **React Frontend** – Provides the UI for users
3. **PostgreSQL** – Stores users and tasks
4. **Redis** – Message broker for Celery tasks
5. **Celery Worker** – Handles background tasks like reminders
6. **Celery Beat** – Schedules periodic tasks
7. **Flower** – Monitors Celery tasks

---

## **Installation & Setup**

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

### **2. Set Up Environment Variables**
Create a `.env` file in the root directory and add:
```env
DB_HOST=db
DB_PORT=5432
DB_NAME=Todo
DB_USER=postgres
DB_PASS=admin
DATABASE_URL=postgresql+psycopg2://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}
SECRET_KEY= "your Open ssl rand -32 key"
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_FROM=keek88025@gmail.com
EMAIL_USERNAME=keek88025@gmail.com
EMAIL_PASSWORD= "key generated for your app at google"
```

### **3. Start the Application using Docker Compose**
```bash
docker-compose up --build
```
This will build and run all containers defined in the `docker-compose.yml` file.

### **4. Access the Application**
- **Frontend (React UI):** `http://localhost:3000`
- **Backend API (FastAPI docs):** `http://localhost:8000/docs`
- **Flower (Celery Monitoring):** `http://localhost:5556`

---

## **Backend API Endpoints**
### **Authentication**
- `POST /auth/register` – Register a new user
- `POST /auth/token` – Obtain an access token
- `GET /auth/user` – Get current authenticated user details

### **To-Do Management**
- `POST /todo` – Create a new task
- `GET /todo/todos` – Retrieve all tasks for the user
- `DELETE /todo/{todo_id}` – Delete a task

### **Task Scheduling & Celery**
- `GET /todo/task-status/{task_id}` – Check the status of a scheduled task
- `DELETE /todo/tasks/{task_id}` – Cancel a scheduled task

---
## **Backend Setup (Optional, for Development Without Docker)**
**Note:** *MAKE SURE TO CHANGE* `uvicorn.run` *command in* `main.py` *before running. Please also ensure you are using the correct database host in .env file (`db` if using Docker or `localhost` otherwise).*
```bash
python app/main.py --webserver
```
## **Frontend Setup (Optional, for Development Without Docker)**
```bash
cd frontend
npm install
npm start
```
The frontend will be available at `http://localhost:3000`.

---

## **Testing**
Run tests for the backend with:
```bash
docker-compose exec backend pytest
```
Run frontend tests with:
```bash
cd frontend
npm test
```

---

## **Troubleshooting**
- If the database doesn’t start, try restarting the container:
  ```bash
  docker-compose restart postgres
  ```
- If Celery isn’t processing tasks, restart it:
  ```bash
  docker-compose restart worker
  ```
- If Flower is not accessible:
  ```bash
  docker-compose restart flower
  ```

---

## **Contributing**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Added new feature'`)
4. Push the branch (`git push origin feature-name`)
5. Create a Pull Request

---

## **License**
This project is licensed under the MIT License.

---

## **Author**
Developed by **[Your Name]** – [yourwebsite.com](https://yourwebsite.com)

---

