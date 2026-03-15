import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPostsAction } from "../../redux/slices/posts/postSlices";
import LoadingComponent from "../alert/LoadingComponent";
import { Link } from "react-router-dom";

export default function PublicPosts() {
  const dispatch = useDispatch();
  const { posts, error, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPublicPostsAction());
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="space-y-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Latest Articles
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Discover Tech Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the latest insights in technology and development
            </p>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <LoadingComponent />
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-red-500 font-semibold text-lg">
              {error?.message}
            </div>
          </div>
        ) : posts?.posts?.length <= 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-500 font-medium">No posts available</div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
              {posts?.posts?.map((post) => (
                <article
                  key={post._id}
                  className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      className="h-80 w-full object-cover"
                      src={post?.image}
                      alt={post?.title}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 text-green-600">
                        {post?.category?.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <time className="text-sm text-gray-500">
                      {new Date(post?.createdAt).toLocaleDateString("en-in", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-green-600">
                      {post?.title}
                    </h3>
                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {post?.content}
                    </p>
                  </div>

                  <div className="px-6 pb-6">
                    <Link
                      to={`/posts/${post?._id}`}
                      className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      <span>Read article</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
