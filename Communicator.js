import axios from 'axios';
import * as Utils from './Utils';

export const REQUEST_ACTION = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

/* Rest API call send request
        @param url: request URL
        @param Method: Request type (GET/POST/PUT/DELETE)
        @param Body: Post/Put body request in object format
        @param options: contain successCallback/failedcallback to handle request result
    */
export const sendRequest = async function (url, method, body, options) {
  try {
    const csrftoken = getCookie('csrftoken');
    let reqBody = '';

    if (method === REQUEST_ACTION.POST || method === REQUEST_ACTION.PUT || method === REQUEST_ACTION.DELETE) {
      reqBody = body;
    }

    const settings = {
      method: method,
      url: url,
      data: reqBody,
      headers: {
        'X-CSRFToken': csrftoken,
      },
    };

    if (options.isZipped || options.isArrayBuffer) {
      settings.responseType = 'arraybuffer';
    }

    const result = await axios.request(settings);
    if (options.successCallback) {
      let data = result.data;
      if (options.isZipped) {
        data = Utils.handleZippedData(data);
      }
      options.successCallback(data);
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data && options.failedCallback) {
        options.failedCallback(error.response);
      }
    } else {
      if (options.failedCallback) {
        options.failedCallback(error);
      }
    }
  }
};

export const prepareCSRFToken = () => {
  return axios.get('/csrftoken').then(response => {
    return response;
  });
};

export const getCsrftoken = () => {
  return getCookie('csrftoken');
};

const getCookie = function (name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    let cookies = document.cookie.split(';');
    for (let i = 0, cnt = cookies.length; i < cnt; i++) {
      let cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
