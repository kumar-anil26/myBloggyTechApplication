import { useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getPrivateProfileAction,
  getPublicProfileAction,
  updateCoverImageAction,
  updateProfilePictureAction,
} from "../../redux/slices/users/userSlices";
import LoadingComponent from "../alert/LoadingComponent";
import Errormsg from "../alert/Errormsg";
import PrivatePostsList from "../posts/PrivatePostsList";

export default function PrivateUserProfile() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { profile, loading, error } = useSelector((state) => state?.users);

 

  useEffect(() => {
    dispatch(getPrivateProfileAction());
  }, [
    dispatch,
    userId,
    profile?.userdata?.profilePicture,
    profile?.userdata?.coverImage,
  ]);

  const profil = {
    name: profile?.userdata?.username,
    imageUrl: profile?.userdata?.profilePicture,
    coverImageUrl: profile?.userdata?.coverImage,
    fields: {
      Email: profile?.userdata?.email,
      "Joined Date": new Date(profile?.userdata?.createdAt).toDateString(),
      Followers: profile?.userdata?.followers?.length,
      Following: profile?.userdata?.following?.length,
    },
  };

  const handlerProfilePicture = (e) => {
    const fileName = e.currentTarget.name;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*"; // allow only images

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const data = { file: file, userId: userId };

      if (fileName === "profilePicture") {
        await dispatch(updateProfilePictureAction({ data })).unwrap();
      }
      if (fileName === "coverImage") {
        await dispatch(updateCoverImageAction({ data })).unwrap();
      }
      await dispatch(getPublicProfileAction(userId)).unwrap();
    };

    input.click();
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingComponent />
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Errormsg message={error.message} />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-0 flex flex-1 overflow-hidden">
          <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
            <article>
              {/* Profile header */}
              <div>
                <div className="relative">
                  <img
                    className="h-32 w-full object-cover lg:h-48"
                    src={profil.coverImageUrl}
                    alt="Cover"
                  />
                  <button
                    name="coverImage"
                    onClick={handlerProfilePicture}
                    className="absolute top-0 right-0 m-4 p-2 rounded-full bg-white hover:bg-gray-200"
                    aria-label="Upload cover image"
                  >
                    <FiUpload className="w-5 h-5 text-gray-800" />
                  </button>
                </div>

                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                  <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                    <div className="relative flex">
                      <img
                        className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                        src={profil.imageUrl}
                        alt="Profile"
                      />
                      <button
                        name="profilePicture"
                        onClick={handlerProfilePicture}
                        className="absolute bottom-0 right-0 mb-4 mr-4 p-2 rounded-full bg-white hover:bg-gray-200"
                        aria-label="Upload profile image"
                      >
                        <FiUpload className="w-5 h-5 text-gray-800" />
                      </button>
                    </div>

                    <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                      <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                        <h1 className="truncate text-2xl font-bold text-gray-900">
                          {profil.name}
                        </h1>
                      </div>
                    </div>

                    {/* Action buttons (follow, block, etc.) */}
                    <div className="flex flex-col mt-6 space-y-3 justify-stretch sm:flex-row sm:space-y-0 sm:space-x-4">
                      {/* Profile Views */}
                      <button
                        type="button"
                        className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <svg
                          className="-ml-0.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {profile?.userdata?.profileViewers?.length}
                      </button>

                      {/* follow */}
                      <button
                        type="button"
                        className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300"
                      >
                        <svg
                          className="-ml-0.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.5 5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM5 6.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm10.086 2.914a1 1 0 00-1.086.914A4.998 4.998 0 0013 15a5 5 0 10-10 0 4.998 4.998 0 00.786-2.828 1 1 0 10-1.972-.329A6.997 6.997 0 012 15a7 7 0 1014 0 6.997 6.997 0 00-.914-5.586z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Followers
                      </button>

                      {/* UnFollow */}
                      <button
                        type="button"
                        className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300"
                      >
                        <svg
                          className="-ml-0.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.5 5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM5 6.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm10.086 2.914a1 1 0 00-1.086.914A4.998 4.998 0 0013 15a5 5 0 10-10 0 4.998 4.998 0 00.786-2.828 1 1 0 10-1.972-.329A6.997 6.997 0 012 15a7 7 0 1014 0 6.997 6.997 0 00-.914-5.586z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Following
                      </button>
                    </div>
                    <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                      {/* Add your buttons here as before */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile fields */}
              <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  {Object.entries(profil.fields).map(([field, value]) => (
                    <div className="sm:col-span-1" key={field}>
                      <dt className="text-sm font-medium text-gray-500">
                        {field}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
            <PrivatePostsList
              posts={profile?.userdata?.posts}
              loading={loading}
              error={error}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
