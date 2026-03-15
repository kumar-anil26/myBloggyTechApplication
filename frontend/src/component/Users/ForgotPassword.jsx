import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordAction } from "../../redux/slices/users/userSlices";
import Errormsg from "../alert/Errormsg";
import Successmsg from "../alert/Successmsg";

export default function ForgotPassword() {
  const dispatch = useDispatch();
    // Store data
    const {error,success} = useSelector(state=>state.users)

  const [email, setEmail] = useState();

  const handlerChange = (e) => {
    setEmail(e.target.value);
    };
    
    const handlerSubmit = (e) => {
        e.preventDefault()
        
        //check email valid or not
        if (!email) {
            alert('Email required')
        }
        dispatch(forgotPasswordAction({ email }))
    }
  return (
    <div className="flex flex-col items-center mt-12">
          <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>
           {/* {Set Error and success message} */}
                    {error && <Errormsg message={error.message} />}
                    {success && <Successmsg message="Link send with your register email address..." />}
      <form className="flex flex-col w-72" onSubmit={handlerSubmit}>
        <label htmlFor="email" className="mb-2 text-sm font-medium">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          placeholder="Enter your email"
          className="p-2 mb-4 rounded border border-gray-300"
          onChange={handlerChange}
        />
        <button
          type="submit"
          className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
