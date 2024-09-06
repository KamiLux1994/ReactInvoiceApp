import './App.scss';
import {useTranslation} from "react-i18next";
import {BrowserRouter, Routes, Route, Outlet, useNavigate} from "react-router-dom";
import InvoiceList from "./invoices/list/InvoiceList";
import AddNewInvoice from "./invoices/add-new-invoice/AddNewInvoice";
import EditInvoice from "./invoices/edit-invoice/EditInvoice";
import { SnackbarProvider } from 'notistack';

function Layout() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const changeLanguage = () => {
        if (i18n.language === 'pl') {
            i18n.changeLanguage('en').then();
        } else {
            i18n.changeLanguage('pl').then();
        }
    };

    const redirectTo = (path: string) => {
        navigate(`/${path}`);
    }

    return (
        <>
            <div className="top-menu">
                <span onClick={() => redirectTo('list-of-invoices')}>Invoices</span>
                <span onClick={() => redirectTo('invoice-details')}>Add new invoice</span>
                <span className="language-change-btn" onClick={() => changeLanguage()}>
                    {t('TRANSLATION_BTN')}
                </span>
            </div>
            <Outlet />
        </>
    );
}

function AppWrapper() {
    return (
        <SnackbarProvider maxSnack={3}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<AddNewInvoice />} />
                        <Route path="list-of-invoices" element={<InvoiceList />} />
                        <Route path="invoice-details" element={<AddNewInvoice />} />
                        <Route path="invoice-edit/:invoiceId"  element={<EditInvoice />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </SnackbarProvider>
    );
}

export default AppWrapper;