export interface Bank {
    id: string;
    name: string;
    logoUrl: string;
    apiUrl: string;
}

export const SUPPORTED_BANKS: Bank[] = [
    {
        id: 'bank_a',
        name: 'CreditBank',
        logoUrl: 'https://placehold.co/100x50/indigo/white?text=CreditBank',
        apiUrl: 'http://localhost:8002' // Default (will be handled by backend proxy logic essentially)
    },
    {
        id: 'bank_b',
        name: 'CiensPay',
        logoUrl: 'https://placehold.co/100x50/purple/white?text=CiensPay',
        apiUrl: 'http://localhost:8003'
    },
    {
        id: 'bank_c',
        name: 'BancObsidiana',
        logoUrl: 'https://placehold.co/100x50/black/white?text=BancObsidiana',
        apiUrl: 'http://localhost:8004'
    }
];
