import React from "react";

import LoadingComponent from "../alert/LoadingComponent";
import { Link } from "react-router-dom";
import Errormsg from "../alert/Errormsg";

export default function PrivatePostsList({ posts, loading, error }) {
  //  UI Rendering
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <section className="py-20">
        <div className="container px-4 mx-auto">
          {/*  Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block px-5 py-2 mb-6 text-sm font-semibold tracking-wider text-green-600 bg-green-100 rounded-full transform hover:scale-105 transition-transform duration-300">
              Latest Blog Posts
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Discover Our Trending Articles
            </h1>
            <p className="text-xl text-gray-600">
              Explore the latest insights, tips, and stories
            </p>
          </div>

          {/*  Posts Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Handle loading, error, or empty state */}
            {loading ? (
              // Show loading spinner
              <LoadingComponent />
            ) : error ? (
              // Show error message if fetching fails
              <div className="col-span-full p-8 bg-red-50 rounded-lg">
                <h2 className="text-red-600 text-center font-bold text-xl">
                  <Errormsg message={error?.message} />
                </h2>
              </div>
            ) : posts?.length <= 0 ? (
              // Show "No posts found" if list is empty
              <div className="col-span-full text-center p-12">
                <h2 className="text-gray-600 text-2xl">No posts found</h2>
              </div>
            ) : (
              //  Map through all posts and render them
              posts?.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/*  Post Image */}
                  <div className="relative">
                    <img
                      className="w-full h-64 object-cover"
                      src={post?.image}
                      alt={post?.title}
                    />

                    {/* Category Tag */}
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 text-sm font-semibold text-green-600 bg-white rounded-full shadow">
                        {post?.category?.name}
                      </span>
                    </div>
                  </div>

                  {/*  Post Content */}
                  <div className="p-8">
                    {/* Date */}
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(post?.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 hover:text-green-600 transition-colors duration-200">
                      {post?.title}
                    </h2>

                    {/* Short content preview */}
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {post?.content}
                    </p>

                    {/* Read More Link */}
                    <Link
                      to={`/posts/${post._id}`}
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Read More
                      <svg
                        className="ml-2 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
