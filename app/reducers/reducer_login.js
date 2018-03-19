import { USER_LOGIN, USER_LOGOUT } from '../actions/index';

export default (state = null, action) => {
  switch(action.type) {
    case USER_LOGIN:
      return action.payload.data.hasOwnProperty('display_name')
        ? action.payload.data
        : { error: 'Invalid user name or password' };
    case USER_LOGOUT:
      return action.payload
  }

  return state;
}
