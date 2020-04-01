import { doGet, doPost } from '../../axiosconfig/index.js';
const loginService = {
    login: params => doPost('/authenticate', params),
     
};
export default { loginService };
