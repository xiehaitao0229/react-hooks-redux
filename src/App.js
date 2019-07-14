import React from 'react';
import createStore from './hooks-redux'

const {
  Provider,
  store
} = createStore({
  initialState:{
    name:'xht',
    age:18
  }
})

//  action
function actionAdd(){
  return {
    type:'add'
  }
}

function Button(props){
  function handleAdd(){
    store.dispatch(actionAdd())
  }

  return <button onClick={handleAdd}>点击增加</button>
}

function Page(props){
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
