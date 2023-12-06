import {combineReducers} from '@reduxjs/toolkit';
import collectorReducer from './collectors';

const rootReducer = combineReducers({
  collectors: collectorReducer,
});

export default rootReducer;