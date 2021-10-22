import * as Communicator from '../utils/Communicator';

const UserInfo_URL = '/get_user_info/';

export const getUserInfo = (successCallback, failedCallback) => {
  Communicator.sendRequest(UserInfo_URL, Communicator.REQUEST_ACTION.GET, '', {
    successCallback: successCallback,
    failedCallback: failedCallback,
  });
};
