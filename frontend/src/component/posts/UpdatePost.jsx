import Select from "react-select";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePostAction } from "../../redux/slices/posts/postSlices";
import LoadingComponent from "../alert/LoadingComponent";
import Errormsg from "../alert/Errormsg";
import Successmsg from "../alert/Successmsg";
import { useParams } from "react-router-dom";

export default function UpdatePost() {
  //initialise Error
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    category: null,
    content: "",
  });
  //Fetch post id from param
  const { id } = useParams();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //Store data dispatch
  const dispatch = useDispatch();

  //Fetch Categories data from store by using useSelector()
  const { categories } = useSelector((state) => state.categories);

  const { error, success, loading } = useSelector((state) => state?.posts);

  const options = categories?.allCategories?.map((category) => {
    return { value: category._id, label: category.name };
  });
  //handlerSelect Change
  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, category: selectedOption.value });
  };

  //File handler
  const handlerFile = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  //Handler Submit
  const handlerUpdate = (e) => {
    e.preventDefault();

    dispatch(updatePostAction({ formData, id }));
    if (success === "success") {
      setFormData({
        title: "",
        image: null,
        category: null,
        content: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handlerUpdate} className="w-full lg:w-1/2">
        <div className="flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white lg:max-w-xl lg:ml-auto rounded-4xl shadow-2xl">
          <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold text-center">
            Update Post
          </h2>
          {error && <Errormsg message={error.message} />}
          {success === "success" && (
            <Successmsg message="Posts Updated successfully!" />
          )}
          <h3 className="mb-7 text-base md:text-lg text-coolGray-500 font-medium text-center">
            Share your thoughts and ideas with the community
          </h3>
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Title</span>
            <input
              className="py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
              type="text"
              placeholder="Enter the post title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {/* error here */}
          </label>
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Image</span>
            <input
              className="py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
              type="file"
              name="image"
              onChange={handlerFile}
            />
            {/* error here */}
          </label>
          {/* category here */}
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Category</span>
            <Select
              options={options}
              name="category"
              onChange={handleSelectChange}
            />
          </label>
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Content</span>
            <textarea
              className="py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
              placeholder="Write your post content"
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
          </label>
          {/* button */}
          {loading ? (
            <LoadingComponent />
          ) : (
            <button
              className="mb-4 inline-block py-3 px-7 w-full leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
              type="submit"
            >
              Update Post
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
