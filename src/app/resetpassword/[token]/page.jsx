"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Image from "next/image";
import React, { useEffect } from "react";
import "@/styles/login.css";
import { changeSignup,forgetPassword,loginEmail,loginPassword,reset,signupEmail,signupPassword,userName,forgetEmail, resetPassword, confirmResetPassword, resetPasswordEmail, loading } from "@/app/redux/features/userslice";
import { userLoginSchema, userSignupSchema , forgetPasswordSchema} from "@/zodValidations/zodValidations";
import { FORGET_PASSWORD, LOGIN, RESET_PASSWORD, SIGNUP } from "@/app/APIRequest/userAPI";
import { useParams } from "next/navigation";
import { passwordResetSchema } from "@/zodValidations/zodValidations";
import { toastPopUp } from "@/app/CommonFunctions/popupInfo";
import Spinner from "@/app/Spinner";
import { useRouter } from "next/router";
const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {token} = useParams();
  const selector = useAppSelector((store) => store.userslice);
  


  async function submit(e){
    e.preventDefault();
    console.log(selector.resetPassword)
   try {
    const resetPassword =await passwordResetSchema.parse({
      email:selector.resetPasswordEmail,
      password:selector.resetPassword
    })
    if(selector.resetPassword === selector.confirmResetPassword){
      console.log("matched");
      resetPasswordPost(selector.resetPasswordEmail,selector.resetPassword,token);
    }else{
      toastPopUp('Password mot matched with confirm password');
    }
   } catch (error) {
    if(error.errors){
      error.errors.forEach((e)=>{
        toastPopUp(e.message);
      })
    }
    console.log(error)
   }
  }

  function resetPasswordPost(email,newPassword,token){
    dispatch(loading(true))
    RESET_PASSWORD(email,newPassword,token)
    .then((res)=>{
      if(res.data && res.data.message && res.data.message === "SFL"){
        toastPopUp("Sucessfully reseted password ");
      }else if(res.response.data.message === 'VAE'){
        toastPopUp("Validation Error");
      }else if(res.response.data.message === 'UNE'){
        toastPopUp("User Not Exist");
      }else if(res.response.data.message === 'UNV'){
        toastPopUp("User Not verified please loging aging to get verification email you will get redirected to login");
        setTimeout(()=>{
          router.push('/user');
        },3000)
      }else if(res.response.data.message="TMR"){
        toastPopUp("Too many request");
      }else if(res.response.data.message == "TEXP"){
        toastPopUp("Session expired please login again you are going to redirect to login");
        setTimeout(()=>{
          router.push('/user');
        },3000)
      }else if(res.response.data.message == "ISE"){
        toastPopUp("Internal server error");
      }else{
        toastPopUp("Something went wrong");
      }
    }).catch((error)=>{
      toastPopUp("Something went wrong");
    }).finally(()=>{
      dispatch(loading(false))
    })
  }

  useEffect(() => {
    console.log(selector,token);
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
          <h2>Forget Password</h2>
          <form action="" onSubmit={submit}>
          <label htmlFor="email" >Email</label>
           <input id="email" type="email" onChange={(e)=>dispatch(resetPasswordEmail(e.target.value))} />
            <label htmlFor="password" >New Password</label>
            <input id="password" type="password" onChange={(e)=>dispatch(resetPassword(e.target.value))} />
            <label htmlFor="re-password" >Re Enter New Password</label>
            <input id="re-password" type="password" onChange={(e)=>dispatch(confirmResetPassword(e.target.value))} />
            {
              selector.loading?
              <button  className="submit box-hover-up-animation border-radius55 block m-auto" ><Spinner/></button>
              :
              <input type="submit" disabled={selector.loading?true:false} className="submit box-hover-up-animation" />
            }
            
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default Page;
