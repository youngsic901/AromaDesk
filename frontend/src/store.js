import { createStore } from 'redux';

// 임시 리듀서 (나중에 교체 가능)
const initialState = {};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

export default store;
