export interface InvoiceModel {
    number: number;
    id: string;
    recipient: {
        id: string;
        companyName: string;
        city: string;
        street: string;
        postcode: string;
        nip: string;
        phone: string;
        email: string;
        bankAccount: string;
    };
    sender: {
        id: string;
        companyName: string;
        city: string;
        street: string;
        postcode: string;
        nip: string;
        phone: string;
        email: string;
        bankAccount: string;
    };
    items: Item[];
    name: string;
    createdAt: string;
    validUntil: string;
}

export interface Item {
    id: string;
    name: string;
    amount: number;
    unit: string;
    tax: number;
    price: number;
}