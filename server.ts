// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Now import other modules
import express from 'express';
import cors from 'cors';
import { getDatabase } from './api/lib/mongodb';
import { ObjectId } from 'mongodb';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Type definitions
type LeadStatus = "New" | "Contacted" | "Qualified" | "Closed";

interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    service: string;
    division: string;
    budget: string;
    timeline: string;
    description: string;
    otherDescription?: string;
    status: LeadStatus;
    createdAt: string;
}

interface MongoLeadDocument {
    _id: ObjectId;
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    service?: string;
    division?: string;
    budget?: string;
    timeline?: string;
    description?: string;
    otherDescription?: string;
    status?: LeadStatus;
    createdAt?: string;
}

// Routes
app.get('/api/leads', async (req, res) => {
    try {
        const db = await getDatabase();
        const collection = db.collection<MongoLeadDocument>('contacts');

        const leads = await collection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        const transformedLeads: Lead[] = leads.map((lead): Lead => {
            // Normalize status - capitalize first letter
            let status: LeadStatus = 'New';
            if (lead.status) {
                const normalized = lead.status.charAt(0).toUpperCase() + lead.status.slice(1).toLowerCase();
                if (['New', 'Contacted', 'Qualified', 'Closed'].includes(normalized)) {
                    status = normalized as LeadStatus;
                }
            }

            return {
                id: lead._id.toString(),
                name: lead.name || '',
                email: lead.email || '',
                phone: lead.phone || '',
                company: lead.company || '',
                service: lead.service || '',
                division: lead.division || '',
                budget: lead.budget || '',
                timeline: lead.timeline || '',
                description: lead.description || '',
                otherDescription: lead.otherDescription || '',
                status,
                createdAt: lead.createdAt || new Date().toISOString(),
            };
        });


        res.json({
            success: true,
            data: transformedLeads,
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

app.patch('/api/leads', async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id || !status) {
            return res.status(400).json({
                success: false,
                error: 'Missing id or status',
            });
        }

        const db = await getDatabase();
        const collection = db.collection<MongoLeadDocument>('contacts');

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found',
            });
        }

        res.json({
            success: true,
            message: 'Lead status updated',
        });
    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`📊 Leads endpoint: http://localhost:${PORT}/api/leads`);
});
