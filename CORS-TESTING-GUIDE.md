# CORS Testing & Debugging Guide

## 🧪 Test CORS Configuration

### 1️⃣ Test Preflight OPTIONS Request

```bash
# Test gateway CORS
curl -X OPTIONS http://localhost:3000/health \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v

# Expected response headers:
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Credentials: true
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
# Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-API-Key, Accept, Accept-Language, Content-Language, Last-Event-ID
```

### 2️⃣ Test Direct Service Call (User Service)

```bash
curl -X OPTIONS http://localhost:3001/api/users \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

### 3️⃣ Test with Credentials

```bash
# Frontend-like request with credentials
curl -X POST http://localhost:3000/api/users/register \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionId=abc123" \
  -d '{"email":"test@test.com","password":"test123"}' \
  -v
```

### 4️⃣ Test Authorization Header

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Origin: http://localhost:5173" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -v
```

---

## 🔍 Debugging CORS Issues

### Issue: `Access to XMLHttpRequest has been blocked by CORS policy`

**Causes:**
1. Origin not in allowlist
2. Missing `Access-Control-Allow-Origin` header
3. `credentials: true` + `origin: *` combination
4. Service-level CORS not configured

**Fix:**
```javascript
// Verify in browser console:
fetch('http://localhost:3000/api/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({email: 'test@test.com', password: 'test123'})
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))

// Check Network tab:
// - Look for red OPTIONS request = preflight failed
// - Check "Response Headers" for Access-Control-Allow-Origin
```

### Issue: `Credentials mode is 'include' but Access-Control-Allow-Credentials header is missing`

**Cause:** Frontend sends `credentials: 'include'` but server doesn't respond with `Access-Control-Allow-Credentials: true`

**Fix:**
```javascript
// Frontend code:
fetch(url, {
  credentials: 'include', // ✅ Include cookies
  headers: {'Authorization': 'Bearer token'}
})

// Backend must have:
// Access-Control-Allow-Credentials: true ✅
```

### Issue: Response headers hidden from JavaScript

**Cause:** Response header not in `Access-Control-Expose-Headers`

**Example:**
```javascript
// Backend sends custom header:
res.set('X-Token', 'new-token-value');

// Frontend tries to read:
fetch(url).then(r => {
  console.log(r.headers.get('X-Token')); // undefined ❌
  // Because X-Token not in Access-Control-Expose-Headers
})

// Fix - add to exposedHeaders in CORS config:
exposedHeaders: ['X-Token', 'X-Refresh-Token', ...]
```

---

## 🧬 Browser Network Debugging

### Chrome DevTools Steps:

1. **Open Network Tab** (F12 → Network)
2. **Filter by XHR/Fetch** to see API calls
3. **Look for OPTIONS requests** (preflight)
4. **Check response headers:**
   ```
   ✅ Access-Control-Allow-Origin: http://localhost:5173
   ✅ Access-Control-Allow-Credentials: true
   ✅ Access-Control-Allow-Methods: POST
   ✅ Access-Control-Allow-Headers: Content-Type, Authorization
   ```
5. **If OPTIONS fails** (red background):
   - Preflight failed
   - Actual request never sent
   - Check server logs

### Common Response Statuses:

```
✅ 200 OK - Preflight successful, actual request will proceed
❌ 403 Forbidden - Origin not allowed (CORS blocked)
❌ 404 Not Found - Route doesn't exist
❌ 500 Internal Server Error - Server error
```

---

## 📊 Environment-Specific Configuration

### Development (.env.development)

```bash
NODE_ENV=development
GATEWAY_PORT=3000
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

### Production (.env.production)

```bash
NODE_ENV=production
GATEWAY_PORT=3000
FRONTEND_URL=https://app.yourdomain.com
ALLOWED_ORIGINS=https://app.yourdomain.com,https://yourdomain.com
```

---

## 🐛 Troubleshooting Checklist

- [ ] Gateway app.js imports `corsMiddleware` correctly
- [ ] CORS middleware applied BEFORE body parsers
- [ ] Services import `setupCors(app)` correctly
- [ ] `credentials: true` only with SPECIFIC origin (not '*')
- [ ] All services have `OPTIONS` handler
- [ ] `exposedHeaders` includes custom response headers
- [ ] `allowedHeaders` includes custom request headers
- [ ] `Access-Control-Allow-Origin` header NEVER set to '*' if credentials used
- [ ] Preflight requests return 200 status
- [ ] Frontend sends `credentials: 'include'` when needed
- [ ] JWT Authorization header in `allowedHeaders`
- [ ] Cookies properly set with `httpOnly` and `sameSite`

---

## 🔐 Security Best Practices

### ✅ DO:

```javascript
// Use specific origins, not wildcard
origin: (origin, callback) => {
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  }
}

// Expose only necessary headers
exposedHeaders: ['X-Token', 'X-Page', 'Content-Length']

// Limit allowed methods
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']

// Set credentials to true for auth
credentials: true
```

### ❌ DON'T:

```javascript
// Never use wildcard with credentials
origin: '*',
credentials: true // ❌ INVALID

// Don't expose sensitive headers
exposedHeaders: ['*'] // ❌ Bad practice

// Don't allow all methods
methods: ['*'] // ❌ Unnecessary

// Don't disable preflight caching
maxAge: 0 // ❌ Performance issue
```

---

## 📝 Request Flow Diagram

```
Frontend (http://localhost:5173)
         ↓
    CORS Check in Browser
         ↓
  Is method/headers simple? → YES → Send request
         ↓ NO
   Send OPTIONS preflight
         ↓
    Gateway (3000)
         ↓
  corsMiddleware checks:
  - Origin in allowlist?
  - Include credentials header?
  - Include exposed headers?
         ↓
  Response with CORS headers
         ↓
  Browser evaluates response
         ↓
  If valid → Send actual request
  If invalid → Block request ❌
         ↓
  Proxy to Service (3001/3002/3003)
         ↓
  Service CORS middleware validates
         ↓
  Response sent back through gateway
         ↓
  Browser allows JavaScript access
```
