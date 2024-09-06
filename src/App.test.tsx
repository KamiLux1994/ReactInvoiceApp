import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';
import i18n from './assets/i18n.js';
import {changeLanguage} from "i18next";

const AppWithMockI18n = () => <App i18n={mockI18n} />;

const mockI18n = {
    changeLanguage: vi.fn(() => Promise.resolve()),
};

describe('App', () => {
    it('renders the App component', () => {
        render(<AppWithMockI18n />);
        screen.debug(); // Optional: Debugging the rendered output
    });

    it('Should display translation button', () => {
        render(<AppWithMockI18n />);
        const translationButton = screen.getByText('Change language pl / en');
        expect(translationButton).toBeInTheDocument();
    });

    it('Should render navigation options', () => {
        render(<AppWithMockI18n />);
        const addInvoiceButton = screen.getByText('Add new invoice');
        expect(addInvoiceButton).toBeInTheDocument();
    });

    it('Should have access to changeLanguage method from i18n lib', () => {
        render(<AppWithMockI18n />);
        const translationButton = screen.getByText('Change language pl / en');
        fireEvent.click(translationButton);

        expect(i18n.changeLanguage).toBe(changeLanguage);
    });
});