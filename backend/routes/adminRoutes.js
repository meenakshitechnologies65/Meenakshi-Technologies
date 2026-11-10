/**
 * ADMIN ROUTES
 * Strictly protected routes for the authenticated Super Administrator (meenakshitechnologies65@gmail.com).
 * Any unauthenticated attempt is intercepted by requireAdminAuth and redirected to /admin/login.
 */

const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Enforce Super Admin authentication across ALL routes in this router
router.use(requireAdminAuth);

// 1. Admin Dashboard View
router.get('/', adminController.renderDashboard);
router.get('/dashboard', adminController.renderDashboard);

// 2. Security Audit Logs API
router.get('/api/audit-logs', adminController.getAuditLogs);

// 3. Product Management APIs
router.get('/api/products/:slug/schema', adminController.getProductSchema);
router.post('/api/products', adminController.createProduct);
router.put('/api/products/:slug', adminController.updateProduct);
router.delete('/api/products/:slug', adminController.deleteProduct);

// 4. Customer Enquiry / Lead Management APIs
router.patch('/api/leads/:id', adminController.updateLeadStatus);

// 5. YouTube Videos & Media Management APIs
router.post('/api/videos', adminController.addVideo);
router.delete('/api/videos/:id', adminController.deleteVideo);

module.exports = router;

