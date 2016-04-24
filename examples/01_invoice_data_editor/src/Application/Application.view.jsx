import { Map } from 'immutable'
import React from 'react'
import { connect } from 'react-redux'
import { forwardTo } from 'reelm/composition'

import InvoiceEditFormView from '../InvoiceEditForm/InvoiceEditForm.view'
import { InvoiceEditForm } from './Application.reducer'
import { formSelector } from '../InvoiceEditForm/InvoiceEditForm.reducer'

@connect(state => ({ 
    invoice: formSelector(state.get('invoice'), state.get('form')).toJS()
}))
export default class Application extends React.Component {
    render() {
        var { invoice, dispatch, lastUserInputInvioce } = this.props;
        return <div>
                <InvoiceEditFormView invoice={invoice} lastUserInput={lastUserInputInvioce} dispatch={forwardTo(dispatch, InvoiceEditForm)} />
            </div>
    }
}
