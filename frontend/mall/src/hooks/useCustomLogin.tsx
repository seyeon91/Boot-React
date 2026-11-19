import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { loginPostAsync, logout, save } from "../slices/loginSlice"
import { Navigate, useNavigate } from "react-router"
import { useEffect } from "react"
import { getCookie } from "../util/cookieUtil"

const useCustomLogin = () => {

  const dispatch = useDispatch<AppDispatch>()

  const loginState = useSelector((state: RootState) => state.loginSlice)

  const loginStatus = loginState.status

  const navigate = useNavigate()

  useEffect(() => {

    if(!loginStatus) {

      const member = getCookie("member")

      console.log("member from cookie ")
      console.log(member)

      if(member) {
        dispatch(save(member))
      }
    }
  },[])

  const doLogin = async (email:string, pw:string) => {
    dispatch(loginPostAsync({ email, pw }))
  }

  const doLogout = () => {
    dispatch(logout(null))
  }

  const moveToLogin = () => {
    navigate("/member/login")
  }

  const moveToLoginReturn = () => {
    return <Navigate replace to="/member/login"/>
  }

  const moveToPath = (path:string) => {
    navigate({pathname: path}, {replace:true})
  }

  return {loginState, loginStatus, doLogin, doLogout, moveToLogin, moveToLoginReturn, moveToPath}
}

export default useCustomLogin