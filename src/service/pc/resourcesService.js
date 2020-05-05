import { doGet, doPost, doPut, doDelete } from '../../axiosconfig/index.js';
const resourcesService = {
    // 获取资源列表
    getResourcesList: params => doGet('/files', params),
    // 添加资源
    addResources: params => doPost('/files', params),
    editResources: params => doPut('/files', params),
    removeResources: id => doDelete('/files/' + id)
};
export default { resourcesService };
