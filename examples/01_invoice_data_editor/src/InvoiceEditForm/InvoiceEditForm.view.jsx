import React from 'react'
import { forwardTo } from 'reelm/composition'

import { GoodItem, Change, Add, Delete } from '../Invoice/invoice.reducer'
import { Invoice } from './InvoiceEditForm.reducer'

export default function({ invoice, dispatch }) {
    var invoiceDispatch = forwardTo(dispatch, Invoice);
    var onChange = data => invoiceDispatch({ type: Change, data: data });

    var goodItemsDispatch = forwardTo(invoiceDispatch, GoodItem);
    var onAddGoodItem = data => goodItemsDispatch({ type: Add });

    return <div>
            <div>
                <input value={invoice.value1 || ''} onChange={e => onChange({ value1: e.target.value })} />
                <input value={invoice.value2 || ''} onChange={e => onChange({ value2: e.target.value })} />
                <input value={invoice.value3OrSum.value || ''} onChange={e => onChange({ value3OrSum: e.target.value })} />
                lastUserInput: {invoice.value3OrSum.lastUserInput}
            </div>
            <div>
                <input value={invoice.value11 || ''} onChange={e => onChange({ value11: e.target.value })} />
                <input value={invoice.value12 || ''} onChange={e => onChange({ value12: e.target.value })} />
                <input value={invoice.value13OrSum.value || ''} onChange={e => onChange({ value13OrSum: e.target.value })} />
                lastUserInput: {invoice.value13OrSum.lastUserInput}
            </div>
            <div>
                <div>GoodItems:</div>
                <div>
                    {invoice.goodItems.map((goodItem, index) => {
                        var goodItemDispatch = forwardTo(goodItemsDispatch, index);
                        var onChange = data => goodItemDispatch({ type: Change, data: data })
                        var onDelete = data => goodItemDispatch({ type: Delete })

                        return (<div key={index}>
                            V1: <input value={goodItem.value1 || ''} onChange={e => onChange({ value1: e.target.value })} />
                            V2: <input value={goodItem.value2 || ''} onChange={e => onChange({ value2: e.target.value })} />
                            V1 + V2: <input value={goodItem.sumValue.value || ''} onChange={e => onChange({ sumValue: e.target.value })} />
                            lastUserInput: {goodItem.sumValue.lastUserInput}
                            <button onClick={onDelete}>x</button>
                        </div>)
                    })} 
                </div>
                <div><button onClick={onAddGoodItem}>Add</button></div>
            </div>
        </div>
}
/*Sum: <input value={goodItem.value3OrSum.value || ''} onChange={e => onChange({ value3OrSum: e.target.value })} />*/