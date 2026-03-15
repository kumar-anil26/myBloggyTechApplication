import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentsList from "./CommentLists";
import { CreateCommentsAction } from "../../redux/slices/comments/commentsSlices";

export default function AddComment({ Id, comments }) {
  const [commentData, setCommentData] = useState({ message: "" });
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.comments);
  const { userAuth } = useSelector((state) => state.users);

  //Fetch success from commnets
  const { success } = useSelector((state) => state?.comments);

  useEffect(() => {
    if (success) {
      window.location.reload();
    }
  }, [success]);

  const handlerChange = (e) => {
    setCommentData({ ...commentData, [e.target.name]: e.target.value });
  };

  const handlerSubmit = (e) => {
    e.preventDefault();
    const trimmed = commentData.message.trim();
    if (!trimmed) {
      alert("Please write a comment before submitting.");
      return;
    }

    dispatch(CreateCommentsAction({ message: trimmed, Id }));
    setCommentData({ message: "" });
  };

  return (
    <div className="bg-white rounded shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-blue-600">
          Comments
        </h3>

        <div className="mt-5">
          <hr className="mt-5 border-gray-300" />
          <form onSubmit={handlerSubmit} className="mt-4">
            <div className="flex space-x-4">
              <div className="flex-none">
                <img
                  src={
                    userAuth?.userInfo?.profilePicture ||
                    "https://placehold.co/50x50"
                  }
                  alt="avatar"
                  className="w-12 h-12 rounded-full"
                />
              </div>

              <div className="flex-grow">
                <div className="border rounded-lg shadow-sm">
                  <div className="p-3 border-b bg-gray-50">
                    <h4 className="text-sm font-medium text-blue-600">
                      Add a comment
                    </h4>
                  </div>

                  <div className="p-3">
                    <textarea
                      id="comment"
                      rows={3}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm form-textarea focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      placeholder="Your comment"
                      name="message"
                      value={commentData.message}
                      onChange={handlerChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="flex items-center justify-end px-3 py-2 rounded-b-lg bg-gray-50">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 text-white rounded focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                        loading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </div>
      </div>

      {comments?.length > 0 ? (
        <CommentsList comments={comments} />
      ) : (
        <p className="text-gray-400 text-sm text-center py-3">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}
