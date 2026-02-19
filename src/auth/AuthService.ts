// /* this file contain general logic for authentication */
// import axios from 'axios';
// import { AUTHORIZE_URI, CLIENT_ID, REDIRECT_URI, ROOT_API_URL, SCOPE_FULL, SCOPE_READ, TOKEN_URI } from '../shared/Constant';
// import type { LoginResponse } from './AuthDto';

// // async(navigate?: NavigateFunction)
// export const callback = async() => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const code = urlParams.get('code');

//   if (!code) {
//     // navigate?.('/login');
//     throw new Error('Missing authorization code');
//   }

//   return code;
// };

// export const authorize = async(codeChallenge:string, codeChallengeMethod:string) => {
//   const authUrl =
//     `${ROOT_API_URL}/${AUTHORIZE_URI}?` +
//     `scope=${SCOPE_READ}&` +
//     `response_type=code&` +
//     `client_id=${CLIENT_ID}&` +
//     `redirect_uri=${REDIRECT_URI}&`+
//     `code_challenge=${codeChallenge}&`+
//     `code_challenge_method=${codeChallengeMethod}`;

//    window.location.href = authUrl;
// };

// export const getToken = async(code:string) =>{
//     const res:LoginResponse = await axios.post(`${ROOT_API_URL}/${TOKEN_URI}`, {
//       code, codeVerifier
//     }, {
//       withCredentials: true
//     })

//     return res;
// }


