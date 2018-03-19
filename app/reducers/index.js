import { combineReducers } from 'redux';

import userLogin from './reducer_login';
import runSearch from './reducer_runSearch';

const rootReducer = combineReducers({
  user: userLogin,
  loc: runSearch
});

export default rootReducer;
