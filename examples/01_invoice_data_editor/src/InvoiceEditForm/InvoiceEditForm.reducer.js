import { Map, List } from 'immutable'
import { defineReducer } from 'reelm/composition'
import invoiceReducer, { Change } from '../Invoice/invoice.reducer'

import { formulaWrapper, createFormulaReducers, createFormulaSelectors, formula, defaultBehaviour, indexedListFormula } from 'reelm-formulas'

export const Invoice = 'Invoice';

function value3OrSumCalc(currentValue, invoice) {
    var value1 = parseInt(invoice.get('value1'));
    var value2 = parseInt(invoice.get('value2'));
    if (!!value1 && !!value2)
        return value1 + value2;
    return undefined;
}

function value13OrSumCalc(currentValue, invoice) {
    var value1 = parseInt(invoice.get('value11'));
    var value2 = parseInt(invoice.get('value12'));
    var value3 = parseInt(invoice.get('value3OrSum'));
    if (!!value1 && !!value2 && !!value3)
        return value1 + value2 + value3;
    return undefined;
}

function goodItemValue3OrSumCalc(currentValue, goodItem, index, root) {
    var value1 = parseInt(goodItem.get('value1'));
    var value2 = parseInt(goodItem.get('value2'));
    var value3 = parseInt(root.get('value13OrSum'));
    if (!!value1 && !!value2 && !!value3)
        return value1 + value2 + value3;
    return undefined;
}

var formulas = [
    formula(['value3OrSum'], defaultBehaviour(value3OrSumCalc)),
    formula(['value13OrSum'], defaultBehaviour(value13OrSumCalc)),
    indexedListFormula(['goodItems'], [
        formula(['sumValue'], defaultBehaviour(goodItemValue3OrSumCalc)),
    ])
]

var formulasBehaviourReducer = createFormulaReducers(formulas);

const formulasSelector = createFormulaSelectors(formulas);

export function formSelector(invoice, form) {
    return formulasSelector(invoice, form.get('formulas'))
}

export default defineReducer(Map({ invoice: undefined, form: Map({ formulas: undefined }) }))
    .scopeTo(Invoice, { data: ['invoice'], formula: ['form', 'formulas'] }, formulaWrapper(formulasBehaviourReducer, invoiceReducer))

