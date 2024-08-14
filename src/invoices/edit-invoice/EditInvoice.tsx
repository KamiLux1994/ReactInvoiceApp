import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import {
    Container,
    TextField,
    Typography,
    Button,
    Paper,
    Box
} from '@mui/material';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import styles from './EditInvoice.module.scss';
import { useQuery } from "@tanstack/react-query";
import {editInvoice, getInvoice} from "../../services/invoices-service";
import {useNavigate, useParams} from 'react-router-dom';
import {InvoiceModel} from "../models/invoice-model";
import {useSnackbar} from "notistack";

const EditInvoice: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const { enqueueSnackbar } = useSnackbar();

    const { data: invoice, isLoading, error } = useQuery({
        queryKey: ['invoices', invoiceId],
        queryFn: () => getInvoice(invoiceId)
    });

    const [items, setItems] = useState(invoice?.items || []);
    const { register, handleSubmit, control, formState: { errors, isValid }, trigger } = useForm<InvoiceModel>({
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<InvoiceModel> = async (data) => {
        try {
            await editInvoice(data, invoiceId);
            enqueueSnackbar(t(`You successfully edited ${data.name}`), { variant: 'success' });
            navigate('/list-of-invoices');
        } catch (error) {
            enqueueSnackbar(t('Error saving invoice'), { variant: error });
            console.error("Error adding invoice:", error);
        }
    };

    const handleBlur = async (fieldName: string) => {
        await trigger(fieldName);
    };

    const invoiceNumberRef = useRef<HTMLInputElement | null>(null);

    const [createdDate, setCreatedDate] = React.useState<Date | null>(null);
    const [validUntilDate, setValidUntilDate] = React.useState<Date | null>(null);

    useEffect(() => {
        if (invoiceNumberRef.current) {
            invoiceNumberRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (invoice?.items) {
            setItems(invoice.items);
        }
    }, [invoice]);
    
    if (isLoading) return <div>{t('Loading...')}</div>;
    if (error) return <div>{t('Error loading invoice')}</div>;

    const goBack = () => {
        navigate(`/list-of-invoices`);
    };

    const handleAddItem = () => {
        setItems(prevItems => [...prevItems, { id: Date.now(), name: '', amount: '', unit: '', tax: '', price: '' }]);
    };

    const handleDeleteItem = (id: number) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    return (
        <Container>
            <Paper elevation={3} className={styles.paper}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.headerContainer}>
                        <div>
                            <TextField
                                label={t('INVOICE.NAME')}
                                fullWidth variant="standard"
                                {...register("name", { required: t('Name is required') })}
                                error={!!errors.name}
                                defaultValue={invoice.name}
                                helperText={errors.name?.message}
                                onBlur={() => handleBlur("name")}
                            />
                            <span className={styles.createdDate}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Controller
                                        name="createdAt"
                                        control={control}
                                        defaultValue={new Date (invoice.createdAt)}
                                        render={({ field }) => (
                                            <DatePicker
                                                variant="standard"
                                                label={t('Created date')}
                                                onChange={(date) => field.onChange(date)}
                                                value={field.value}
                                                renderInput={(params) => <TextField {...params} fullWidth/>}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Controller
                                        name="validUntil"
                                        control={control}
                                        defaultValue={new Date (invoice.validUntil)}
                                        render={({ field }) => (
                                            <DatePicker
                                                variant="standard"
                                                label={t('Valid until date')}
                                                onChange={(date) => field.onChange(date)}
                                                value={field.value}
                                                renderInput={(params) => <TextField {...params} fullWidth/>}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </span>
                        </div>
                        <div className={styles.topButtons}>
                            <Button
                                variant="outlined"
                                onClick={goBack}
                                color="secondary">
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(onSubmit)}
                                startIcon={<SaveIcon />}
                                disabled={!isValid}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.column}>
                            <Typography variant="h6" gutterBottom>
                                {t('Recipient')}
                            </Typography>
                            <Box className={styles.columnBox}>
                                <TextField
                                    label={t('INVOICE.COMPANY_NAME')}
                                    fullWidth
                                    variant="standard"
                                    defaultValue={invoice.recipient.companyName}
                                    {...register("recipient.companyName", { required: t('Company name is required') })}
                                    error={!!errors.recipient?.companyName}
                                    helperText={errors.recipient?.companyName?.message}
                                    onBlur={() => handleBlur("recipient.companyName")}
                                />
                                <TextField label={t('City')} fullWidth variant="standard" defaultValue={invoice.recipient.city} {...register("recipient.city")}/>
                                <TextField label={t('Street')} fullWidth variant="standard" defaultValue={invoice.recipient.street} {...register("recipient.street")}/>
                                <TextField label={t('Postcode')} fullWidth variant="standard" defaultValue={invoice.recipient.postcode} {...register("recipient.postcode")}/>
                                <TextField label={t('NIP')} fullWidth variant="standard" defaultValue={invoice.recipient.nip} {...register("recipient.nip")}/>
                                <TextField label={t('Tel')} fullWidth variant="standard" defaultValue={invoice.recipient.phone} {...register("recipient.phone")}/>
                                <TextField label={t('Email')} fullWidth variant="standard" defaultValue={invoice.recipient.email} {...register("recipient.email")}/>
                                <TextField label={t('Bank account')} fullWidth variant="standard" defaultValue={invoice.recipient.bankAccount} {...register("recipient.bankAccount")}/>
                            </Box>
                        </div>

                        <div className={styles.column}>
                            <Typography variant="h6" gutterBottom>
                                {t('Sender')}
                            </Typography>
                            <Box className={styles.columnBox}>
                                <TextField
                                    label={t('INVOICE.COMPANY_NAME')}
                                    fullWidth variant="standard"
                                    defaultValue={invoice.sender.companyName}
                                    {...register("sender.companyName", { required: t('Company name is required') })}
                                    error={!!errors.sender?.companyName}
                                    helperText={errors.sender?.companyName?.message}
                                    onBlur={() => handleBlur("sender.companyName")}
                                />
                                <TextField label={t('City')} fullWidth variant="standard" defaultValue={invoice.sender.city} {...register("sender.city")}/>
                                <TextField label={t('Street')} fullWidth variant="standard" defaultValue={invoice.sender.street} {...register("sender.street")}/>
                                <TextField label={t('Postcode')} fullWidth variant="standard" defaultValue={invoice.sender.postcode} {...register("sender.postcode")}/>
                                <TextField label={t('NIP')} fullWidth variant="standard" defaultValue={invoice.sender.nip} {...register("sender.nip")}/>
                                <TextField label={t('Tel')} fullWidth variant="standard" defaultValue={invoice.sender.phone} {...register("sender.phone")}/>
                                <TextField label={t('Email')} fullWidth variant="standard" defaultValue={invoice.sender.email} {...register("sender.email")}/>
                                <TextField label={t('Bank account')} fullWidth variant="standard" defaultValue={invoice.sender.bankAccount} {...register("sender.bankAccount")}/>
                            </Box>
                        </div>
                    </div>
                    <br/>
                    <div>
                        {items.map((item, index) => (
                            <div key={item.id} className={styles.amountRow}>
                                <TextField label={t('Name')} fullWidth variant="standard" defaultValue={item.name} {...register(`items.${index}.name`)}/>
                                <TextField label={t('Amount')} fullWidth variant="standard" defaultValue={item.amount} {...register(`items.${index}.amount`)}/>
                                <TextField label={t('Unit')} fullWidth variant="standard" defaultValue={item.unit} {...register(`items.${index}.unit`)}/>
                                <TextField label={t('Tax')} fullWidth variant="standard" defaultValue={item.tax} {...register(`items.${index}.tax`)}/>
                                <TextField label={t('Price')} fullWidth variant="standard" defaultValue={item.price} {...register(`items.${index}.price`)}/>
                                <DeleteIcon className={styles.deleteItem} onClick={() => handleDeleteItem(item.id)} />
                            </div>
                        ))}
                    </div>
                </form>

                <Box className={styles.submitBox}>
                    <Button onClick={handleAddItem} variant="contained" color="primary">
                        {t('Add Item')}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default EditInvoice;