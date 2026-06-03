# HTTP Request/Response Examples - CORS in Action

## Example 1: Simple GET Request (No Preflight)

### Browser Request
```http
GET /health HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
User-Agent: Mozilla/5.0
Accept: application/json
```

### Server Response
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Content-Type: application/json
Content-Length: 45

{
  "status": "ok",
  "message": "API Gateway is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Browser Processing
✅ Same method, no custom headers → **No preflight needed**
✅ CORS headers present and valid → **Request allowed**
✅ JavaScript can access response → **Success**

---

## Example 2: Complex POST with Auth (With Preflight)

### Browser Sends Preflight OPTIONS

```http
OPTIONS /api/users HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type, authorization
User-Agent: Mozilla/5.0
```

### Server Preflight Response

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-API-Key, Accept, Accept-Language, Content-Language, Last-Event-ID
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
Content-Length: 0

(empty body)
```

### Browser Evaluates Response
```javascript
// Browser checks:
✅ Origin: http://localhost:5173 is allowed
✅ Method: POST is allowed
✅ Headers: content-type, authorization are allowed
✅ Credentials: true allowed with specific origin
✅ Preflight passed - send actual request
```

### Browser Sends Actual POST Request

```http
POST /api/users HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
Content-Type: application/json
Cookie: sessionId=abc123def456
User-Agent: Mozilla/5.0
Content-Length: 35

{"email":"user@example.com"}
```

### Server Processes Request

```javascript
// Express receives request
app.post('/api/users', (req, res) => {
  // Authorization header available
  const token = req.headers.authorization; // ✅ "Bearer eyJ..."
  
  // Cookies available
  const sessionId = req.cookies.sessionId; // ✅ "abc123def456"
  
  // Body available
  const email = req.body.email; // ✅ "user@example.com"
  
  // Process user registration
  res.set('X-New-Token', 'new-token-value');
  res.json({ success: true, userId: 123 });
});
```

### Server Response

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: X-Total-Count, X-Page, X-Page-Size, X-Token, X-Refresh-Token, Authorization, Content-Length, ETag, Link, X-Request-ID
X-Token: new-token-value
X-Request-ID: 1704970200000-a1b2c3d4e5
Content-Type: application/json
Content-Length: 40

{"success":true,"userId":123}
```

### Browser Processing

```javascript
// JavaScript can read response
fetch('http://localhost:3000/api/users', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({ email: 'user@example.com' })
})
.then(response => {
  console.log(response.status); // ✅ 200
  
  // Read exposed headers
  const newToken = response.headers.get('X-Token'); // ✅ "new-token-value"
  const requestId = response.headers.get('X-Request-ID'); // ✅ "1704970200000-a1b2c3d4e5"
  
  return response.json();
})
.then(data => {
  console.log(data); // ✅ {success: true, userId: 123}
})
.catch(err => {
  console.error('Error:', err);
});
```

✅ Preflight passed → ✅ Actual request sent → ✅ Response processed → **Success**

---

## Example 3: BLOCKED - Invalid Origin

### Browser Request

```http
POST /api/users HTTP/1.1
Host: localhost:3000
Origin: http://evil.com
Authorization: Bearer token
Content-Type: application/json

{"email":"user@example.com"}
```

### Server Response

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json
Content-Length: 125

{
  "success": false,
  "error": "Cross-Origin Request Policy Violation",
  "message": "Your origin is not authorized to access this resource",
  "origin": "http://evil.com",
  "requestedPath": "/api/users"
}
```

### Browser Decision

```javascript
// Browser checks:
❌ Origin: http://evil.com NOT in allowed list
❌ Request blocked - response hidden from JavaScript
❌ Error in console: "CORS policy blocked"
```

### Browser Error Message

```
Access to XMLHttpRequest at 'http://localhost:3000/api/users' 
from origin 'http://evil.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### JavaScript Impact

```javascript
fetch('http://localhost:3000/api/users', {...})
  .catch(err => {
    console.error('TypeError: Failed to fetch'); // ❌ BLOCKED
  });
```

**Result**: Request blocked ❌, JavaScript never sees response ❌

---

## Example 4: BLOCKED - Missing Response Headers

### Browser Sends Preflight

```http
OPTIONS /api/users HTTP/1.1
Host: localhost:3001
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization
```

### Service Response (Missing CORS - Without Fix)

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 0

(empty body - NO CORS HEADERS)
```

### Browser Evaluation

```javascript
// Browser checks:
❌ No Access-Control-Allow-Origin header
❌ Preflight failed
❌ Block actual request
```

### Error

```
Access to XMLHttpRequest blocked by CORS policy:
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header
```

**With Fix Applied:**

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
Content-Length: 0

✅ Preflight passed
✅ Actual request proceeds
```

---

## Example 5: Response Headers Hidden (Without Fix)

### Backend Code

```javascript
// Send new token in response header
res.set('X-New-Token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
res.json({ success: true });
```

### Server Response

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
X-New-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{"success":true}
```

### Browser Processing (Without exposedHeaders Fix)

```javascript
// Response received successfully
fetch(...).then(response => {
  console.log(response.headers.get('X-New-Token')); // undefined ❌
  
  // Browser hides header because:
  // X-New-Token NOT in Access-Control-Expose-Headers
  // Only standard headers like Content-Type visible
})
```

**Error:** Frontend can't read token ❌

### Browser Processing (With exposedHeaders Fix)

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: X-Token, X-Refresh-Token, X-New-Token
X-New-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{"success":true}
```

```javascript
// Response received successfully
fetch(...).then(response => {
  const token = response.headers.get('X-New-Token'); // ✅ eyJhbGc...
  
  // Browser allows access because:
  // X-New-Token IS in Access-Control-Expose-Headers
  
  localStorage.setItem('token', token);
})
```

**Success:** Frontend reads token ✅

---

## Example 6: Preflight Caching in Action

### First Complex Request - Browser Sends Preflight

```http
OPTIONS /api/users HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
Access-Control-Request-Method: POST
```

### Server Response with Max-Age

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Max-Age: 86400
Content-Length: 0

✅ Browser caches this for 86400 seconds (24 hours)
```

### Subsequent Requests (Next 24 Hours) - NO Preflight Sent

```
Request 1: POST /api/users
  → Browser checks cache
  → Cache valid (24 hour TTL not expired)
  → Skip OPTIONS preflight
  → Send POST directly ✅

Request 2: POST /api/rides  
  → Browser checks cache
  → Cache valid
  → Skip OPTIONS preflight  
  → Send POST directly ✅

Request 3: DELETE /api/users/123
  → Browser checks cache
  → Cache valid
  → Skip OPTIONS preflight
  → Send DELETE directly ✅
```

**Performance Benefit:** 75%+ fewer HTTP requests after first complex call

---

## Example 7: Credentials + Cookies Flow

### Frontend Code

```javascript
// Include credentials
fetch('http://localhost:3000/api/users', {
  method: 'POST',
  credentials: 'include', // ✅ Include cookies
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(...)
})
```

### Browser Action

```
1. JavaScript sends fetch with credentials: 'include'
2. Browser prepares request
3. Browser adds cookies from this domain
4. Request sent with Cookie header
```

### Server Request

```http
POST /api/users HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
Cookie: sessionId=abc123; userId=456
Content-Type: application/json

{"data":"..."}
```

### Server Processing

```javascript
app.post('/api/users', (req, res) => {
  const cookies = req.cookies; // ✅ {sessionId: 'abc123', userId: '456'}
  const sessionId = req.cookies.sessionId; // ✅ 'abc123'
  
  // Validate session
  // Process request
  
  // Set new cookie in response
  res.cookie('newSessionId', 'new-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  
  res.json({ success: true });
});
```

### Server Response

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Set-Cookie: newSessionId=new-token; Path=/; HttpOnly; Secure; SameSite=Strict
Content-Type: application/json

{"success":true}
```

### Browser Action

```
1. Receives response with Set-Cookie header
2. Access-Control-Allow-Credentials: true present ✅
3. Access-Control-Allow-Origin: http://localhost:5173 (specific origin) ✅
4. Stores cookie for next request ✅
```

**Result:** Cookies properly shared across requests ✅

---

## Example 8: Direct Service Call (Bypass Gateway)

### Frontend Direct Service Call

```javascript
// Call Driver Service directly (bypass gateway)
fetch('http://localhost:3002/api/captains/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(...)
})
```

### Before Fix - Service Has No CORS

```http
OPTIONS /api/captains/register HTTP/1.1
Host: localhost:3002
Origin: http://localhost:5173
Access-Control-Request-Method: POST
```

### Service Response (Without CORS Fix)

```http
HTTP/1.1 200 OK
Content-Type: application/json

(no CORS headers)
```

### Browser Result

```
❌ Preflight failed
❌ Actual request blocked
❌ CORS error in console
```

### After Fix - Service Has CORS

```http
OPTIONS /api/captains/register HTTP/1.1
Host: localhost:3002
Origin: http://localhost:5173
Access-Control-Request-Method: POST
```

### Service Response (With CORS Fix)

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
Content-Length: 0
```

### Browser Result

```
✅ Preflight passed
✅ Actual request sent
✅ Response received
✅ Service works directly
```

---

## Summary: CORS Request Timeline

```
Timeline of a Complex CORS Request:

T=0ms: JavaScript calls fetch() with custom headers
  ↓
T=1ms: Browser detects complex request (needs preflight)
  ↓
T=2ms: Browser sends OPTIONS request to same URL
  ↓
T=10ms: Server receives OPTIONS preflight
  ↓
T=11ms: Server CORS middleware validates:
         ✅ Origin in allowlist
         ✅ Method allowed
         ✅ Headers allowed
  ↓
T=12ms: Server responds with CORS headers + Max-Age: 86400
  ↓
T=20ms: Browser receives preflight response
  ↓
T=21ms: Browser evaluates CORS response:
         ✅ All checks passed
         ✅ Cache this for next 24h
  ↓
T=22ms: Browser sends actual POST request
  ↓
T=30ms: Server receives actual request
  ↓
T=31ms: Server processes request normally
  ↓
T=50ms: Server sends response with CORS headers
  ↓
T=60ms: Browser receives response
  ↓
T=61ms: Browser allows JavaScript to read response ✅
  ↓
T=62ms: JavaScript callback executes
         data = await response.json()
         console.log(data) ✅

Total Time: ~60ms (first call)
With caching: ~40ms (subsequent calls - no preflight)
```

---

All examples show the fixed CORS configuration working correctly! ✅
