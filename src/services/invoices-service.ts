import {InvoiceModel} from "../invoices/edit-invoice/EditInvoice";

const getInvoices = () => {
    return fetch('http://localhost:4000/api/Invoices/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
}

const getInvoice = (invoiceId): Promise<InvoiceModel> => {
    return fetch(`http://localhost:4000/api/Invoices/${invoiceId}`
    ).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    });
};

const deleteInvoice = (invoiceId) => {
    return fetch(`http://localhost:4000/api/Invoices/${invoiceId}`, {
        method: 'DELETE',
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
    });
};

const editInvoice = (invoiceData: InvoiceModel, id: string) => {
    return fetch(`http://localhost:4000/api/Invoices/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    });
};

const addInvoice = (invoiceData: InvoiceModel) => {
    return fetch('http://localhost:4000/api/Invoices/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    });
};

export { getInvoices, getInvoice, deleteInvoice, editInvoice, addInvoice };