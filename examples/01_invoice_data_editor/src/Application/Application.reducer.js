import { Map } from 'immutable'
import { defineReducer } from 'reelm/composition'

import invoiceReducer from '../Invoice/invoice.reducer'
import invoiceEditFormReducer from '../InvoiceEditForm/InvoiceEditForm.reducer'

export const Invoice = 'Invoice';
export const InvoiceEditForm = 'InvoiceEditForm';

export default defineReducer(Map())
    .scopeTo(Invoice, ['invoice'], invoiceReducer)
    .scopeTo(InvoiceEditForm, { form: ['form'], invoice: ['invoice'] }, invoiceEditFormReducer);
    