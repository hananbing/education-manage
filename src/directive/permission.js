export default {
    inserted(el, binding, vnode) {
        const { value } = binding;
        const roles = JSON.parse(sessionStorage.userInfo).authorities;
        if (value && value.length > 0) {
            const permissionRoles = value;
            const hasPermission = roles.some(role => {
                return permissionRoles.includes(role);
            });
            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el);
            }
        }
    }
};
