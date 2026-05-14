# JaySoftShine Portal - Deployment Guide

## 🚀 Deployment on Railway

### Prerequisites
- Railway account (https://railway.app)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- GitHub repository with code

### Step 1: Setup MongoDB Atlas

1. Go to **MongoDB Atlas** (https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or add 0.0.0.0/0 for any IP)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/jaysoftshine`

### Step 2: Deploy on Railway

#### Option A: Connect GitHub Repository

1. Go to **https://railway.app**
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `jaysoftshine-portal` repository
4. Click "Deploy"

#### Option B: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Set environment variables
railway variables set MONGODB_URI="your_mongodb_connection_string"
railway variables set JWT_SECRET="your_secret_key"
railway variables set RAZORPAY_KEY_ID="rzp_live_SeQ228w1EyFbfo"
railway variables set RAZORPAY_KEY_SECRET="your_secret"
railway variables set SMTP_HOST="smtp.zoho.in"
railway variables set SMTP_PORT="587"
railway variables set SMTP_USER="admin@jayeshvyas.com"
railway variables set SMTP_PASS="MJ2329vyas@"
railway variables set FRONTEND_URL="https://your-frontend-url.com"

# Deploy
railway up
```

### Step 3: Environment Variables on Railway

In Railway Dashboard → Your Project → Variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jaysoftshine
JWT_SECRET=your_production_secret
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_live_SeQ228w1EyFbfo
RAZORPAY_KEY_SECRET=your_secret
SMTP_HOST=smtp.zoho.in
SMTP_PORT=587
SMTP_USER=admin@jayeshvyas.com
SMTP_PASS=MJ2329vyas@
SMTP_FROM=hello@jaysoftshine.com
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

### Step 4: Connect Custom Domain

1. Go to **Railway Dashboard** → Your Service
2. Click "Settings" → "Domain"
3. Add your custom domain (e.g., `api.jaysoftshine.com`)
4. Update your DNS records with the Railway-provided CNAME

### Step 5: Deploy Frontend on Vercel

```bash
# Go to frontend directory
cd frontend

# Update .env.production
NEXT_PUBLIC_API_URL=https://your-railway-api-url.com/api

# Deploy to Vercel
npm run build
npm install -g vercel
vercel
```

### Step 6: Verify Deployment

```bash
# Test backend health
curl https://your-backend-url/api/health

# Test MongoDB connection
curl https://your-backend-url/api/services
```

---

## 📊 Production Checklist

- ✅ MongoDB Atlas configured
- ✅ Environment variables set on Railway
- ✅ Email credentials verified
- ✅ Razorpay production keys added
- ✅ Frontend API URL updated
- ✅ CORS configured properly
- ✅ SSL/HTTPS enabled
- ✅ Uploaded files directory configured
- ✅ Error logging setup
- ✅ Database backups enabled

---

## 🔒 Security Best Practices

1. **Keep secrets safe**: Never commit `.env` files
2. **Use environment variables**: All sensitive data in Railway dashboard
3. **Enable database backups**: MongoDB Atlas auto-backup
4. **Rate limiting**: Add rate limiting middleware
5. **HTTPS only**: Enable SSL/TLS
6. **CORS**: Configure allowed origins

---

## 📈 Monitoring & Logs

### View Logs on Railway

```bash
railway logs
```

### Monitor Performance

- Check Railway Dashboard for CPU/Memory usage
- Monitor MongoDB Atlas metrics
- Set up error alerts

---

## 🆘 Troubleshooting

### Issue: Build fails
**Solution**: Check `railway.json` and `Dockerfile`

### Issue: Environment variables not loading
**Solution**: Restart the service after adding variables

### Issue: Database connection timeout
**Solution**: Whitelist Railway's IP in MongoDB Atlas

### Issue: Email not sending
**Solution**: Verify SMTP credentials and firewall rules

---

## 💡 Tips

- Use Railway's built-in logs for debugging
- Set up automated deployments from GitHub
- Enable auto-deploy on push to main branch
- Create staging environment for testing

---

## 📞 Support

- Railway Support: https://railway.app/support
- MongoDB Support: https://docs.mongodb.com/
- Email: hello@jaysoftshine.com