"use client";
import Navbar from "./Navbar";
import "../styles/createVlog.css";
import { DELETE_VLOGS, GET_VLOGS } from "@/API/vlogAPI";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  loadingVlogs,
  vlogButtonLoading,
  vlogs,
} from "@/app/redux/features/vlogSlice";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import VlogCard from "./VlogCard";
import "./page.css";
import { toastPopUp } from "./CommonFunctions/popupInfo";
import { ADD_LIKES, GET_LIKES, REMOVE_LIKES } from "@/API/likeAPI";
import { ADD_COMMENTS, GET_COMMENTS, REMOVE_COMMENT } from "@/API/commentAPI";
import { useRouter } from "next/navigation";
let userDetails = {};
const PageClintModule = ({userDetails}) => {
    const dispatch = useAppDispatch();
    const selector = useAppSelector((store) => store.vlogSlice);
    const router = useRouter();
    
    const deleteVlog = async(VlogID,index,setLoadingDeleteVlog)=>{
      try {
        setLoadingDeleteVlog(true);
        const res = await DELETE_VLOGS(VlogID);
        if (res && res.data) {
          const message = res.data.message;
          if (message == "SFL") {
            const updatedVlogs = [...selector.vlogs];
            updatedVlogs.splice(index,1);
            dispatch(vlogs(updatedVlogs));
            toastPopUp("Sucessfully deleted vlog");
          }
          console.log(res.data);
        } else {
          if (res.response && res.response.data) {
            const message = res.response.data.message;
            if (message == "SEXT") {
              toastPopUp("Internal server error");
            } else if (message == "NCF") {
              toastPopUp("NO Comment found");
            } else {
              toastPopUp("Something went wrong");
            }
          }
        }
      } catch (error) {
        toastPopUp("Something went wrong");
      }
      finally {
        setLoadingDeleteVlog(false);
      };
    }
    const getLikes = async (VlogID, ParentID, likesBand, index,setLoadingMoreLike) => {
      setLoadingMoreLike(true);
      GET_LIKES(VlogID, VlogID, likesBand)
        .then((res) => {
          console.log(res);
          if (res && res.data) {
            const message = res.data.message;
            if (message == "SEL") {
              const updatedVlogs = [...selector.vlogs];
              updatedVlogs[index] = {
                ...updatedVlogs[index],
                RecentLikes: [
                  ...updatedVlogs[index].RecentLikes,
                  ...res.data.like,
                ],
              };
              dispatch(vlogs(updatedVlogs));
            }
            console.log(res.data);
          } else {
            if (res.response && res.response.data) {
              const message = res.response.data.message;
              if (message == "SEXT") {
                toastPopUp("Internal server error");
              } else if (message == "NLF") {
                toastPopUp("NO likes found");
              } else {
                toastPopUp("Something went wrong");
              }
            }
          }
        })
        .catch((err) => {
          toastPopUp("Something went wrong");
        })
        .finally(() => {
          setLoadingMoreLike(false);
        });
    };
  
    const getComments = async (VlogID, ParentID, commentsBand, index,setLoadingMoreComment) => {
      setLoadingMoreComment(true);
      GET_COMMENTS(VlogID, VlogID, commentsBand)
        .then((res) => {
          console.log(res);
          if (res && res.data) {
            if (res.data.message === "SFL") {
              const updatedVlogs = [...selector.vlogs];
              updatedVlogs[index] = {
                ...updatedVlogs[index],
                RecentComments: [
                  ...updatedVlogs[index].RecentComments,
                  ...res.data.comment,
                ],
              };
              dispatch(vlogs(updatedVlogs));
              toastPopUp("Comment added successfully");
            }
            console.log(res.data);
          } else {
            if (res.response && res.response.data) {
              const message = res.response.data.message;
              if (message === "SEXT") {
                toastPopUp("Internal server error");
              } else if (message === "NCF") {
                toastPopUp("No Comments found");
              } else {
                toastPopUp("Something went wrong");
              }
            }
          }
        })
        .catch((err) => {
          toastPopUp("Something went wrong");
        })
        .finally(() => {
          setLoadingMoreComment(false);
        });
    };
  
    const addLike = async (VlogID, ParentID, index,setLoadingLike) => {
      if (!userDetails.UserID) {
        toastPopUp("Login First");
        router.push("/user");
        return;
      }
      dispatch(vlogButtonLoading(true));
      try {
        setLoadingLike(true);
        const res = await ADD_LIKES(VlogID, ParentID);
        console.log(res);
        if (res && res.data) {
          if (res.data.message === "SFL") {
            const updatedVlogs = [...selector.vlogs];
            updatedVlogs[index] = {
              ...updatedVlogs[index],
              RecentLikes: res.data.like,
              UserLiked: 1,
              LikesCount: updatedVlogs[index].LikesCount + 1,
            };
            dispatch(vlogs(updatedVlogs));
            toastPopUp("Like added successfully");
          }
          console.log(res.data);
        } else {
          if (res.response && res.response.data) {
            const message = res.response.data.message;
            if (message === "SEXT") {
              toastPopUp("Internal server error");
            } else {
              toastPopUp("Something went wrong");
            }
          }
        }
      } catch (error) {
        console.log(error);
        toastPopUp("Internal Server error");
      } finally {
        setLoadingLike(false);
      }
    };
  
    function removeLike(VlogID, ParentID, index, UserID,setLoadingLike) {
      setLoadingLike(true);
      REMOVE_LIKES(VlogID, ParentID)
        .then((res) => {
          if (res && res.data) {
            if (res.data.message == "SFL") {
              const updatedVlogs = [...selector.vlogs];
              updatedVlogs[index] = {
                ...updatedVlogs[index],
                RecentLikes: updatedVlogs[index].RecentLikes.filter((e) => {
                  return !(
                    e.VlogID == VlogID &&
                    e.ParentID == ParentID &&
                    e.UserID == UserID
                  );
                }),
                UserLiked: 0,
                LikesCount: updatedVlogs[index].LikesCount - 1,
              };
              dispatch(vlogs(updatedVlogs));
              toastPopUp("Like removed successfully");
            }
            console.log(res.data);
          } else {
            if (res.response && res.response.data) {
              const message = res.response.data.message;
              if (message == "SEXT") {
                toastPopUp("Internal server error");
              } else if (message == "NLF") {
                toastPopUp("No Like found");
              } else if (message == "NV") {
                toastPopUp("You are not valid");
              } else if (message == "TE") {
                toastPopUp("You are not valid please try login again");
              } else {
                toastPopUp("Something went wrong");
              }
            }
          }
        })
        .catch((err) => {
          toastPopUp("Internal Server error");
        })
        .finally(() => {
          setLoadingLike(false);
        });
    }
  
    function removeComment(VlogID, ParentID, CommentID, index, UserID,setLoadingDeleteComment) {
      console.log(VlogID, ParentID, CommentID, index, UserID);
      setLoadingDeleteComment(true);
      REMOVE_COMMENT(VlogID, ParentID, CommentID)
        .then((res) => {
          console.log(res);
          if (res && res.data) {
            if (res.data.message == "SFL") {
              const updatedVlogs = [...selector.vlogs];
              updatedVlogs[index] = {
                ...updatedVlogs[index],
                RecentComments: updatedVlogs[index].RecentComments.filter((e) => {
                  return !(
                    e.VlogID == VlogID &&
                    e.ParentID == ParentID &&
                    e.UserID == UserID &&
                    e.CommentID == CommentID
                  );
                }),
  
                CommentCount: updatedVlogs[index].CommentCount - 1,
              };
              dispatch(vlogs(updatedVlogs));
              toastPopUp("Comment removed successfully");
            }
            console.log(res.data);
          } else {
            if (res.response && res.response.data) {
              const message = res.response.data.message;
              if (message == "SEXT") {
                toastPopUp("Internal server error");
              } else if (message == "NCF") {
                toastPopUp("No Comment found");
              } else if (message == "NV") {
                toastPopUp("You are not valid");
              } else if (message == "TE") {
                toastPopUp("You are not valid please try login again");
              } else {
                toastPopUp("Something went wrong");
              }
            }
          }
        })
        .catch((err) => {
          toastPopUp("Internal Server error");
        })
        .finally(() => {
          setLoadingDeleteComment(false);
        });
    }
  
    const addComment = async (VlogID, ParentID, comment, index,setLoadingAddComment) => {
      if (!userDetails.UserID) {
        toastPopUp("Login First");
        router.push("/user");
        return;
      }
      if (!comment) {
        toastPopUp("Comment cannot be empty");
        return;
      }
      setLoadingAddComment(true);
      try {
        const res = await ADD_COMMENTS(VlogID, ParentID, comment);
        if (res && res.data) {
          if (res.data.message === "SFL") {
            const updatedVlogs = [...selector.vlogs];
            updatedVlogs[index] = {
              ...updatedVlogs[index],
              RecentComments: res.data.comments,
              CommentCount: updatedVlogs[index].CommentCount + 1,
            };
            dispatch(vlogs(updatedVlogs));
            toastPopUp("Comment added successfully");
          }
          console.log(res.data);
        } else {
          if (res.response && res.response.data) {
            const message = res.response.data.message;
            if (message === "SEXT") {
              toastPopUp("Internal server error");
            } else if (message === "NCF") {
              toastPopUp("No Comments found");
            } else {
              toastPopUp("Something went wrong");
            }
          }
        }
      } catch (error) {
        console.log(error);
        toastPopUp("Internal Server error");
      } finally {
        setLoadingAddComment(false);
      }
    };
    function getAllVlogs() {
      dispatch(loadingVlogs(true));
      GET_VLOGS(selector.currentPage)
        .then((res) => {
          if (res && res.data && res.data.allvlogs) {
            dispatch(vlogs(res.data.allvlogs));
            console.log(res.data.allvlogs);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          dispatch(loadingVlogs(false));
        });
    }
  
    useEffect(() => {
       
        console.log(userDetails)
       
      getAllVlogs();
    }, []);
  
    return (
      <>
        
        <div className="height-100vh text-center mb-5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-5 pt-24 view flex justify-around">
          <div className="w-full md:w-3/4 lg:w-2/3 custom-scrollbar overflow-y-scroll p-5 bg-white rounded-lg shadow-lg">
            <h1 className="text-center text-gray-800 text-3xl mb-5">
             Vlogs
            </h1>
  
            {
              selector.loadingVlogs?
              
  <>
  <div role="status" class="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto mt-6">
      <div class="mx-auto h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 "></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      <div class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700 mt-6">
          <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
          </svg>
      </div>
  </div>
  <div role="status" class="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto mt-6">
      <div class="mx-auto h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 "></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
  </div>
  <div role="status" class="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto mt-6">
      <div class="mx-auto h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 "></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      <div class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700 mt-6">
          <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
          </svg>
      </div>
  </div>
  <div role="status" class="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto mt-6">
      <div class="mx-auto h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 "></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
  </div>
  <div role="status" class="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto mt-6">
      <div class="mx-auto h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 "></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      <div class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700 mt-6">
          <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
          </svg>
      </div>
  </div>
  <div role="status" class="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto mt-6">
      <div class="mx-auto h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 "></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
  </div>
  <div role="status" class="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto mt-6">
      <div class="mx-auto h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 "></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      <div class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700 mt-6">
          <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
          </svg>
      </div>
  </div>
  <div role="status" class="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto mt-6">
      <div class="mx-auto h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 "></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
  </div>
  <div role="status" class="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto mt-6">
      <div class="mx-auto h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 "></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      <div class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700 mt-6">
          <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
          </svg>
      </div>
  </div>
  </>
  :
  selector.vlogs.map((vlog, index) => (
    <VlogCard
      key={vlog.vlog_id}
      addLike={addLike}
      addComment={addComment}
      index={index}
      vlog={vlog}
      removeLike={removeLike}
      getLikes={getLikes}
      getComments={getComments}
      removeComment={removeComment}
      deleteVlog = {deleteVlog}
      userId={userDetails.UserID ? userDetails.UserID : null}
    />
  ))
  
            }
          </div>
        </div>
      </>
    );
}

export default PageClintModule