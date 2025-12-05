# 🚀 E-Money Deployment Guide

## Overview

This guide covers deploying the E-Money backend to production environments.

## Prerequisites

- [x] Backend code tested locally
- [x] PostgreSQL database ready
- [x] Domain name (optional)
- [x] Payment gateway credentials (Flutterwave/Paystack)

## 🎯 Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Pros:** Free tier, auto-deploy from Git, includes PostgreSQL, SSL included
**Time:** 10 minutes

#### Steps:

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your E-money repository

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically sets `DATABASE_URL`

4. **Configure Environment Variables**
   - Click on your service
   - Go to "Variables"
   - Add:
     ```
     JWT_SECRET=your-production-jwt-secret-key
     NODE_ENV=production
     FLUTTERWAVE_SECRET_KEY=your-key
     FLUTTERWAVE_PUBLIC_KEY=your-key
     PAYMENT_GATEWAY_URL=https://api.flutterwave.com/v3
     ```

5. **Deploy**
   - Railway auto-deploys on push to main branch
   - Get public URL from Railway dashboard

6. **Run Database Migrations**
   - In Railway console:
     ```bash
     npm run prisma:deploy
     npm run prisma:seed
     ```

7. **Test Deployment**
   ```bash
   curl https://your-app.railway.app
   ```

---

### Option 2: Heroku

**Pros:** Well-documented, free tier available, easy scaling
**Time:** 15 minutes

#### Steps:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create New App**
   ```bash
   cd backend
   heroku create your-emoney-api
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set NODE_ENV=production
   heroku config:set FLUTTERWAVE_SECRET_KEY=your-key
   heroku config:set FLUTTERWAVE_PUBLIC_KEY=your-key
   ```

6. **Create Procfile**
   ```bash
   echo "web: npm start" > Procfile
   ```

7. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

8. **Run Migrations**
   ```bash
   heroku run npm run prisma:deploy
   heroku run npm run prisma:seed
   ```

9. **Open App**
   ```bash
   heroku open
   ```

---

### Option 3: DigitalOcean App Platform

**Pros:** Good performance, predictable pricing, automatic SSL
**Time:** 20 minutes

#### Steps:

1. **Create DigitalOcean Account**
   - Visit https://www.digitalocean.com

2. **Create App**
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Select `backend` folder as source

3. **Configure Build**
   - Build Command: `npm install && npm run prisma:generate`
   - Run Command: `npm start`

4. **Add PostgreSQL Database**
   - In App settings, add "Database"
   - Select "PostgreSQL"
   - $7/month basic plan

5. **Set Environment Variables**
   - Add all variables from `.env.example`
   - DATABASE_URL auto-populated

6. **Deploy**
   - Click "Deploy"
   - Wait for build completion

7. **Run Migrations**
   - Use DigitalOcean console:
     ```bash
     npm run prisma:deploy
     npm run prisma:seed
     ```

---

### Option 4: AWS EC2 (Advanced)

**Pros:** Full control, scalable, enterprise-grade
**Time:** 45-60 minutes

#### Steps:

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier)
   - Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **Connect via SSH**
   ```bash
   ssh -i your-key.pem ubuntu@your-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib

   # Install nginx
   sudo apt install -y nginx

   # Install PM2
   sudo npm install -g pm2
   ```

4. **Setup PostgreSQL**
   ```bash
   sudo -u postgres psql
   
   CREATE DATABASE e_money_db;
   CREATE USER emoney WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE e_money_db TO emoney;
   \q
   ```

5. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd E-money/backend
   ```

6. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env
   # Edit with your production values
   ```

7. **Install and Build**
   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:deploy
   npm run prisma:seed
   ```

8. **Start with PM2**
   ```bash
   pm2 start src/server.js --name emoney-api
   pm2 startup
   pm2 save
   ```

9. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/emoney
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/emoney /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Setup SSL with Let's Encrypt**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

---

## 🔒 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Enable firewall (UFW on Ubuntu)
- [ ] Regular database backups
- [ ] Monitor logs
- [ ] Update dependencies regularly

## 🔧 Post-Deployment

### 1. Test All Endpoints

```bash
export API_URL=https://your-production-url.com

# Health check
curl $API_URL

# User registration
curl -X POST $API_URL/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","password":"test123"}'

# Admin login
curl -X POST $API_URL/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-new-password"}'
```

### 2. Setup Monitoring

**Option A: Built-in Monitoring**
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs emoney-api
```

**Option B: External Services**
- **Sentry** - Error tracking
- **Datadog** - Application monitoring
- **New Relic** - Performance monitoring
- **LogRocket** - User session replay

### 3. Database Backups

**Railway/Heroku:**
- Automated backups included

**Self-hosted:**
```bash
# Create backup script
sudo nano /usr/local/bin/backup-emoney-db.sh
```

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U emoney -h localhost e_money_db > /backups/emoney_$TIMESTAMP.sql
# Keep only last 7 days
find /backups -name "emoney_*.sql" -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-emoney-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /usr/local/bin/backup-emoney-db.sh
```

### 4. Configure Payment Gateway Webhooks

**Flutterwave:**
1. Login to Flutterwave Dashboard
2. Go to Settings → Webhooks
3. Add: `https://your-api.com/api/deposits/verify/:txRef`

**Paystack:**
1. Login to Paystack Dashboard
2. Go to Settings → Webhooks
3. Add: `https://your-api.com/api/deposits/verify/:txRef`

### 5. Frontend Configuration

Update frontend `.env`:
```env
VITE_API_BASE_URL=https://your-production-api.com/api
```

---

## 📊 Monitoring Commands

```bash
# Check server status (PM2)
pm2 status

# View logs
pm2 logs emoney-api --lines 100

# Monitor resources
pm2 monit

# Restart application
pm2 restart emoney-api

# Check database
psql -U emoney -d e_money_db -c "SELECT COUNT(*) FROM \"User\";"
```

---

## 🚨 Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs emoney-api

# Check if port is in use
sudo lsof -i :4000

# Check environment
pm2 env emoney-api
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U emoney -d e_money_db -c "SELECT 1;"

# Check DATABASE_URL
echo $DATABASE_URL

# Check PostgreSQL service
sudo systemctl status postgresql
```

### High Memory Usage

```bash
# Check process
top -p $(pgrep node)

# Restart application
pm2 restart emoney-api

# Set memory limit
pm2 start src/server.js --max-memory-restart 500M
```

---

## 📈 Scaling

### Horizontal Scaling

**Option 1: Load Balancer + Multiple Instances**
```bash
# Start multiple instances
pm2 start src/server.js -i 4 --name emoney-api
```

**Option 2: Docker + Kubernetes**
- Create Dockerfile
- Setup Kubernetes cluster
- Deploy with helm charts

### Database Scaling

**Read Replicas:**
- Setup PostgreSQL read replicas
- Route read queries to replicas

**Connection Pooling:**
- Use PgBouncer or similar

---

## 🎉 Deployment Complete!

Your E-Money backend is now live and production-ready!

### Next Steps:
1. Deploy frontend to Vercel/Netlify
2. Setup custom domain
3. Configure email notifications
4. Add monitoring alerts
5. Schedule regular backups
6. Monitor performance

---

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test database connectivity
4. Review Prisma migrations
5. Check firewall rules

Happy deploying! 🚀
