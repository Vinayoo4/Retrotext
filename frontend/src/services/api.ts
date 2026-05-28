import type { Theme } from '../../../shared/types';
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders() {
    const userJson = localStorage.getItem('code_canvas_user');
    if (!userJson) return {};
    try {
        const user = JSON.parse(userJson);
        return user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
    } catch {
        return {};
    }
}

export const api = {
    async getThemes(): Promise<Theme[]> {
        const response = await fetch(`${BASE_URL}/themes`);
        return response.json();
    },

    async saveSession(name: string, content: string, themeId: string) {
        const response = await fetch(`${BASE_URL}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ name, content, themeId })
        });
        if (!response.ok) throw new Error('Failed to save session');
        return response.json();
    }
};
