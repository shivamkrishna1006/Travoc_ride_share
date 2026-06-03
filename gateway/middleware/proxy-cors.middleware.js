const expressProxy = require('express-http-proxy');

/**
 * Enhanced proxy middleware that properly handles CORS headers
 * Passes through service responses with correct headers
 */
const createProxyWithCors = (target, pathPrefix) => {
  return expressProxy(target, {
    // Resolve proxy path
    proxyReqPathResolver: (req) => pathPrefix + (req.url === '/' ? '' : req.url),

    // Intercept and modify response headers
    userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
      // Remove hop-by-hop headers that shouldn't be forwarded
      const headersToRemove = [
        'connection',
        'keep-alive',
        'transfer-encoding',
        'upgrade',
        'proxy-authenticate',
        'proxy-authorization',
        'te',
        'trailers'
      ];

      headersToRemove.forEach((header) => {
        delete headers[header];
      });

      // Ensure CORS headers are properly maintained
      if (!headers['access-control-allow-credentials']) {
        headers['access-control-allow-credentials'] = 'true';
      }

      // Preserve any custom response headers from service
      return headers;
    },

    // Intercept and modify request headers before sending to service
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Ensure headers object exists
      proxyReqOpts.headers = proxyReqOpts.headers || {};

      // Preserve authorization header
      if (srcReq.headers.authorization) {
        proxyReqOpts.headers.authorization = srcReq.headers.authorization;
      }

      // Preserve cookies
      if (srcReq.headers.cookie) {
        proxyReqOpts.headers.cookie = srcReq.headers.cookie;
      }

      // Preserve custom headers
      if (srcReq.headers['x-requested-with']) {
        proxyReqOpts.headers['x-requested-with'] = srcReq.headers['x-requested-with'];
      }

      // Add X-Forwarded headers for service tracking
      proxyReqOpts.headers['x-forwarded-for'] = srcReq.ip;
      proxyReqOpts.headers['x-forwarded-proto'] = srcReq.protocol;
      proxyReqOpts.headers['x-forwarded-host'] = srcReq.get('host');

      return proxyReqOpts;
    },

    // Handle errors during proxy
    onError: (err, req, res) => {
      console.error(`[PROXY ERROR] Target: ${target} | Path: ${req.path} | Error: ${err.message}`);

      res.status(503).json({
        success: false,
        error: 'Service Unavailable',
        message: 'The backend service is not responding. Please try again later.',
        service: target,
        path: req.path,
        timestamp: new Date().toISOString()
      });
    },

    // Handle no event on response
    onProxyReq: (proxyReq, req, res) => {
      // Log proxy requests in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[PROXY] ${req.method} ${target}${proxyReq.path}`);
      }
    }
  });
};

module.exports = { createProxyWithCors };
