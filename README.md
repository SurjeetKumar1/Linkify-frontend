<div align="center">
<h1 style="color: red;"><strong>NOTE: Backend Repository</strong></h1>
<p><strong>The backend code for this application is in a separate repository. You can find it here:<br><a href="https://github.com/SurjeetKumar1/Linkify-Backend">https://github.com/SurjeetKumar1/Linkify-Backend</a></strong></p>
</div>

---

# **Frontend CI/CD Pipeline: AWS EC2 & GitHub Actions 🎨**

<p align="center">
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/scrole1.png" alt="Application Screenshot" width="75%"/>
</p>

This repository contains the complete setup for an automated **CI/CD** (Continuous Integration/Continuous Deployment) pipeline for a modern Next.js frontend. The pipeline uses **GitHub Actions** to automatically build and deploy the project to an **AWS EC2 instance**, where it is run by **PM2** and served to users by **Nginx**.

---

## **Table of Contents**

- [Features](#features-)
- [Architecture Overview](#architecture-overview-)
- [Technology Stack](#technology-stack-)
- [Setup Instructions](#setup-instructions-)
  - [1. AWS EC2 Instance Setup](#1-aws-ec2-instance-setup-)
  - [2. GitHub Actions Self-Hosted Runner](#2-github-actions-self-hosted-runner-setup-)
  - [3. GitHub Actions Workflow](#3-github-actions-workflow-configuration-)
  - [4. Nginx Configuration](#4-nginx-configuration-)
- [Verification & Application Preview](#verification--application-preview-)

---

## **Features ✨**

- **Automated Deployments:** Every push to the `main` branch automatically builds and deploys the latest version.
- **High Availability:** A PM2 process manager keeps the Next.js server running, and Nginx acts as a robust reverse proxy.
- **Scalable Foundation:** Built on AWS EC2, providing a reliable hosting environment.
- **Secure & Isolated:** Uses a dedicated self-hosted runner for a secure link between GitHub and AWS, isolating frontend and backend processes.

---

## **Architecture Overview 🏗️**

1.  A developer pushes code to the `main` branch on GitHub.
2.  The push triggers a GitHub Actions workflow.
3.  The job is sent to a dedicated self-hosted runner on the AWS EC2 instance.
4.  The runner checks out the code, installs dependencies (`npm ci`), and runs the production build (`npm run build`).
5.  The workflow then uses PM2 to restart the Next.js server, loading the new build.
6.  Nginx, listening on port 80, forwards all incoming traffic to the PM2 process running on port 3000.

---

## **Technology Stack 💻**

-   **Cloud Provider:** **Amazon Web Services (AWS)**
-   **CI/CD:** **GitHub Actions**
-   **Compute:** **AWS EC2**
-   **Framework:** **Next.js**
-   **Process Manager:** **PM2**
-   **Web Server / Reverse Proxy:** **Nginx**
-   **Operating System:** **Ubuntu**

---

## **Setup Instructions 🛠️**

Follow these steps to configure the CI/CD pipeline.

### **1. AWS EC2 Instance Setup ☁️**

Ensure your cloud server is ready. You can use the same instance as your backend.


<p align="center">
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/linkify-machine.png" alt="EC2 Machine Details" width="70%"/>
  <br/><br/>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/port-frontend.png" alt="Security Group Ports" width="70%"/>
</p>

1.  **Prerequisites:** Connect to your EC2 instance via SSH.
2.  **Required Software:** Confirm that Node.js, npm, PM2, and Nginx are installed.
    ```bash
    node -v && npm -v && pm2 -v && nginx -v
    ```
3.  **Security Group:** Verify your instance's security group allows inbound traffic on **Port 80 (HTTP)** and **Port 22 (SSH)**.

### **2. GitHub Actions Self-Hosted Runner Setup 🏃‍♀️**

Create a dedicated runner for the frontend repository.

1.  In your frontend GitHub repo, go to **Settings > Actions > Runners**.
2.  Click **"New self-hosted runner"** and select **Linux**.
3.  On your EC2 instance, create a **separate directory** (e.g., `frontend-runner`) and follow the commands provided by GitHub to install and run the runner as a service.

    ```bash
    # Create a separate folder to avoid conflicts
    mkdir frontend-runner && cd frontend-runner

    # Download, configure, and install the runner
    # (Follow the commands exactly as shown on your GitHub settings page)
    curl -o actions-runner.tar.gz -L "URL_FROM_GITHUB"
    tar xzf ./actions-runner.tar.gz
    ./config.sh --url "REPO_URL" --token "YOUR_TOKEN"
    sudo ./svc.sh install
    sudo ./svc.sh start
    ```

### **3. GitHub Actions Workflow Configuration ⚙️**

This workflow automates the build and restart process on the server.

1.  In your repository, create the file `.github/workflows/cicd.yml`.
2.  Paste the following configuration. This script builds the Next.js app and restarts the PM2 process.

    ```yaml
    name: Linkify Frontend Workflow

    on:
      push:
        branches: [ "main" ]

    jobs:
      build-and-deploy:
        runs-on: self-hosted

        steps:
          - name: Checkout Code
            uses: actions/checkout@v4

          - name: Setup Node.js
            uses: actions/setup-node@v4
            with:
              node-version: '20.x' # Use a specific LTS version
              cache: 'npm'

          - name: Install Dependencies
            run: npm ci

          - name: Build Application
            run: npm run build

          - name: Restart Application with PM2
            run: pm2 restart frontend
    ```
    <p align="center">
      <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/linkify-frontend-workflow.png" alt="GitHub Actions Workflow"/>
    </p>

### **4. Nginx Configuration**

Configure Nginx to act as a reverse proxy, sending traffic to your running Next.js application.

1.  Create a clean Nginx configuration file:
    ```bash
    sudo nano /etc/nginx/sites-available/linkify
    ```
2.  Paste the following server block into the file:
    ```nginx
    server {
        listen 80 default_server;
        server_name ec2-34-228-244-173.compute-1.amazonaws.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3.  Enable your new site and restart Nginx:
    ```bash
    # Create the link to enable the site
    sudo ln -s /etc/nginx/sites-available/linkify /etc/nginx/sites-enabled/linkify

    # (Optional) Remove the default link if it exists
    sudo rm /etc/nginx/sites-enabled/default

    # Test and restart Nginx
    sudo nginx -t
    sudo systemctl restart nginx
    ```

---

## **Verification & Application Preview ✅**

After pushing a change to the `main` branch, the pipeline will run automatically. You can then navigate to your EC2 instance's public DNS to see the live application.

<p align="center">
  <strong>Home Page</strong><br>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/home-page.png" alt="Home Page" width="75%"/>
</p>
<br><br>
<p align="center">
  <strong>Scroll Section</strong><br>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/scrole1.png" alt="Scroll Section 1" width="48%"/>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/scole2.png" alt="Scroll Section 2" width="48%"/>
</p>
<br><br>
<p align="center">
  <strong>User Profile View</strong><br>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/ProfileOpen1.png" alt="User Profile 1" width="48%"/>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/ProfileOpen2.png" alt="User Profile 2" width="48%"/>
</p>
<br><br>
<p align="center">
  <strong>Edit Self Profile</strong><br>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/edit-user-profile1.png" alt="Edit Profile 1" width="48%"/>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/Edit-user-profile.png" alt="Edit Profile 2" width="48%"/>
</p>
<br><br>
<p align="center">
  <strong>Login & Signup Page</strong><br>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/signin.png" alt="Sign In Page" width="48%"/>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/signup.png" alt="Sign Up Page" width="48%"/>
</p>
<br><br>
<p align="center">
  <strong>Connection page & Discover Page</strong><br>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/my-connections.png" alt="Sign In Page" width="48%"/>
  <img src="https://github.com/SurjeetKumar1/Linkify-frontend/blob/main/assets/discover.png" alt="Sign Up Page" width="48%"/>
</p>


