import React, {useRef, useEffect, useState} from 'react';
import { useTranslation } from "react-i18next";
import {
    Container,
    TextField,
    Typography,
    Button,
    Paper,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import styles from './AddNewInvoice.module.scss';
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {InvoiceModel} from "../models/invoice-model";
import {addInvoice, editInvoice} from "../../services/invoices-service";
import {useNavigate} from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import {enqueueSnackbar} from "notistack";

const AddNewInvoice: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [ invoice ] = useState({} as InvoiceModel);
    const [items, setItems] = useState(invoice?.items || [
        { name: '', amount: '', unit: '', tax: '', price: '' },
        { name: '', amount: '', unit: '', tax: '', price: '' }
    ]);
    const { register, handleSubmit, control, formState: { errors, isValid }, trigger } = useForm<InvoiceModel>({
        mode: 'onBlur',
        defaultValues: {
            name: '',
            recipient: { companyName: '' },
            sender: { companyName: '' }
        }
    });

    const onSubmit: SubmitHandler<InvoiceModel> = async (data) => {
        data.createdAt = data.createdAt.toString();
        data.validUntil = data.validUntil.toString();
        try {
            await addInvoice(data);
            enqueueSnackbar(t(`You successfully created ${data.name}`), { variant: 'success' });
            navigate('/list-of-invoices');
        } catch (error) {
            enqueueSnackbar(t('Error creating invoice'), { variant: 'error' });
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

    const goBack = () => {
        navigate(`/list-of-invoices`);
    };

    const handleAddItem = () => {
        setItems(prevItems => [...prevItems, { name: '', amount: '', unit: '', tax: '', price: '' }]);
    };

    const handleDeleteItem = (index: number) => {
        setItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    return (
        <Container>
            <Paper elevation={3} className={styles.paper}>
                <div className={styles.headerContainer}>
                    <div>

                        <TextField
                            label={t('INVOICE.NAME')}
                            fullWidth variant="standard"
                            {...register("name", { required: t('Name is required') })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                        <span className={styles.createdDate}>
                           <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Controller
                                        name="createdAt"
                                        control={control}
                                        defaultValue={new Date ()}
                                        render={({ field }) => (
                                            <DatePicker
                                                variant="standard"
                                                label={t('INVOICE.CREATED_DATE')}
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
                                    defaultValue={new Date ()}
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
                            disabled={(!isValid && items.length === 0)}
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
                                {...register("recipient.companyName", { required: t('Company name is required') })}
                                error={!!errors.recipient?.companyName}
                                helperText={errors.recipient?.companyName?.message}
                            />
                            <TextField label={t('City')} fullWidth variant="standard" {...register("recipient.city")}/>
                            <TextField label={t('Street')} fullWidth variant="standard" {...register("recipient.street")}/>
                            <TextField label={t('Postcode')} fullWidth variant="standard" {...register("recipient.postcode")}/>
                            <TextField label={t('NIP')} fullWidth variant="standard" {...register("recipient.nip")}/>
                            <TextField label={t('Tel')} fullWidth variant="standard" {...register("recipient.phone")}/>
                            <TextField label={t('Email')} fullWidth variant="standard" {...register("recipient.email")}/>
                            <TextField label={t('Bank account')} fullWidth variant="standard" {...register("recipient.bankAccount")}/>
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
                                {...register("name")}
                                {...register("sender.companyName", { required: t('Company name is required') })}
                                error={!!errors.sender?.companyName}
                                helperText={errors.sender?.companyName?.message}
                            />
                            <TextField label={t('City')} fullWidth variant="standard" {...register("sender.city")}/>
                            <TextField label={t('Street')} fullWidth variant="standard" {...register("sender.street")}/>
                            <TextField label={t('Postcode')} fullWidth variant="standard" {...register("sender.postcode")}/>
                            <TextField label={t('NIP')} fullWidth variant="standard" {...register("sender.nip")}/>
                            <TextField label={t('Tel')} fullWidth variant="standard" {...register("sender.phone")}/>
                            <TextField label={t('Email')} fullWidth variant="standard" {...register("sender.email")}/>
                            <TextField label={t('Bank account')} fullWidth variant="standard" {...register("sender.bankAccount")}/>
                        </Box>
                    </div>
                </div>
                <br/>
                <div>
                    {items.map((item, index) => (
                        <div key={index} className={styles.amountRow}>
                            <TextField
                                label={t('Name')}
                                fullWidth
                                variant="standard"
                                {...register(`items.${index}.name`, { required: t('Name is required') })}
                            />
                            <TextField label={t('Amount')} fullWidth variant="standard" {...register(`items.${index}.amount`)}/>
                            <TextField label={t('Unit')} fullWidth variant="standard" {...register(`items.${index}.unit`)}/>
                            <TextField label={t('Tax')} fullWidth variant="standard" {...register(`items.${index}.tax`)}/>
                            <TextField label={t('Price')} fullWidth variant="standard" {...register(`items.${index}.price`)}/>
                            <DeleteIcon className={styles.deleteItem} onClick={() => handleDeleteItem(index)} />
                        </div>
                    ))}
                </div>
                <Box className={styles.submitBox}>
                    <Button onClick={handleAddItem} variant="contained" color="primary">
                        {t('Add Item')}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddNewInvoice;