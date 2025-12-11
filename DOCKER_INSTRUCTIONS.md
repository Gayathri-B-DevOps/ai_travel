# How to Push to Docker Hub

## Prerequisites
1. Create an account on [Docker Hub](https://hub.docker.com/).
2. Install Docker Desktop.
3. **Install Ollama**: Users must have [Ollama](https://ollama.com/) installed and running on their machine.
4. **Pull the Model**: The app uses `gemma2:2b`. Run this command:
   ```bash
   ollama pull gemma2:2b
   ```

## Steps

### 1. Login to Docker
Open your terminal and run:
```bash
docker login
```
Enter your Docker Hub username and password.

### 2. Build the Image
```bash
docker build -t kavinvictor1/ai-traveller:latest .
```

### 3. Push to Docker Hub
```bash
docker push kavinvictor1/ai-traveller:latest
```


## 🚀 How Your Colleague Can Run It

Send these instructions to your colleague. They do **not** need to clone the repo or install Node.js.

### 1. Install Prerequisites
- **Docker Desktop**: [Download & Install](https://www.docker.com/products/docker-desktop/)
- **Ollama**: [Download & Install](https://ollama.com/)

### 2. Prepare AI Model
Open a terminal (Command Prompt or PowerShell) and run:
```bash
ollama pull gemma2:2b
```
*Keep Ollama running in the background.*

### 3. Run the App
Run this single command in their terminal:

```bash
docker run -p 8080:80 --add-host=host.docker.internal:host-gateway kavinvictor1/ai-traveller:latest
```

### 4. Open in Browser
Go to [http://localhost:8080](http://localhost:8080) to use the app.
