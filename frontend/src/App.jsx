import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./component/HomePage/HomePage";
import Login from "./component/Users/Login";
import PublicNavbar from "./component/NavBar/PublicNavbar";
import PrivateNavbar from "./component/NavBar/PrivateNavbar";
import { useSelector } from "react-redux";
import ProtectedRout from "./component/AuthRout/ProtectedRout";
import PublicPosts from "./component/posts/PublicPosts";
import Register from "./component/Users/Register";
import AddPost from "./component/posts/AddPost";
import PostDetails from "./component/posts/PostDetails";
import PostsList from "./component/posts/PostsList";
import UpdatePost from "./component/posts/UpdatePost";
import PublicUserProfile from "./component/Users/PublicUserProfile";
import PrivateUserProfile from "./component/Users/PrivateUserProfile";
import ForgotPassword from "./component/Users/ForgotPassword";
import ResetPassword from "./component/Users/ResetPassword";

export default function App() {
  const { userAuth } = useSelector((state) => state.users);
  const isLoggedIn = userAuth?.userInfo?.token;

  return (
    <BrowserRouter>
      {isLoggedIn ? <PrivateNavbar /> : <PublicNavbar />}

      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/public-posts" element={<PublicPosts />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/reset-password/:resetToken" element={<ResetPassword />}></Route>
        <Route
          path="/users-public-profile/:userId"
          element={
            <ProtectedRout>
              <PublicUserProfile />
            </ProtectedRout>
          }
        />

        <Route
          path="/users-private-profile/:userId"
          element={
            <ProtectedRout>
              <PrivateUserProfile />
            </ProtectedRout>
          }
        />

        <Route
          path="/add-post"
          element={
            <ProtectedRout>
              <AddPost />
            </ProtectedRout>
          }
        />

        <Route
          path="/posts/:id"
          element={
            <ProtectedRout>
              <PostDetails />
            </ProtectedRout>
          }
        />

        <Route
          path="/posts"
          element={
            <ProtectedRout>
              <PostsList />
            </ProtectedRout>
          }
        />

        <Route
          path="/posts/:id/update"
          element={
            <ProtectedRout>
              <UpdatePost />
            </ProtectedRout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
