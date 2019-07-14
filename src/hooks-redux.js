import React from 'react';
const { createContext, useContext, useReducer } = React;

//  中间件
function middlewareLog(store, lastState, nextState, action, isDev) {
    if (isDev) {
        //  如果是开发环境
        console.log(action.type)
        console.log('lastState: ', lastState)
        console.log('nextState: ', nextState)
    }
}

//  专门处理reducer-in-action
function reducerInAction(state, action) {
    //  如果传过来的action.reducer是函数的话
    if (typeof action.reducer === 'function') {
        return action.reducer(state)  //  返回结果
    }
    return state;
}

export default function createStore(params) {
    //  开启对中间件的检查模式
    let isCheckMiddleware = false;
    const {
        isDev,
        initialState,
        middlewares
    } = {
        isDev: false,
        initialState: {},
        middlewares: params.isDev ? [middlewareLog] : undefined, //  如果是开发环境就去调用，不过主要你自己设置
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

        let nextState = reducerInAction(lastState, action);


        //  集成中间件
        if (!isCheckMiddleware) {
            if (!Array.isArray(middlewares)) {
                 throw new Error('middleware必须是一个数组')
            }
            isCheckMiddleware = true;
            //  执行中间件
            for (let item of middlewares) {
                const newState = item(store, lastState, nextState, action, isDev)
                if (newState) {  //  如果中间件也对state的修改
                    nextState = newState;
                }
            }
        }


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
                //  异步的时候
                if (typeof action === 'function') {
                    await action(dispatch, store.getState())
                } else {
                    //  同步的时候
                    dispatch(action)
                }
            }
        }

        return <AppContext.Provider {...props} value={state} />
    }

    return {
        Provider,
        store
    }
}