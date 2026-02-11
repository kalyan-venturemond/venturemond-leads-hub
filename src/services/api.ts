import { Lead, LeadStatus } from '@/types/lead';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export const leadsApi = {
    /**
     * Fetch all leads from the database
     */
    async getLeads(): Promise<Lead[]> {
        try {
            const response = await fetch(`${API_URL}/leads`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ApiResponse<Lead[]> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Failed to fetch leads');
            }

            return result.data;
        } catch (error) {
            console.error('Error fetching leads:', error);
            throw error;
        }
    },

    /**
     * Update the status of a lead
     */
    async updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/leads`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ApiResponse<void> = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to update lead status');
            }
        } catch (error) {
            console.error('Error updating lead status:', error);
            throw error;
        }
    },
};
