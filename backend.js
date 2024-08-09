const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Proxy requests
app.use('/proxy', createProxyMiddleware({
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '', // Remove `/proxy` from the request path
    },
    onProxyReq: (proxyReq, req, res) => {
        const targetUrl = req.query.url;
        if (targetUrl) {
            proxyReq.setHeader('Host', new URL(targetUrl).hostname);
        }
    },
    router: (req) => {
        const targetUrl = req.query.url;
        return targetUrl ? targetUrl : 'http://example.com';
    },
}));

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
