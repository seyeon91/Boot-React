import axios, {AxiosError, type AxiosResponse, type InternalAxiosRequestConfig} from "axios";
import { getCookie, setCookie } from "./cookieUtil";

const jwtAxios = axios.create()

const refreshJWT = async (accessToken:string, refreshToken:string) => {

  const header = {headers: {"Authorization":`Bearer ${accessToken}`}}

  const res = await axios.get(`http://localhost:8080/api/member/refresh?refreshToken=${refreshToken}`, header)

  console.log("----------------------")
  console.log(res.data)

  return res.data
}

const beforeReq = (config: InternalAxiosRequestConfig) => {

  console.log("before request.............")

  const memberInfo = getCookie("member");

  if (!memberInfo) {
    console.log("Member Not Found");
    return Promise.reject(new Error("REQUIRE_LOGIN"));
  }

  const {accessToken} = memberInfo

  config.headers.Authorization = `Bearer ${accessToken}`

  return config
}

const requestFail = (err: AxiosError) => {

  console.log("request error............")

  return Promise.reject(err)
}

const beforeRes = async (res: AxiosResponse): Promise<AxiosResponse> => {

  console.log('before return response...........');

  const data = res.data

  if(data && data.error ==='ERROR_ACCESS_TOKEN'){

    const memberCookieValue = getCookie("member")

    const result = await refreshJWT( memberCookieValue.accessToken, memberCookieValue.refreshToken )

    console.log("refreshJWT RESULT", result)

    memberCookieValue.accessToken = result.accessToken
    memberCookieValue.refreshToken = result.refreshToken

    setCookie("member", JSON.stringify(memberCookieValue), 1)

    const originalRequest = res.config

    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`

    return await axios(originalRequest)
  }

  return res;
};

const responseFail = async (err: AxiosError) => {

  console.log("response fail error.............")
  console.log(err)

  return Promise.reject(err);
}

jwtAxios.interceptors.request.use( beforeReq, requestFail )

jwtAxios.interceptors.response.use( beforeRes, responseFail)

export default jwtAxios