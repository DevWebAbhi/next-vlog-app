"use client";
import "../../styles/createVlog.css";
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { individualVlogs, vlogs, vlogButtonLoading } from "@/app/redux/features/vlogSlice";
import { DELETE_VLOGS, GET_ALL_VLOGS, GET_VLOGS } from "@/API/vlogAPI";
import VlogCard from "../VlogCard";
import '../../styles/login.css';
import { toastPopUp } from "../CommonFunctions/popupInfo";
import { ADD_COMMENTS, GET_COMMENTS, REMOVE_COMMENT } from "@/API/commentAPI";
import { ADD_LIKES, GET_LIKES, REMOVE_LIKES } from "@/API/likeAPI";
import { useRouter } from "next/navigation";

const MyVlogsProvider = ({userDetails}) => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((store) => store.vlogSlice);
  const router = useRouter();
  const [loadingDeleteVlog, setLoadingDeleteVlog] = useState(false);
  const [loadingMoreLike, setLoadingMoreLike] = useState(false);
  const [loadingMoreComment, setLoadingMoreComment] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingAddComment, setLoadingAddComment] = useState(false);
  const [loadingDeleteComment, setLoadingDeleteComment] = useState(false);

  const deleteVlog = async (VlogID, index) => {
    try {
      setLoadingDeleteVlog(true);
      const res = await DELETE_VLOGS(VlogID);
      if (res && res.data) {
        const message = res.data.message;
        if (message === "SFL") {
          const updatedVlogs = [...selector.vlogs];
          updatedVlogs.splice(index, 1);
          dispatch(vlogs(updatedVlogs));
          toastPopUp("Successfully deleted vlog");
        }
      } else {
        handleError(res);
      }
    } catch (error) {
      toastPopUp("Something went wrong");
    } finally {
      setLoadingDeleteVlog(false);
    }
  };

  const getLikes = async (VlogID, ParentID, likesBand, index) => {
    setLoadingMoreLike(true);
    try {
      const res = await GET_LIKES(VlogID, ParentID, likesBand);
      if (res && res.data) {
        const message = res.data.message;
        if (message === "SEL") {
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
      } else {
        handleError(res);
      }
    } catch (error) {
      toastPopUp("Something went wrong");
    } finally {
      setLoadingMoreLike(false);
    }
  };

  const getComments = async (VlogID, ParentID, commentsBand, index) => {
    setLoadingMoreComment(true);
    try {
      const res = await GET_COMMENTS(VlogID, ParentID, commentsBand);
      if (res && res.data) {
        const message = res.data.message;
        if (message === "SFL") {
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
      } else {
        handleError(res);
      }
    } catch (error) {
      toastPopUp("Something went wrong");
    } finally {
      setLoadingMoreComment(false);
    }
  };

  const addLike = async (VlogID, ParentID, index) => {
    if (!userDetails.UserID) {
      toastPopUp("Login First");
      router.push("/user");
      return;
    }
    dispatch(vlogButtonLoading(true));
    try {
      setLoadingLike(true);
      const res = await ADD_LIKES(VlogID, ParentID);
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
      } else {
        handleError(res);
      }
    } catch (error) {
      toastPopUp("Internal Server error");
    } finally {
      setLoadingLike(false);
    }
  };

  const removeLike = async (VlogID, ParentID, index, UserID) => {
    setLoadingLike(true);
    try {
      const res = await REMOVE_LIKES(VlogID, ParentID);
      if (res && res.data) {
        if (res.data.message === "SFL") {
          const updatedVlogs = [...selector.vlogs];
          updatedVlogs[index] = {
            ...updatedVlogs[index],
            RecentLikes: updatedVlogs[index].RecentLikes.filter((e) => {
              return !(
                e.VlogID === VlogID &&
                e.ParentID === ParentID &&
                e.UserID === UserID
              );
            }),
            UserLiked: 0,
            LikesCount: updatedVlogs[index].LikesCount - 1,
          };
          dispatch(vlogs(updatedVlogs));
          toastPopUp("Like removed successfully");
        }
      } else {
        handleError(res);
      }
    } catch (error) {
      toastPopUp("Internal Server error");
    } finally {
      setLoadingLike(false);
    }
  };

  const removeComment = async (VlogID, ParentID, CommentID, index, UserID) => {
    setLoadingDeleteComment(true);
    try {
      const res = await REMOVE_COMMENT(VlogID, ParentID, CommentID);
      if (res && res.data) {
        if (res.data.message === "SFL") {
          const updatedVlogs = [...selector.vlogs];
          updatedVlogs[index] = {
            ...updatedVlogs[index],
            RecentComments: updatedVlogs[index].RecentComments.filter((e) => {
              return !(
                e.VlogID === VlogID &&
                e.ParentID === ParentID &&
                e.UserID === UserID &&
                e.CommentID === CommentID
              );
            }),
            CommentCount: updatedVlogs[index].CommentCount - 1,
          };
          dispatch(vlogs(updatedVlogs));
          toastPopUp("Comment removed successfully");
        }
      } else {
        handleError(res);
      }
    } catch (error) {
      toastPopUp("Internal Server error");
    } finally {
      setLoadingDeleteComment(false);
    }
  };

  const addComment = async (VlogID, ParentID, comment, index) => {
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
      } else {
        handleError(res);
      }
    } catch (error) {
      toastPopUp("Internal Server error");
    } finally {
      setLoadingAddComment(false);
    }
  };

  const getAllVlogs = async () => {
    try {
      const res = await GET_ALL_VLOGS(selector.currentPage);
      if (res && res.data && res.data.allvlogs) {
        console.log(res)
        dispatch(vlogs(res.data.allvlogs));
      }
    } catch (error) {
      toastPopUp("Failed to fetch vlogs");
    }
  };

  const handleError = (res) => {
    if (res.response && res.response.data) {
      const message = res.response.data.message;
      if (message === "SEXT") {
        toastPopUp("Internal server error");
      } else if (message === "NCF" || message === "NLF") {
        toastPopUp("No data found");
      } else {
        toastPopUp("Something went wrong");
      }
    }
  };

  useEffect(() => {
    console.log(userDetails)
    getAllVlogs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="height-100vh text-center mb-5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-10 pt-24 view flex justify-around">
        <div className="w-full md:w-3/4 lg:w-2/3 custom-scrollbar overflow-y-scroll p-5 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl mb-5 font-semibold">Vlogs</h1>
          {selector.vlogs.length > 0 ? (
            selector.vlogs.map((vlog, index) => (
              <VlogCard
                key={vlog.VlogID}
                vlog={vlog}
                index={index}
                deleteVlog={deleteVlog}
                addLike={addLike}
                removeLike={removeLike}
                getLikes={getLikes}
                addComment={addComment}
                getComments={getComments}
                removeComment={removeComment}
                loadingDeleteVlog={loadingDeleteVlog}
                loadingMoreLike={loadingMoreLike}
                loadingMoreComment={loadingMoreComment}
                loadingLike={loadingLike}
                loadingAddComment={loadingAddComment}
                loadingDeleteComment={loadingDeleteComment}
                userId={userDetails.UserID ? userDetails.UserID : null}
              />
            ))
          ) : (
            <p className="text-lg">No Vlogs available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MyVlogsProvider;
