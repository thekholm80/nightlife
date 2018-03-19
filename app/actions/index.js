import axios from 'axios';

export const USER_LOGIN = 'USER_LOGIN';

export const userLogin = (display_name, password) => {
  // withCredentials is required to send cookies with request
  const instance = axios.create(
    { withCredentials: true }
  );

  const url = '/auth/login',
        postData = {
          display_name: display_name,
          password: password
        };

  const response = instance({
    method: 'post',
    url: url,
    data: postData
  }).catch(err => console.warn("Error login post", err));

  return {
    type: USER_LOGIN,
    payload: response
  }
}

export const USER_LOGOUT = 'USER_LOGOUT';

export const userLogout = () => {
  return {
    type: USER_LOGOUT,
    payload: null
  }
}

export const RUN_SEARCH = 'RUN_SEARCH';

export const runSearch = searchString => {
  return {
    type: RUN_SEARCH,
    payload: searchString
  }
}
