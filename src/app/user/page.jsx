"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Image from "next/image";
import React, { useEffect } from "react";
import "@/styles/login.css";
import {
  changeSignup,
  forgetPassword,
  loginEmail,
  loginPassword,
  loading,
  reset,
  signupEmail,
  signupPassword,
  userName,
  forgetEmail,
} from "@/app/redux/features/userslice";
import {
  userLoginSchema,
  userSignupSchema,
  forgetPasswordSchema,
} from "@/zodValidations/zodValidations";
import { FORGET_PASSWORD, LOGIN, SIGNUP } from "@/app/APIRequest/userAPI";
import { toastPopUp } from "../CommonFunctions/popupInfo";
import { useRouter } from 'next/navigation'
const Page = () => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((store) => store.userslice);
  const router = useRouter();
  const conditionalDisplay = (state) => {
    if (state) {
      return {
        display: "none",
      };
    }

    return {
      display: "block",
    };
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      let userData = null;
      if (selector.forgetPassword) {
        userData = forgetPasswordSchema.parse({
          email: selector.forgetEmail,
        });
        handleForgetPassword(userData);
      } else if (selector.signup) {
        userData = userSignupSchema.parse({
          email: selector.signupEmail,
          password: selector.signupPassword,
          userName: selector.userName,
        });
        handleSignup(userData);
      } else {
        userData = userLoginSchema.parse({
          email: selector.loginEmail,
          password: selector.loginPassword,
        });
        handleLogin(userData);
      }
      console.log(userData);
    } catch (error) {
      error.errors.forEach((e) => {
        toastPopUp(e.message);
      });
      console.error("Validation Error:", error);
    }
  };

  function handleLogin(data) {
    dispatch(loading(true));
    LOGIN(data)
      .then((res) => {
        console.log(res);
        if (res.data && res.data.message && res.data.message === "SFL") {
          
          toastPopUp("Sucessfully logged in");
          window.location.href = '/'; // Force page refresh
        } else if (res.response.data.message === "UNE") {
          toastPopUp("User not exist please signup first");
        }  else if (res.response.data.message == "ISE") {
          toastPopUp("Internal server error");
        } else if (res.response.data.message == "UNV") {
          toastPopUp("User not verified so verification mail sent to mail");
        } else if(res.response.data.message="TMR"){
          toastPopUp("Too many request");
        }else if (res.response.data.message == "VAE") {
          toastPopUp("Validation Error");
        } else {
          toastPopUp("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        toastPopUp("Something went wrong");
      })
      .finally(() => {
        dispatch(loading(false));
      });
  }

  function handleSignupLogin(data) {
    dispatch(loading(true));
    LOGIN(data)
      .then((res) => {
        console.log(res);
        if (res.data && res.data.message && res.data.message === "SFL") {
          toastPopUp("Sucessfully signed in");
          window.location.href = '/'; // Force page refresh
        } else if (res.response.data.message === "UNE") {
          toastPopUp("User not exist please signup first");
        }  else if (res.response.data.message == "ISE") {
          toastPopUp("Internal server error");
        } else if (res.response.data.message == "UNV") {
          toastPopUp("User not verified so verification mail sent to mail");
        } else if (res.response.data.message == "VAE") {
          toastPopUp("Validation Error");
        } else if(res.response.data.message="TMR"){
          toastPopUp("Too many request");
        }else {
          toastPopUp("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        toastPopUp("Something went wrong");
      })
      .finally(() => {
        dispatch(loading(false));
      });
  }

  function handleSignup(data) {
    dispatch(loading(true));
    SIGNUP(data)
      .then((res) => {
        console.log(res);
        if (res.data && res.data.message && res.data.message === "SFL") {
          handleSignupLogin(data);
        }else if (res.response.data.message == "ISE") {
          toastPopUp("Internal server error");
        } else if (res.response.data.message == "AR") {
          toastPopUp("Email already registered");
        } else if (res.response.data.message == "VAE") {
          toastPopUp("Validation Error");
        } else if(res.response.data.message="TMR"){
          toastPopUp("Too many request");
        }else {
          toastPopUp("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        toastPopUp("Something went wrong");
      })
      .finally(() => {
        dispatch(loading(false));
      });
  }

  function handleForgetPassword(data) {
    dispatch(loading(true));
    FORGET_PASSWORD(data)
      .then((res) => {
        console.log(res);
        if (res.data && res.data.message && res.data.message === "SFL") {
          toastPopUp("Reset password link sent to email");
        } else if (res.response.data.message === "UNE") {
          toastPopUp("User not exist");
        } else if (res.response.data.message == "UNV") {
          toastPopUp("User Not verified try login and get the mail to make verification");
        } else if (res.response.data.message == "ISE") {
          toastPopUp("Internal server error");
        } else if (res.response.data.message == "VAE") {
          toastPopUp("Validation Error");
        }else if(res.response.data.message="TMR"){
          toastPopUp("Too many request");
        }
         else {
          toastPopUp("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        toastPopUp("Something went wrong");
      })
      .finally(() => {
        dispatch(loading(false));
      });
  }

  useEffect(() => {
    console.log(selector);
  }, []);

  return (
    <div className="height-100vh w-1/1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex justify-center items-center">
      <div className="flex justify-between p-2 bg-gray-200 rounded-md user-box">
        <div className="h-1/1 flex flex-col items-center justify-center rotate-center">
          <h2>Next Vlog</h2>
          <Image
            src={"/loginImages/login.png"}
            alt="Login Image"
            width={200}
            height={200}
          />
        </div>

        <div className="p-5">
          <h2>{selector.signup ? "Signup" : "Login"}</h2>
          <form action="" onSubmit={submit}>
            <label
              htmlFor="username"
              style={conditionalDisplay(!selector.signup)}
            >
              Full Name
            </label>
            <input
              id="username"
              value={selector.userName}
              type="text"
              style={conditionalDisplay(!selector.signup)}
              onChange={(e) => dispatch(userName(e.target.value))}
            />
            <label htmlFor="email">Mail ID</label>
            <input
              id="email"
              value={
                selector.forgetPassword
                  ? selector.forgetEmail
                  : selector.signup
                  ? selector.signupEmail
                  : selector.loginEmail
              }
              type="email"
              onChange={(e) =>
                dispatch(
                  selector.forgetPassword
                    ? dispatch(forgetEmail(e.target.value))
                    : selector.signup
                    ? signupEmail(e.target.value)
                    : loginEmail(e.target.value)
                )
              }
            />
            <label
              htmlFor="password"
              style={conditionalDisplay(selector.forgetPassword)}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={
                selector.signup
                  ? selector.signupPassword
                  : selector.loginPassword
              }
              style={conditionalDisplay(selector.forgetPassword)}
              onChange={(e) =>
                dispatch(
                  selector.signup
                    ? signupPassword(e.target.value)
                    : loginPassword(e.target.value)
                )
              }
            />
            {selector.loading ? (
              <div
                role="status"
                className="submit rounded-3xl rounded-3xl box-hover-up-animation"
              >
                <svg
                  aria-hidden="true"
                  class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : (
              <input
                type="submit"
                value={
                  selector.forgetPassword
                    ? "Reset Password"
                    : selector.signup
                    ? "Signup"
                    : "Login"
                }
                disabled={selector.loading ? true : false}
                className="submit box-hover-up-animation"
              />
            )}
          </form>
          <div style={conditionalDisplay(selector.forgetPassword)}>
            <h1
              disabled={selector.loading ? true : false}
              className="text-center m-5 cursor-pointer hover-color-blue"
              onClick={() => {
                dispatch(changeSignup(!selector.signup));
                dispatch(reset());
              }}
            >
              {selector.signup ? "Already have accpunt ?" : "New user ?"}
            </h1>
          </div>
          <div style={conditionalDisplay(selector.signup)}>
            <h1
              disabled={selector.loading ? true : false}
              className="text-center m-5 cursor-pointer hover-color-blue"
              onClick={() => {
                dispatch(forgetPassword(!selector.forgetPassword));
                dispatch(reset());
              }}
            >
              {selector.forgetPassword ? "Login" : "Forget Password"}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
