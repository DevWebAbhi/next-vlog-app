"use client";
import { useAppSelector } from "@/app/redux/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    console.log(vlog);
    console.log(addLike);
  }, []);

  return (
    <div className="vcard mb-10 bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">{vlog.title}</h1>
        <p className="text-gray-600 mb-4">{vlog.description}</p>
      </div>
      {userId == vlog.user_id ? (
        <div className="actions flex justify-between p-4">
          {
            loadingDeleteVlog?
            <div
            role="status"
            className="ml-2 py-1 px-3 rounded block auto"
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
            <div
            className="cursor-pointer"
            onClick={() => {
              deleteVlog(vlog.vlog_id, index,setLoadingDeleteVlog);
            }}
          >
            <Image
              src={"/Icons/delete.png"}
              alt="delete Image"
              width={30}
              height={30}
            />
          </div>
          }
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
              className="w-full h-64 object-cover"
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
                {
                  loadingAddLike?
                  <div
                  role="status"
                  className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
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
                <button
                  disabled={selector.vlogButtonLoading}
                  className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
                  onClick={() => {
                    vlog.UserLiked
                      ? removeLike(vlog.vlog_id, vlog.vlog_id, index, vlog.user_id,setLoadingLike)
                      : addLike(vlog.vlog_id, vlog.vlog_id, index,setLoadingLike);
                  }}
                >
                  {vlog.UserLiked ? "Unlike" : "Like"}
                </button>
                }
                
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
                <div>
                <button
                  disabled={selector.vlogButtonLoading}
                  className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
                  onClick={() => {
                    getLikes(vlog.vlog_id, vlog.vlog_id, likesBand, index,setLoadingMoreLike);
                    setLikesBand(likesBand + 1);
                  }}
                >
                  More Likes
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
              {
                loadingAddComment?
                <div
                role="status"
                className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
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
              <button
              disabled={selector.vlogButtonLoading}
              onClick={() => {
                addComment(vlog.vlog_id, vlog.vlog_id, commentText, index,setLoadingAddComment);
              }}
              className="ml-2 bg-blue-500 text-white py-1 px-3 rounded"
            >
              Send
            </button>
              }

            </div>
            {vlog.RecentComments ? (
              vlog.RecentComments.map((e) => {
                return (
                  <div className="m-2" key={e.CommentID}>
                    <p>
                      {e.UserName} comment : {e.Comment}
                    </p>
                    {userId == e.UserID || vlog.user_id == userId ? 
                      loadingDeleteComment?
                      <div
                role="status"
                className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
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
                      <button
                      className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
                      onClick={() => {
                        removeComment(
                          vlog.vlog_id,
                          vlog.vlog_id,
                          e.CommentID,
                          index,
                          e.UserID,
                          setLoadingDeleteComment
                        );
                      }}
                    >
                      Delete Comment
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
            <div className="flex justify-between mt-1">
        
                {loadingMoreComment
                ?
                <div
                role="status"
                className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
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
                <div>
                <button
                  disabled={selector.vlogButtonLoading}
                  className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto"
                  onClick={() => {
                    getComments(vlog.vlog_id, vlog.vlog_id, commentsBand, index,setLoadingMoreComment);
                    setCommentsBand(commentsBand + 1);
                  }}
                >
                  More Comments
                </button>
              </div>
                }
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default VlogCard;
