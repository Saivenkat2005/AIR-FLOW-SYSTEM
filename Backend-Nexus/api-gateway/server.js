const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 4000;
const CORE_SERVICE_URL = process.env.CORE_SERVICE_URL || 'http://localhost:8080';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 8000);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost,http://localhost:80,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// ─── Security & Middlewares ──────────────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin is not allowed by the API gateway CORS policy.'));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Correlation-ID", "Idempotency-Key"]
}));
app.use(compression());
app.use(morgan('combined'));

// ─── Correlation ID Middleware ───────────────────────────────────────────────
app.use((req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    next();
});

// ─── Production Rate Limiters ────────────────────────────────────────────────
const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: { error: "Too many search requests. Please throttle your queries.", status: 429 }
});

const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: { error: "AI rate limit reached. Please wait a moment.", status: 429 }
});

const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: { error: "Too many authentication attempts. Please retry later.", status: 429 }
});

const ticketVerifyLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: { error: "Ticket verification rate limit exceeded.", status: 429 }
});

const defaultLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200
});

app.use(defaultLimiter);

// ─── Health & Readiness Probes ───────────────────────────────────────────────
app.get(['/health', '/health/live'], (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'Airline Nexus X API Gateway',
        timestamp: new Date().toISOString(),
        correlationId: req.correlationId
    });
});

app.get(['/ready', '/health/ready'], (req, res) => {
    res.status(200).json({
        status: 'READY',
        upstream: {
            coreService: CORE_SERVICE_URL,
            aiService: AI_SERVICE_URL
        }
    });
});

// ─── Granular Rate Limiting Middlewares (Section 55) ─────────────────────────
app.use(['/api/v1/auth', '/api/auth', '/auth'], authLimiter);
app.use(['/api/v1/tickets/verify', '/api/tickets/verify', '/tickets/verify'], ticketVerifyLimiter);
app.use(['/api/v1/flights', '/api/flights', '/flights'], searchLimiter);

// ─── AI Service Proxy (/api/v1/ai/* and /api/ai/*) ───────────────────────────
app.use(
    ['/api/v1/ai', '/api/ai'],
    aiLimiter,
    createProxyMiddleware({
        target: AI_SERVICE_URL,
        changeOrigin: true,
        proxyTimeout: REQUEST_TIMEOUT_MS,
        timeout: REQUEST_TIMEOUT_MS,
        onProxyReq: (proxyReq, req) => {
            proxyReq.setHeader('X-Correlation-ID', req.correlationId);
        },
        pathRewrite: (path, req) => {
            // Express removes the mounted prefix before proxying. Restore the
            // AI route prefix expected by FastAPI.
            const prefix = req.originalUrl.startsWith('/api/v1/ai')
                ? '/api/v1/ai'
                : '/api/ai';
            return `${prefix}${path}`;
        }
    })
);

// ─── Media Service Proxy (/api/v1/media/* and /api/backgrounds/*) ────────────
app.use(
    ['/api/v1/media', '/api/backgrounds'],
    createProxyMiddleware({
        target: CORE_SERVICE_URL,
        changeOrigin: true,
        proxyTimeout: REQUEST_TIMEOUT_MS,
        timeout: REQUEST_TIMEOUT_MS,
        onProxyReq: (proxyReq, req) => {
            proxyReq.setHeader('X-Correlation-ID', req.correlationId);
        },
        pathRewrite: {
            '^/api/v1/media/aviation-backgrounds': '/backgrounds',
            '^/api/backgrounds': '/backgrounds'
        }
    })
);

// ─── Core Service Proxy (/api/v1/* and /api/*) ───────────────────────────────
app.use(
    ['/api/v1', '/api'],
    createProxyMiddleware({
        target: CORE_SERVICE_URL,
        changeOrigin: true,
        proxyTimeout: REQUEST_TIMEOUT_MS,
        timeout: REQUEST_TIMEOUT_MS,
        onProxyReq: (proxyReq, req) => {
            proxyReq.setHeader('X-Correlation-ID', req.correlationId);
        },
        pathRewrite: {
            '^/api/v1': '',
            '^/api': ''
        }
    })
);

app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    const status = err.status || 500;
    res.status(status).json({
        error: status === 500 ? 'Gateway request failed.' : err.message,
        correlationId: req.correlationId
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Airline Nexus X API Gateway is running on port ${PORT}`);
    console.log(`→ Upstream Core: ${CORE_SERVICE_URL}`);
    console.log(`→ Upstream AI:   ${AI_SERVICE_URL}`);
});
