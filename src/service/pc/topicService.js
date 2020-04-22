import { doGet, doPost, doPut, doDelete } from '../../axiosconfig/index.js';
const topiceService = {
    // 获取学情列表
    getTopiceList: params => doGet('/topics', params),
    addTopice: params => doPost('/topics', params),

    editTopice: params => doPut('/topics', params),
    removeTopice: id => doDelete('/topics/' + id),
    // 获取话题回复列表
    getTopiceReplicesList: (id, params) => doGet('/topic-replies/teacher-topics/' + id, params)
};
export default { topiceService };
