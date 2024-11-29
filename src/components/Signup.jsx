import { useNavigate } from "react-router-dom";

const Signup = () => {
  const Navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("user");
    Navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-600 active:scale-95 transition-all duration-200 sm:px-8 sm:py-3"
    >
      Logout
    </button>
  );
};
export default Signup;
