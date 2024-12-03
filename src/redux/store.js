// src/redux/store.js
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './rootReducer';
import rootEpic from './rootEpic';

// Create the epic middleware
const epicMiddleware = createEpicMiddleware();

// Create the Redux store with rootReducer and apply the epic middleware
const store = createStore(
  rootReducer,
  applyMiddleware(epicMiddleware)  // Apply the epic middleware
);

// Run the root epic
epicMiddleware.run(rootEpic);

export default store;
