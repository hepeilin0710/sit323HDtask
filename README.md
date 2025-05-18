# Check-in Tracker System

This is a cloud-native web application built with Node.js, MongoDB, and vanilla HTML/CSS/JavaScript. It helps users set personal goals, check in daily, view progress, and visualize statistics. The system is fully deployed on Google Cloud Platform (GCP) using Docker and Kubernetes.

---

##  Features

- ✅ User authentication (register / login / logout)
  ![image](https://github.com/user-attachments/assets/fc7c872b-f1e5-4ce8-b42a-6778be1f1a5f)
  <img width="1176" alt="image" src="https://github.com/user-attachments/assets/dac55edf-4c12-4ee1-aa4c-21f950b66b9b" />
- ✅ Goal management (create / delete / list goals)
<img width="1173" alt="image" src="https://github.com/user-attachments/assets/3dba4b49-4446-4aa9-8167-cf1b9722b77c" />
- ✅ Daily check-in 
  <img width="1177" alt="image" src="https://github.com/user-attachments/assets/1cdb77ed-9ca6-41b6-8101-0b7ea765550d" />
- ✅ Progress visualization using Chart.js
  <img width="1256" alt="image" src="https://github.com/user-attachments/assets/c55f1b0c-c890-43bf-afdf-42775a17db7d" />
- ✅ Daily streak and goal completion rate statistics
  <img width="1191" alt="image" src="https://github.com/user-attachments/assets/1ed46ed0-b5b6-432c-b910-f7b7d781456d" />
- ✅ **Leaderboard: display top 5 users ranked by check-in count**
  <img width="893" alt="image" src="https://github.com/user-attachments/assets/ed593a9e-8569-47f2-b0a0-d00cdc6c7739" />
- ✅ Profile management and editable settings page  
  <img width="860" alt="image" src="https://github.com/user-attachments/assets/046523b6-77cb-45e5-a3f7-6d09b3bd4fef" />

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

