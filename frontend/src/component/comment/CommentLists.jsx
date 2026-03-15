import React from "react";

export default function CommentsList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <h2 className="text-red-400 text-2xl text-center py-3">
        No comments yet
      </h2>
    );
  }

  return (
    <div className="flex flex-col space-y-4 mt-6">
      {comments.map((comment) => (
        <div
          key={comment?._id}
          className="flex space-x-4 p-4 bg-blue-50 rounded-lg shadow-sm"
        >
          <img
            src={
              comment?.author?.profilePicture || "https://placehold.co/50x50"
            }
            alt="avatar"
            className="rounded-full h-12 w-12"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-blue-600">
                {comment?.author?.username || "Anonymous"}
              </h4>
              <p className="text-xs text-gray-500">
                {new Date(comment?.createdAt).toLocaleDateString("en-in", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <p className="mt-2 text-sm text-gray-700">{comment?.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
