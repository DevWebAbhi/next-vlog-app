"use client";
import { useAppSelector } from "@/app/redux/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";

const VlogCard = ({
  index,
  vlog,
  userId,
  addLike,
  addComment,
  removeLike,
  getLikes,
  getComments,
  deleteVlog,
  removeComment,
}) => {
  const selector = useAppSelector((store) => store.vlogSlice);
  const [openLikes, setOpenLikes] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likesBand, setLikesBand] = useState(2);
  const [commentsBand, setCommentsBand] = useState(2);
  const [loadingDeleteVlog,setLoadingDeleteVlog] = useState(false);
  const [loadingMoreComment,setLoadingMoreComment] = useState(false);
  const [loadingAddComment,setLoadingAddComment] = useState(false);
  const [loadingAddLike,setLoadingLike] = useState(false);
  const [loadingMoreLike,setLoadingMoreLike] = useState(false);
  const [loadingDeleteComment,setLoadingDeleteComment] = useState(false);
  const router = useRouter();
  const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp|jfif)$/i.test(url);
  };

  const isVideo = (url) => {
    return /\.(mp4|webm|ogg|mov|avi)$/i.test(url);
  };

  useEffect(() => {
    console.log(selector.loadingDeleteComment);

  }, []);

  return (
    <div className="vcard mb-10 bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">{vlog.title}</h1>
        <p className="text-gray-600 mb-4">{vlog.description}</p>
      </div>
      {userId == vlog.user_id ? (
        <div className="actions flex justify-between p-4">
            <div
            className="cursor-pointer"
            onClick={() => {
              deleteVlog(vlog.vlog_id, index,setLoadingDeleteVlog);
            }}
          >
            {
              selector.loadingDeleteVlog[index]?
              <Spinner/>
              :
              <Image
              src={"/Icons/delete.png"}
              alt="delete Image"
              width={30}
              height={30}
            />
            }
            
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              router.push(`/editVlog/${vlog.vlog_id}?title=${vlog.title}&description=${vlog.description}`);
            }}
          >
            <Image
              src={"/Icons/edit.png"}
              alt="edit Image"
              width={30}
              height={30}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      {(isImage(vlog.media) || isVideo(vlog.media)) && (
        <div className="media-container">
          {isImage(vlog.media) && (
            <img
              className="w-full p-5"
              src={vlog.media}
              alt="Vlog Media"
            />
          )}
          {isVideo(vlog.media) && (
            <video className="w-full h-64 object-cover" src={vlog.media} controls />
          )}
        </div>
      )}
      <div className="actions flex justify-around p-4 bg-gray-100 border-t border-gray-200">
        <div
          className="cursor-pointer text-blue-500 hover:text-blue-700"
          onClick={() => {
            setOpenComments(false);
            setOpenLikes(!openLikes);
          }}
        >
          <div className="ml-2">Like {vlog.LikesCount}</div>
        </div>
        <div
          className="cursor-pointer text-blue-500 hover:text-blue-700"
          onClick={() => {
            setOpenLikes(false);
            setOpenComments(!openComments);
          }}
        >
          <div className="ml-2">Comments {vlog.CommentCount}</div>
        </div>
      </div>
      <div className="bg-gray-100 text-start">
        {openLikes ? (
          <>
            <>
              <div className="flex justify-between mt-1">
               
                <button
                  disabled={selector.vlogButtonLoading}
                  className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
                  onClick={() => {
                    vlog.UserLiked
                      ? removeLike(vlog.vlog_id, vlog.vlog_id, index, vlog.user_id)
                      : addLike(vlog.vlog_id, vlog.vlog_id, index);
                  }}
                >
                  {
                    selector.loadingAddLike[index]?
                    <Spinner/>:
                    vlog.UserLiked ? "Unlike" : "Like"
                  }
                  
                </button>
                
                
                :<></>
              </div>
            </>
            <>
              {vlog.RecentLikes ? (
                vlog.RecentLikes.map((e) => {
                  return (
                    <div className="m-2" key={e.LikeID}>
                      <p>{e.UserName}</p>
                    </div>
                  );
                })
              ) : (
                <>No Likes</>
              )}
            </>
            <div className="flex justify-between mt-1">
              {
                loadingMoreLike?
                <div
                role="status"
                className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
              >
                <Spinner/>
              </div>
                :
                <div>
                <button
                  disabled={selector.vlogButtonLoading}
                  className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
                  onClick={() => {
                    getLikes(vlog.vlog_id, vlog.vlog_id, likesBand, index);
                    setLikesBand(likesBand + 1);
                  }}
                >
                  {
                    selector.loadingMoreLike[index]?
                    <Spinner/>:
                    "More Likes"
                  }
                </button>
              </div>
              }
              
            </div>
          </>
        ) : (
          <></>
        )}
        {openComments ? (
          <>
            <div className="flex justify-between mt-1">
              <input
                type="text"
                placeholder="Add a comment..."
                className="border border-gray-300 rounded p-1 flex-grow"
                onChange={(e) => {
                  setCommentText(e.target.value);
                }}
              />
            
                
                
              
              
              <button
              disabled={selector.vlogButtonLoading}
              onClick={() => {
                addComment(vlog.vlog_id, vlog.vlog_id, commentText, index);
              }}
              className="ml-2 bg-blue-500 text-white py-1 px-3 rounded"
            >
              {selector.loadingAddComment[index]?<Spinner/>:"send"}
              
            </button>
              

            </div>
            {vlog.RecentComments ? (
              vlog.RecentComments.map((e,commentIndex) => {
                return (
                  <div className="m-2" key={e.CommentID}>
                    <p>
                      {e.UserName} comment : {e.Comment}
                    </p>
                    {userId == e.UserID || vlog.user_id == userId ? 
                      <button
                      className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
                      onClick={() => {
                        removeComment(
                          vlog.vlog_id,
                          vlog.vlog_id,
                          e.CommentID,
                          index,
                          commentIndex,
                          e.UserID
                        );
                      }}
                    >
                      {selector.loadingDeleteComment[index][commentIndex]?<Spinner/>:"Delete Comment"}
                      
                    </button>
                     : 
                      <></>
                    }
                  </div>
                );
              })
            ) : (
              <>No Comments</>
            )}
            
            <button
                  disabled={selector.vlogButtonLoading}
                  className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
                  onClick={() => {
                    getComments(vlog.vlog_id, vlog.vlog_id, commentsBand, index,setLoadingMoreComment);
                    setCommentsBand(commentsBand + 1);
                  }}
                >
                  
                  {selector.loadingMoreComments[index]?
                        <Spinner/>:
                        "More Comments"
                }
                </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default VlogCard;
