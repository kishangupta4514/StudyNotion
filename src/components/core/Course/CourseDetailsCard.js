import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"

import { studentEndpoints } from "../../../services/apis";
import { apiconnector } from "../../../services/apiconnector";
import { setPaymentLoading } from "../../../slices/courseSlice";
import { resetCart } from "../../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;


const CLIENT_ID =
  "ARiJCuvGJjfvypDK5OqDGujE2WdGUGPWjK1R2ipqCa3wCxMWKGks34KkTXq0YhPrh_EPYVdFg0RHVjas";

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { thumbnail: ThumbnailImage, price: CurrentPrice } = course;

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor, you cant buy a course");
      return;
    }
    if (token) {
      console.log("dispatching add to cart");
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: "you are not logged in",
      text2: "Please login to add to cart",
      btn1text: "login",
      btn2Text: "cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied to Clipboard");
  };

  const verify = async () => {
    async function verifyPayment(bodyData, token, navigate, dispatch) {
      const toastId = toast.loading("Verifying Payment....");
      console.log(bodyData)
      dispatch(setPaymentLoading(true));
      try {
        const response = await apiconnector(
          "POST",
          COURSE_VERIFY_API,
          bodyData,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        toast.success("payment Successful, you are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
      } catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
      }
      toast.dismiss(toastId);
      dispatch(setPaymentLoading(false));
    }
    await verifyPayment({ courses: 
        course}, token, navigate, dispatch);
  };

  return (
    <>
    <div  className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
      <img
        src={ThumbnailImage}
        alt={course?.courseName}
        className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
      />
         <div className="px-4">
         <div className="space-x-3 pb-4 text-3xl font-semibold">
           Rs. {CurrentPrice}
         </div>
      <div className="flex flex-col gap-4">
        <button
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
          onClick={
            user && course?.studentsEnrolled.includes(user?._id)
              ? () => navigate("/dashboard/enrolled-courses")
              : verify
          }
        >
          {user && course?.studentsEnrolled.includes(user?._id)
            ? "Go to Course "
            : "Buy now"}
        </button>

        {!course?.studentsEnrolled.includes(user?._id) && (
          <button
            onClick={handleAddToCart}
            className="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2"
          >
            Add to Cart
          </button>
        )}
      </div>
      {/* <div id="paypal-button-container"></div> */}

      <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              This Course Includes :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
        </div>
   </>
  )
}

export default CourseDetailsCard;
