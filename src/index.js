import { Map, List } from 'immutable'

function pipe(...functons) {
    return functons.reduceRight((r, f) => (...args) => r(f(...args)), x => x);
}

export function indexedListFormula(path, childFormulas) {
    var childReducer = createFormulaReducers(childFormulas);
    var childSelector = createFormulaSelectors(childFormulas);

    return {
        select: function([data, state]) {
            var formulaState = state.getIn(path);
            formulaState = formulaState || List();
            var currentList = data.getIn(path);
            for(var i = 0; i < currentList.size; i++) {
                var currentItem = currentList.get(i);
                var stateItem = formulaState.get(i);
                currentItem = childSelector(currentItem, stateItem)
                currentList = currentList.set(i, currentItem);
            }
            data = data.setIn(path, currentList);
            return data;
        },
        reduce: function([data, state = Map()], previousData, action, ...formulaParams) {
            var formulaState = state.getIn(path);
            formulaState = formulaState || List();
            
            var currentList = data.getIn(path);
            previousData = previousData || data
            var previousList = previousData.getIn(path) || currentList;
            for(var i = 0; i < currentList.size; i++) {
                var currentItem = currentList.get(i);
                var previousItem = previousList.get(i) || currentItem;
                var stateItem = formulaState.get(i);

                [currentItem, stateItem] = childReducer([currentItem, stateItem], previousItem, action, i, data, ...formulaParams)                
                currentList = currentList.set(i, currentItem);
                formulaState = formulaState.set(i, stateItem);
            }
            data = data.setIn(path, currentList);
            state = state.setIn(path, formulaState);
            return [data, state];
        }
    }
}

export function defaultBehaviour(formula) {
    return {
        select: function ([data, state]) {
            return ({
                value: data,
                lastUserInput: state && state.get('lastUserInput')
            });
        },
        reduce: function ([currentValue, state = Map({ applyAuto: true })], previousValue, action, ...formulaParams) {            
            var calculatedValue = formula(currentValue, ...formulaParams);

            var targetValueChanged = previousValue != currentValue;
            var calculatedValueSameAsInput = currentValue == calculatedValue;

            state = state.updateIn(['applyAuto'], applyAuto => targetValueChanged ? calculatedValueSameAsInput : applyAuto);
            state = state.updateIn(['lastUserInput'], lastUserInput => (targetValueChanged) ? (calculatedValueSameAsInput ? lastUserInput : currentValue) : lastUserInput);
            
            if (state.getIn(['applyAuto'])) {
                currentValue = calculatedValue;
            }
            return [currentValue, state];
        }
    }
}

export function formula(path, behaviour) {
    return {
        select: ([data, state]) => data.setIn(path, behaviour.select([data.getIn(path), state.getIn(path)])),
        
        reduce: function([currentData, state = Map()], previousData, action, ...formulaParams) {
            var formulaState = state.getIn(path);
            var current = currentData.getIn(path);
            var previous = previousData.getIn(path);
            
            [current, formulaState] = behaviour.reduce([current, formulaState], previous, action, currentData, ...formulaParams) 

            state = state.setIn(path, formulaState);
            currentData = currentData.setIn(path, current);            
            return [currentData, state];
        }
    }
}

export function createFormulaReducers(formulas) {
    return function([data, formula], previousData, action, ...rest) {
        var formulaReducers = formulas
            .map(formula => formula.reduce)
            .map(reduce => _ => reduce(_, previousData, action, ...rest));
        return pipe(...formulaReducers)([data, formula]);
    }
}

export function createFormulaSelectors(formulaReducers) {
    return function(data, formula) {
        for(var i = 0; i < formulaReducers.length; i++) {
            data = formulaReducers[i].select([data, formula]);
        }
        return data;
    }
}


export function formulaWrapper(formulasReducer, dataReducer) {
    return function (state = Map({ data: undefined, formula: undefined }), action) {
        if (!action)
            return state;
        var previousData = state.get('data');
        var newData = dataReducer(previousData, action).state;
        var formula = state.get('formula');
        [newData, formula] = formulasReducer([newData, formula], previousData, action)
        return state.set('data', newData).set('formula', formula);
    }
}