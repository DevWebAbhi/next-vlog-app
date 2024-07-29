import React from 'react'
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PopupProvider = (
    {children}
) => {
  return (
    <>
    {children}
    <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default PopupProvider