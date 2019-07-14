import React from 'react';
const { createContext, useContext, useReducer } = React;

//  专门处理reducer-in-action
function reducerInAction(state, action) {
    //  如果传过来的action.reducer是函数的话
    if (typeof action.reducer === 'function') {
        return action.reducer(state)  //  返回结果
    }
    return state;
}

export default function createStore(params) {
    const {
        initialState
    } = {
        initialState: {},
        ...params  //  如果有initialState就被...params覆盖了，没有就是一个空对象
    }
    //  创建一个全局状态的管理机制
    const AppContext = createContext()
    //  构建初始化的store
    const store = {
        _state: initialState,
        dispatch: undefined,
        getState: () => store._state,
        useContext: () => {
            return useContext(AppContext)
        }
    }
    //  负责分发action和reducer用的函数、管理中间件
    const middlewareReducer = (lastState, action) => {
        //  为了简便这些操作，我们使用了一个思想：reducerInAction
        /*    switch (action.type) {
               case 'add':
                   return {
                       ...lastState,
                       age: lastState.age + 1
                   }
               default:
                   return {
                       ...lastState
                   }
           } */

        const nextState = reducerInAction(lastState, action);
        //  更新store里面的_state，当用户在getState()的时候可以拿到最新的state
        //  store数据时时更新
        store._state = nextState;
        return nextState; //  返回结果
    }
    //  创建一个Provider
    const Provider = props => {
        const [state, dispatch] = useReducer(middlewareReducer, initialState);
        if (!store.dispatch) {
            store.dispatch = async (action) => {
                dispatch(action)
            }
        }

        return <AppContext.Provider {...props} value={state} />
    }

    return {
        Provider,
        store
    }
}