"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Image from "next/image";
import "@/styles/login.scss";
import { changeSignup,forgetPassword,loginEmail,loginPassword,reset,signupEmail,verificationEmail,verificationPassword,signupPassword,userName,forgetEmail, resetPassword, confirmResetPassword, resetPasswordEmail, loading } from "@/app/redux/features/userslice";
import { userLoginSchema, userSignupSchema , forgetPasswordSchema} from "@/zodValidations/zodValidations";
import { FORGET_PASSWORD, LOGIN, RESET_PASSWORD, SIGNUP } from "@/app/APIRequest/userAPI";
import { passwordResetSchema } from "@/zodValidations/zodValidations";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VERIFICATION } from '@/app/APIRequest/userAPI';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import { toastPopUp } from "@/app/CommonFunctions/popupInfo";
const VerificationPage = () => {
  const dispatch = useAppDispatch();
  const {token} = useParams();
  const selector = useAppSelector((store) => store.userslice);
  
  
  const intervalRef = useRef(null);

  const verify = async (e) => {
    dispatch(loading(true));
    try {

      try {
        await userLoginSchema.parse({email:selector.verificationEmail,password:selector.verificationPassword})
      } catch (error) {
        error.errors.forEach((e)=>{
          toastPopUp(e.message);
        })
        return;
      }
      const res = await VERIFICATION(token,selector.verificationEmail,selector.verificationPassword);

      if (res.data && res.data.message === "SFL") {
        toastPopUp("Sucessfull verified");
        intervalRef.current = setInterval(() => {
          router.push('/');
        }, 5000);
      } else if (res.response && res.response.data) {
        const { message } = res.response.data;
        if (message === 'NV') {
          toastPopUp("Not a valid user");
        } else if (message === 'SEXT') {
          toastPopUp("Internal server error");
        }else if(message === 'TE'){
          toastPopUp("Try t login then you will agin receive new mail");
        }else if(message === 'ISE'){
          toastPopUp("Internal server error");
        }else {
          toastPopUp("Internal server error");
        }
      }
    } catch (error) {
      toastPopUp("Internal server error");
    }finally{
      dispatch(loading(false));
    }
  };

  useEffect(() => {
   
    return () => {
      clearInterval(intervalRef.current);
    };
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
          <h2>Verification</h2>
          <form action="" onSubmit={verify}>
          <label htmlFor="email" >Email</label>
           <input id="email" type="email" onChange={e=>dispatch(verificationEmail(e.target.value))}/>
            <label htmlFor="password" onChange={e=>dispatch(verificationPassword(e.target.value))}>Password</label>
            <input id="password" type="password"  />
            {
              selector.loading?
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
              :
              <input type="submit" disabled={selector.loading} className="submit box-hover-up-animation" />
            }
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
