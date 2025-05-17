# Check-in Tracker System

This is a cloud-native web application built with Node.js, MongoDB, and vanilla HTML/CSS/JavaScript. It helps users set personal goals, check in daily, view progress, and visualize statistics. The system is fully deployed on Google Cloud Platform (GCP) using Docker and Kubernetes.

---

##  Features

- ✅ User authentication (register / login / logout)  
- ✅ Goal management (create / delete / list goals)  
- ✅ Daily check-in with duplicate prevention  
- ✅ Progress visualization using Chart.js  
- ✅ Daily streak and goal completion rate statistics  
- ✅ **Leaderboard: display top 5 users ranked by check-in count**  
- ✅ Profile management and editable settings page  

---

## ⚙️ Tech Stack

- **Backend**: Node.js + Express  
- **Frontend**: HTML5 + CSS3 + JavaScript  
- **Database**: MongoDB Atlas  
- **Charts**: Chart.js  
- **Cloud Platform**: Google Cloud Platform (GCP)  
- **Containerization**: Docker  
- **Orchestration**: Kubernetes (GKE)  
- **Observability**: Cloud Logging + Monitoring  

---

## ☁️ Cloud Deployment (GCP)

Tools and Services Used
- **Node.js 18**
- **Docker + Docker Hub**
- **GCP Cloud Shell**
- **GCP Kubernetes Engine (GKE)**
- **MongoDB Atlas (hosted database)**
- **Cloud Logging + Monitoring**

---

## 🚀 Deployment Steps

1. Build Docker image locally
docker build -t checkin-system .

2. Tag the image for Docker Hub
docker tag checkin-system ygyunge/checkin-system

3. Push the image to Docker Hub
docker push ygyunge/checkin-system

4. Create Kubernetes secret for environment variables
kubectl create secret generic checkin-secrets \
  --from-literal=MONGODB_URI="mongo-uri" \
  --from-literal=SESSION_SECRET="secret"

5. Apply the Kubernetes deployment and service definition
kubectl apply -f deployment.yaml

6. Restart deployment to apply image and secret changes
kubectl rollout restart deployment checkin-system

7. Get external IP address for accessing the app
kubectl get service

