
export const ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const CALLBACK_URI = import.meta.env.VITE_CALLBACK_URI;
export const AUTHORIZE_URI = import.meta.env.VITE_AUTHORIZE_URI;
export const TOKEN_URI = import.meta.env.VITE_TOKEN_URI;
export const SCOPE_READ = 'api:read';
export const SCOPE_WRITE = 'api:write';
export const SCOPE_READ_SELF = 'openid';
export const SCOPE_FULL = `${SCOPE_READ} ${SCOPE_WRITE} ${SCOPE_READ_SELF}`;


