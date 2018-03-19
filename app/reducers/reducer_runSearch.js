import { RUN_SEARCH } from '../actions/index';

export default (state = '', action) => {
  switch(action.type) {
    case RUN_SEARCH:
      return action.payload;
  }

  return state;
}
