import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from './lib/mongodb.js';
import { ObjectId } from 'mongodb';

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


export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const db = await getDatabase();
        const collection = db.collection<MongoLeadDocument>('contacts');

        switch (req.method) {
            case 'GET': {
                // Fetch all leads
                const leads: MongoLeadDocument[] = await collection
                    .find({})
                    .sort({ createdAt: -1 })
                    .toArray();

                // Transform MongoDB documents to match frontend Lead type
                const transformedLeads: Lead[] = leads.map((lead: MongoLeadDocument): Lead => {
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

                return res.status(200).json({
                    success: true,
                    data: transformedLeads,
                });
            }

            case 'PATCH': {
                // Update lead status
                const { id, status } = req.body;

                if (!id || !status) {
                    return res.status(400).json({
                        success: false,
                        error: 'Missing id or status',
                    });
                }

                // ... update logic
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

                return res.status(200).json({
                    success: true,
                    message: 'Lead status updated',
                });
            }

            case 'DELETE': {
                const { id } = req.query;

                if (!id || typeof id !== 'string') {
                    return res.status(400).json({
                        success: false,
                        error: 'Missing id',
                    });
                }

                const result = await collection.deleteOne({
                    _id: new ObjectId(id),
                });

                if (result.deletedCount === 0) {
                    return res.status(404).json({
                        success: false,
                        error: 'Lead not found',
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Lead deleted successfully',
                });
            }

            default:
                res.setHeader('Allow', ['GET', 'PATCH']);
                return res.status(405).json({
                    success: false,
                    error: `Method ${req.method} Not Allowed`,
                });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
