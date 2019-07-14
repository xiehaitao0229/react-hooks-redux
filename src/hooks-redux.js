import React from 'react';
const { createContext, useContext, useReducer } = React;

export default function createStore(params) {
    const {
        initialState
    } = {
        initialState: {},
        ...params  //  如果有initialState就被...params覆盖了，没有就是一个空对象
    }

    //  创建一个全局状态的管理机制
    const AppContext = createContext()

    //  负责分发action和reducer用的函数、管理中间件
    const middlewareReducer = (lastState, action) => {
        switch (action.type) {
            case 'add':
                return {
                    ...lastState,
                    age: lastState.age + 1
                }
            default:
                return {
                    ...lastState
                }
        }
    }

    //  构建初始化的store
    const store = {
        _state: initialState,
        dispatch: undefined,
        getState: () => store._state,
        useContext: () => {
            return useContext(AppContext)
        }
    }
    const Provider = props => {
        const [state, dispatch] = useReducer(middlewareReducer, initialState);
        store._state = state;  //  更新store里面的_state，当用户在getState()的时候可以拿到最新的state
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