import { useEffect } from "react";
import { AUTHORIZE_URL, CLIENT_ID, ROOT_API_URL, ROOT_URL, SCOPE_READ } from "../../shared/constant/constant";

const Authorize = () => {

  useEffect (() => {

  const authUrl =
    `${ROOT_API_URL}/${AUTHORIZE_URL}?` +
    `scope=${SCOPE_READ}&` +
    `response_type=code&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${ROOT_URL}/callback`

   window.location.href = authUrl;
  } ,[])

  return null;
}

export default Authorize;