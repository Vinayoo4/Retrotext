import type { Theme } from '../../../shared/types';
const BASE_URL = 'http://localhost:3001/api';
export const api = {
    async getThemes(): Promise<Theme[]> {
        const response = await fetch(`${BASE_URL}/themes`);
        return response.json();
    }
};
