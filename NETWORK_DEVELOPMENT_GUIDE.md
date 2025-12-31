# Development Server Network Access Guide

## Problem
By default, development servers only listen on `localhost` (127.0.0.1), making them inaccessible from other devices on the network.

## Solutions

### 1. Start Server on All Interfaces
```bash
# Next.js
npm run dev -- -H 0.0.0.0 -p 3000
# or in package.json
"dev": "next dev -H 0.0.0.0 -p 3000"

# React (Create React App)
HOST=0.0.0.0 npm start

# Vite
npm run dev -- --host 0.0.0.0

# Express/Node.js
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on all interfaces');
});
```

### 2. Environment Variables Setup
Never hardcode `localhost:3000` in your code. Use environment variables:

```env
# .env.local
NEXT_PUBLIC_BASE_URL=http://192.168.1.100:3000
NEXT_PUBLIC_API_URL=http://192.168.1.100:3000
```

### 3. Dynamic URL Detection
```javascript
// utils/getBaseUrl.js
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser - use current origin
    return window.location.origin;
  }
  
  // Server-side
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

// Usage in API routes
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
  `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
```

### 4. Find Your Network IP
```bash
# Windows
ipconfig
# Look for "IPv4 Address" under your active network adapter

# macOS/Linux
ifconfig
# or
ip addr show

# Node.js script to get local IP
const os = require('os');
const interfaces = os.networkInterfaces();
Object.keys(interfaces).forEach(name => {
  interfaces[name].forEach(iface => {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`Network IP: ${iface.address}`);
    }
  });
});
```

### 5. Firewall Configuration
```bash
# Windows - Allow port through firewall
netsh advfirewall firewall add rule name="Dev Server" dir=in action=allow protocol=TCP localport=3000

# macOS - Usually no action needed for local network
# Linux - Open port if using ufw
sudo ufw allow 3000
```

### 6. Complete Next.js Setup Example

**package.json:**
```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0 -p 3000",
    "dev:local": "next dev -p 3000"
  }
}
```

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow external access in development
  experimental: {
    allowMiddlewareResponseBody: true,
  }
};

module.exports = nextConfig;
```

**.env.local:**
```env
# Use your actual network IP
NEXT_PUBLIC_BASE_URL=http://192.168.1.100:3000
NEXT_PUBLIC_API_URL=http://192.168.1.100:3000
```

**lib/config.js:**
```javascript
export const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
};
```

### 7. Testing Access
1. Start server: `npm run dev`
2. Local access: `http://localhost:3000`
3. Network access: `http://YOUR_IP:3000`
4. Test from mobile device on same WiFi network

### 8. Common Issues & Solutions

**Issue: "Can't connect to server"**
- Check firewall settings
- Ensure devices are on same network
- Verify IP address is correct
- Try different port if 3000 is blocked

**Issue: CORS errors**
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ];
  },
};
```

**Issue: Environment variables not updating**
- Restart development server after changing .env files
- Clear browser cache
- Check if variables are prefixed with NEXT_PUBLIC_ for client-side access

### 9. Production Considerations
- Never use 0.0.0.0 in production
- Use proper domain names and SSL certificates
- Implement proper CORS policies
- Use environment-specific configurations

### 10. Quick Setup Script
```bash
#!/bin/bash
# get-network-ip.sh
IP=$(ipconfig getifaddr en0 2>/dev/null || hostname -I | cut -d' ' -f1)
echo "NEXT_PUBLIC_BASE_URL=http://$IP:3000" > .env.local
echo "NEXT_PUBLIC_API_URL=http://$IP:3000" >> .env.local
echo "Network IP set to: $IP"
```

## Best Practices
1. Use environment variables for all URLs
2. Never hardcode localhost in production code
3. Test on multiple devices during development
4. Keep separate configs for local vs network development
5. Document network setup for team members