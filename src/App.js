import React from 'react';
import createStore from './hooks-redux'

const {
  Provider,
  store
} = createStore({
  initialState: {
    name: 'xht',
    age: 18
  }
})

function timeOutAdd(a) {
  return new Promise(callback => setTimeout(() => callback(a + 1), 1000));
}

//  如果action是异步的时候
const actionAdd = () => async (dispatch, state) => {
  const age = await timeOutAdd(state.age)
  dispatch({
    type: 'add',
    reducer(state) {  //  在action里面操作reducer
      return {
        ...state,
        age
      }
    }
  })
}

/* //  action
function actionAdd(){
  return {
    type:'add',
    reducer(state){  //  在action里面操作reducer
      return {
        ...state,
        age:state.age+1
      }
    }
  }
} */

function Button(props) {
  function handleAdd() {
    store.dispatch(actionAdd())
  }

  return <button onClick={handleAdd}>点击增加</button>
}

function Page(props) {
  const state = store.useContext();
  const getNewState = store.getState();
  return (
    <>
      <p>{state.age}</p>
      <p>getState取出来 {getNewState.age}</p>
      <Button />
    </>
  )
}

function App() {
  return (
    <Provider>
      <Page />
    </Provider>
  );
}

export default App;
