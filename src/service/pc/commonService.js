import { doGet, doPost, doPut, doDelete } from '../../axiosconfig/index.js';
const commonService = {
    // 获取地址    
    getChildrenAddress: params => doGet('/addresses', params),
};
export default { commonService };