// 管理功能配置
// 只有当ADMIN_ENABLED为true时，才显示写文章、编辑和删除按钮
export const CONFIG = {
  ADMIN_ENABLED: import.meta.env.VITE_ADMIN_ENABLED === 'true' || false
};
