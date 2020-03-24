import { doGet } from '../../axiosconfig/index.js';
const loginService = {
    login: params => doGet('authenticate', params)
};
export default { loginService };
