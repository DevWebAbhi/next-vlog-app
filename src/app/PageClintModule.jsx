"use client";
import "../styles/createVlog.css";
import { DELETE_VLOGS, GET_VLOGS } from "@/app/APIRequest/vlogAPI";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  loadingAddComment,
  loadingAddLike,
  loadingDeleteComment,
  loadingDeleteLike,
  loadingDeleteVlog,
  loadingMoreComments,
  loadingMoreLike,
  loadingVlogs,
  totalPage,
  vlogs,
  resetVlogs,
  currentPage
} from "@/app/redux/features/vlogSlice";
import { useEffect } from "react";
import VlogCard from "./VlogCard";
import "./page.css";
import { toastPopUp } from "./CommonFunctions/popupInfo";
import { ADD_LIKES, GET_LIKES, REMOVE_LIKES } from "@/app/APIRequest/likeAPI";
import { ADD_COMMENTS, GET_COMMENTS, REMOVE_COMMENT } from "@/app/APIRequest/commentAPI";
import { useRouter } from "next/navigation";
import CardSkeleton from "./CardSkeleton";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
const PageClintModule = ({ userDetails }) => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((store) => store.vlogSlice);
  const router = useRouter();
  
  const deleteVlog = async (VlogID, index) => {
    try {
      const loading = [...selector.loadingDeleteVlog];
      loading[index] = true;
      dispatch(loadingDeleteVlog(loading));
      const res = await DELETE_VLOGS(VlogID);
      if (res && res.data) {
        const message = res.data.message;
        if (message == "SFL") {
          const updatedVlogs = [...selector.vlogs];
          updatedVlogs.splice(index, 1);
          dispatch(vlogs(updatedVlogs));
          const loading = [...selector.loadingDeleteVlog];
          loading.splice(index, 1);
          dispatch(loadingDeleteVlog(loading));
          const updatedLoadingMoreComments = [...selector.loadingMoreComments];
          updatedLoadingMoreComments.splice(index, 1);
          const updatedLoadingMoreLikes = [...selector.loadingMoreLike];
          updatedLoadingMoreLikes.splice(index, 1);
          const updateLoadindAddComment = [...selector.loadingAddComment];
          updateLoadindAddComment.splice(index, 1);
          const updateLoadingLikes = [...selector.loadingAddLike];
          updateLoadingLikes.splice(index, 1);
          const updatedLoadingDeleteComment = [
            ...selector.loadingDeleteComment,
          ];
          updatedLoadingDeleteComment.splice(index, 1);
          dispatch(loadingMoreComments(updatedLoadingMoreComments));
          dispatch(loadingAddComment(updateLoadindAddComment));
          dispatch(loadingAddLike(updateLoadingLikes));
          dispatch(loadingDeleteComment(updatedLoadingDeleteComment));
          dispatch(loadingMoreLike(updatedLoadingMoreLikes));
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
          } else if(res.response.data.message="TMR"){
            toastPopUp("Too many request");
          }else {
            toastPopUp("Something went wrong");
          }
        }
      }
    } catch (error) {
      const loading = [...selector.deleteVlog];
      loading[index] = false;
      dispatch(loadingDeleteVlog(loading));
      toastPopUp("Something went wrong");
    } finally {
    }
  };
  const getLikes = async (VlogID, ParentID, likesBand, index) => {
    const loadingS = [...selector.loadingMoreLike];
    loadingS[index] = true;
    dispatch(loadingMoreLike(loadingS));
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
            if (message === "ISE") {
              toastPopUp("Internal server error");
            } else if (message === "NLF") {
              toastPopUp("No Likes found");
            } else if (message === "IIP") {
              toastPopUp("Invalid Input");
            } else if(res.response.data.message="TMR"){
              toastPopUp("Too many request");
            }else {
              toastPopUp("Something went wrong");
            }
          }
        }
      })
      .catch((err) => {
        toastPopUp("Something went wrong");
      })
      .finally(() => {
        const loading = [...selector.loadingMoreLike];
        loading[index] = false;
        dispatch(loadingMoreLike(loading));
      });
  };

  const getComments = async (VlogID, ParentID, commentsBand, index) => {
    const loadingS = [...selector.loadingMoreComments];
    loadingS[index] = true;
    dispatch(loadingMoreComments(loadingS));
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
            if (message === "ISE") {
              toastPopUp("Internal server error");
            } else if (message === "NCF") {
              toastPopUp("No Comments found");
            } else if (message === "IIP") {
              toastPopUp("Invalid Input");
            } else if(res.response.data.message="TMR"){
              toastPopUp("Too many request");
            }else {
              toastPopUp("Something went wrong");
            }
          }
        }
      })
      .catch((err) => {
        toastPopUp("Something went wrong");
      })
      .finally(() => {
        const loading = [...selector.loadingMoreComments];
        loading[index] = false;
        dispatch(loadingMoreComments(loading));
      });
  };

  const addLike = async (VlogID, ParentID, index) => {
    if (!userDetails.UserID) {
      toastPopUp("Login First");
      router.push("/user");
      return;
    }

    try {
      const loadingS = [...selector.loadingAddLike];

      loadingS[index] = true;
      dispatch(loadingAddLike(loadingS));
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
          } else if(res.response.data.message="TMR"){
            toastPopUp("Too many request");
          }else {
            toastPopUp("Something went wrong");
          }
        }
      }
    } catch (error) {
      console.log(error);
      toastPopUp("Internal Server error");
    } finally {
      const loadingS = [...selector.loadingAddLike];
      loadingS[index] = false;
      dispatch(loadingAddLike(loadingS));
    }
  };

  function removeLike(VlogID, ParentID, index, UserID) {
    const loadingS = [...selector.loadingAddLike];
    loadingS[index] = true;
    console.log(loadingS, selector.loadingAddLike);
    dispatch(loadingAddLike(loadingS));
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
            } else if(res.response.data.message="TMR"){
              toastPopUp("Too many request");
            }else {
              toastPopUp("Something went wrong");
            }
          }
        }
      })
      .catch((err) => {
        toastPopUp("Internal Server error");
      })
      .finally(() => {
        console.log(selector.loadingAddLike);
        const loadingS = [...selector.loadingAddLike];
        loadingS[index] = false;
        dispatch(loadingAddLike(loadingS));
      });
  }

  function removeComment(
    VlogID,
    ParentID,
    CommentID,
    index,
    indexComment,
    UserID
  ) {
    console.log(VlogID, ParentID, CommentID, index, indexComment, UserID);
    const loadingS = [...selector.loadingDeleteComment];
    loadingS[index] = [...loadingS[index]];
    loadingS[index][indexComment] = true;
    dispatch(loadingDeleteComment(loadingS));

    REMOVE_COMMENT(VlogID, ParentID, CommentID)
      .then((res) => {
        console.log(res);
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
          console.log(res.data);
        } else {
          if (res.response && res.response.data) {
            const message = res.response.data.message;
            if (message === "SEXT") {
              toastPopUp("Internal server error");
            } else if (message === "NCF") {
              toastPopUp("No Comment found");
            }  else if (message === "TE") {
              toastPopUp("You are not valid, please try logging in again");
            }else if (message == 'NV') {
              toastPopUp("Try login again maybe session has expired");
            } else if(res.response.data.message="TMR"){
              toastPopUp("Too many request");
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
        const loadingF = [...selector.loadingDeleteComment];
        loadingF[index] = [...loadingF[index]];
        loadingF[index][indexComment] = false;
        dispatch(loadingDeleteComment(loadingF));
      });
  }

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
    const loading = [...selector.loadingAddComment];
    loading[index] = true;
    dispatch(loadingAddComment(loading));
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
          } else if (message == 'NV') {
            toastPopUp("Try login again maybe session has expired");
          } else if(res.response.data.message="TMR"){
            toastPopUp("Too many request");
          }else {
            toastPopUp("Something went wrong");
          }
        }
      }
    } catch (error) {
      console.log(error);
      toastPopUp("Internal Server error");
    } finally {
      const loading = [...selector.loadingAddComment];
      loading[index] = false;
      dispatch(loadingAddComment(loading));
    }
  };
  function getAllVlogs(page) {
    dispatch(loadingVlogs(true));
    GET_VLOGS(page)
      .then((res) => {
        if (res && res.data && res.data.allvlogs) {
          dispatch(vlogs(res.data.allvlogs));
          if (res.data.allvlogs.length > 0) {
            console.log(Math.ceil(res.data.allvlogs.length/10));
            dispatch(totalPage(Number(Math.ceil(res.data.allvlogs.length/10))));
          } else {
            dispatch(totalPage(1));
          }
          dispatch(
            loadingDeleteVlog(new Array(res.data.allvlogs.length).fill(false))
          );
          dispatch(
            loadingAddLike(new Array(res.data.allvlogs.length).fill(false))
          );
          dispatch(
            loadingAddComment(new Array(res.data.allvlogs.length).fill(false))
          );
          dispatch(
            loadingMoreLike(new Array(res.data.allvlogs.length).fill(false))
          );
          dispatch(
            loadingMoreComments(new Array(res.data.allvlogs.length).fill(false))
          );
          dispatch(
            loadingDeleteLike(
              res.data.allvlogs.map((e) => {
                return new Array(e.LikesCount).fill(false);
              })
            )
          );
          dispatch(
            loadingDeleteComment(
              res.data.allvlogs.map((e) => {
                return new Array(e.CommentCount).fill(false);
              })
            )
          );
        
        }else {
          if (res.response && res.response.data) {
            const message = res.response.data.message;
            if (message === "ISE") {
              toastPopUp("Internal server error");
            } else if (message === "NOV") {
              toastPopUp("No Vlogs found");
            } else if (message == 'TEXP') {
              toastPopUp("Token Expired please login again");
              setTimeout(()=>{
                router.push("/user");
              },3000)
            } else if(res.response.data.message="TMR"){
              toastPopUp("Too many request");
            }else {
              toastPopUp("Something went wrong");
            }
          }else{
            toastPopUp("Something went wrong");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch(loadingVlogs(false));
      });
  }
  async function handlePageChange(page) {
    dispatch(currentPage(page));
  }

  useEffect(() => {
    getAllVlogs(selector.currentPage);
  }, [selector.currentPage]);

  return (
    <>
      <div className="height-95vh text-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 pt-24 view flex justify-around">
        <div className="w-full md:w-3/4 lg:w-2/3 custom-scrollbar overflow-y-scroll p-5 rounded-lg shadow-lg">

          {selector.loadingVlogs ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) :selector.vlogs.length == 0 ?<h1 className="">No Vlogs Found</h1>: (
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
                deleteVlog={deleteVlog}
                userId={userDetails.UserID ? userDetails.UserID : null}
              />
            ))
          )}
        </div>
      </div>
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <ResponsivePagination
              total={selector.totalPage}
              current={selector.currentPage}
              onPageChange={(page) => handlePageChange(page)}
            />
      </div>
    </>
  );
};

export default PageClintModule;
