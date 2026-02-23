import { useEffect } from "react";
import { AUTHORIZE_URI, CLIENT_ID, REDIRECT_URI, ROOT_API_URL, SCOPE_READ } from "../../shared/Constant";

const Authorize = () => {

  useEffect (() => {
  
  const authUrl =
    `${ROOT_API_URL}/${AUTHORIZE_URI}?` +
    `scope=${SCOPE_READ}&` +
    `response_type=code&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${REDIRECT_URI}&`

   window.location.href = authUrl;
  } ,[])

  return null;
}

export default Authorize;