// import { GoogleLogin } from "react-google-login";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// const client_id = import.meta.env.VITE_CLIENT_ID;

const Login = () => {
  const Navigate = useNavigate();

  const onSuccess = (credentialResponse) => {
    // console.log(credentialResponse);
    const decode = jwtDecode(credentialResponse.credential);
    console.log(decode.given_name);
    localStorage.setItem("user", decode.given_name);
    Navigate("/");
  };

  return (
    <div className="">
      <div className="max-h-screen sm:w-[50%] flex flex-col justify-center items-center m-auto mt-[5rem] gap-5 bg-blue-200 p-5 sm:p-10 rounded-md shadow-xl border-[3px] border-transparent hover:border-blue-500 hover:shadow-blue-500/50 transition-all duration-300">
        <h1 className="text-2xl font-semibold mb-3 text-gray-800">
          Login Using Google
        </h1>
        <div>
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Login;
