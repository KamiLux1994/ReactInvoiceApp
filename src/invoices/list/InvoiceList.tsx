import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from '@mui/material';
import { Rings } from 'react-loader-spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styles from './InvoiceList.module.scss';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getInvoices, deleteInvoice } from "../../services/invoices-service";

const InvoiceList: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const redirectToEdition = (invoiceId: number) => {
        navigate(`/invoice-edit/${invoiceId}`);
    };

    const { data: invoices, isLoading, error } = useQuery({ queryKey: ['invoices'], queryFn: getInvoices });

    const handleDelete = (invoiceId: number) => {
        deleteInvoice(invoiceId).then(() => {
            queryClient.invalidateQueries(['invoices']);
        });
    };

    if (isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <Rings color="#00BFFF" height={300} width={300} />
            </div>
        );
    }

    if (error) {
        return <div>{t('Error loading invoices')}</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow className={styles.headerRow}>
                        <TableCell className={styles.no}>{t('NO')}</TableCell>
                        <TableCell>{t('CREATED')}</TableCell>
                        <TableCell>{t('VALID_UNTIL')}</TableCell>
                        <TableCell>{t('AMOUNT')}</TableCell>
                        <TableCell>{t('ACTIONS')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className={styles.listItem}>
                    {invoices.map((invoice, index) => (
                        <TableRow key={invoice.id}>
                            <TableCell className={styles.no}>{index + 1}</TableCell>
                            <TableCell>{invoice.createdAt}</TableCell>
                            <TableCell>{invoice.validUntil}</TableCell>
                            <TableCell>{invoice.items.length}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => redirectToEdition(invoice.id)} aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(invoice.id)} aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default InvoiceList;