export interface Bank {
    id: string;
    name: string;
    logoUrl: string;
    apiUrl: string;
}

export const SUPPORTED_BANKS: Bank[] = [
    {
        id: 'bank_a',
        name: 'Banco Demo A',
        logoUrl: 'https://placehold.co/100x50/indigo/white?text=Banco+A', // Placeholder
        apiUrl: 'http://localhost:8002' // Default API URL for now
    },
    {
        id: 'bank_b',
        name: 'Banco Demo B',
        logoUrl: 'https://placehold.co/100x50/purple/white?text=Banco+B', // Placeholder
        apiUrl: 'http://localhost:8003'
    }
];
