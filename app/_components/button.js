"use client"; 
 
import { useFormStatus } from "react-dom";
import { useState } from "react"; 
 
export const LoginButton = () => { 
    const {pending} = useFormStatus(); 
    return( 
        <button 
        type="submit" 
        disabled={pending} 
        className={`w-full max-w-[364px] py-2 font-bold text-color3 border-2 border-white rounded-full tracking-[0.5px] cursor-pointer text-sm my-9 
            transition duration-300 ease-in-out ${ 
        pending 
            ? "bg-white text-color3 font-semibold tracking-[0.5px]" // Hover styles for "pending" state 
            : "hover:bg-white hover:text-color3 hover:font-semibold hover:tracking-[0.5px] focus:bg-white focus:text-color3 focus:font-semibold text-white" 
        }`} 
        >{pending ? "Authenticating..." : "Login"} 
        </button> 
    ); 
}; 
 
export const SignupButton = () => { 
    const {pending} = useFormStatus(); 
 
    return( 
        <button type="submit" id="log-in" 
        disabled={pending} 
        className={`py-2 my-9 font-bold text-white border border-transparent rounded-full tracking-[0.5px] cursor-pointer w-full max-w-[364px] text-sm 
            transition duration-200 ease-in-out 
            ${pending ? "bg-color6 shadow-custom" : "bg-color2 hover:bg-color6 hover:shadow-custom"}`} 
        >{pending ? "Sign Up..." : "Sign Up"}</button> 
    ); 
};

export const Pagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
  return (
      <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-2 text-white hover:bg-blue-3"
            }`}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-3 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-2 text-white hover:bg-blue-3"
            }`}
          >
            Next
          </button>
      </div>
  );
}
