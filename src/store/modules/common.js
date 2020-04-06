export default {
    state: {
        classesData: [] // 班级列表
    },
    mutations: {
        setClassesData(state, data) {
          state.classesData = data.val;
        }
    },
    actions: {}
};
