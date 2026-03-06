
export const ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const CALLBACK_URL = import.meta.env.VITE_CALLBACK_URL
export const AUTHORIZE_URL = import.meta.env.VITE_AUTHORIZE_URL;
export const TOKEN_URL = import.meta.env.VITE_TOKEN_URL;
export const ROOT_URL = import.meta.env.VITE_ROOT_URL;

export const SCOPE_READ = "api:read";
export const SCOPE_WRITE = "api:write";
export const SCOPE_READ_SELF = "openid";
export const SCOPE_FULL = `${SCOPE_READ} ${SCOPE_WRITE} ${SCOPE_READ_SELF}`;


