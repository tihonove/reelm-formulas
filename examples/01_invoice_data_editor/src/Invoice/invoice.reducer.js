import { Map, List } from 'immutable'
import { defineReducer } from 'reelm/composition'

export const Change = 'Change';
export const GoodItem = 'GoodItem';

export const Add = 'Add';
export const Delete = 'Delete';

const listReducer = itemReducer => 
    defineReducer(List())
        .on(Add, (list, { item } = {}) => list.push(itemReducer(item)))
        .scopeTo('[Index]', ({ Index }) => [Index], itemReducer)
        .on(`[Index].${Delete}`, (list, { match: { Index } }) => list.delete(Index));

const goodItemReducer = defineReducer(Map())
    .on(Change, (goodItem, { data }) => goodItem.mergeDeep(data));

export default defineReducer(Map())
    .scopeTo(GoodItem, ['goodItems'], listReducer(goodItemReducer))
    .on(Change, (invoice, { data }) => invoice.mergeDeep(data));
    