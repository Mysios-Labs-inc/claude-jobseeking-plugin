#!/usr/bin/env node

/**
 * Claude Jobseeking Plugin - Premium MCP Server
 * Handles premium features like ATS optimization, salary research, and job matching
 */

const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Environment variables
const API_ENDPOINT = process.env.API_ENDPOINT || 'https://api.jobseeking.ai';
const API_KEY = process.env.API_KEY;
const PLUGIN_VERSION = process.env.PLUGIN_VERSION || '1.0.0';

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: PLUGIN_VERSION,
        timestamp: new Date().toISOString()
    });
});

// Premium feature endpoints
app.post('/api/resume/optimize', async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(401).json({
                error: 'Premium feature requires API key. Get yours at jobseeking.ai'
            });
        }

        const { resume, jobPosting, optimizationType } = req.body;

        // Call premium API service
        const response = await axios.post(`${API_ENDPOINT}/v1/resume/optimize`, {
            resume,
            jobPosting,
            optimizationType
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Resume optimization error:', error.message);
        res.status(500).json({
            error: 'Resume optimization failed',
            message: error.message
        });
    }
});

app.post('/api/cover-letter/generate', async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(401).json({
                error: 'Premium feature requires API key. Get yours at jobseeking.ai'
            });
        }

        const { jobPosting, resume, companyResearch } = req.body;

        const response = await axios.post(`${API_ENDPOINT}/v1/cover-letter/generate`, {
            jobPosting,
            resume,
            companyResearch
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Cover letter generation error:', error.message);
        res.status(500).json({
            error: 'Cover letter generation failed',
            message: error.message
        });
    }
});

app.post('/api/interview/prep', async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(401).json({
                error: 'Premium feature requires API key. Get yours at jobseeking.ai'
            });
        }

        const { company, role, interviewType, userBackground } = req.body;

        const response = await axios.post(`${API_ENDPOINT}/v1/interview/prep`, {
            company,
            role,
            interviewType,
            userBackground
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Interview prep error:', error.message);
        res.status(500).json({
            error: 'Interview preparation failed',
            message: error.message
        });
    }
});

app.get('/api/salary/research', async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(401).json({
                error: 'Premium feature requires API key. Get yours at jobseeking.ai'
            });
        }

        const { role, location, experience, company } = req.query;

        const response = await axios.get(`${API_ENDPOINT}/v1/salary/research`, {
            params: { role, location, experience, company },
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Salary research error:', error.message);
        res.status(500).json({
            error: 'Salary research failed',
            message: error.message
        });
    }
});

// Usage tracking endpoint
app.get('/api/usage/stats', async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(401).json({
                error: 'Requires API key for usage statistics'
            });
        }

        const response = await axios.get(`${API_ENDPOINT}/v1/usage/stats`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Usage stats error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch usage statistics',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Claude Jobseeking Plugin Premium Server running on port ${port}`);
        console.log(`Health check: http://localhost:${port}/health`);
        console.log(`API Key configured: ${!!API_KEY}`);
    });
}

module.exports = app;