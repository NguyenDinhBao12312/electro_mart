import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function useAuth() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsAuth(true);
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Execute your action here after the paint
      // For example, you can show the menu and footer
      // setMenuVisible(true);
      // setFooterVisible(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return isAuth;
}

export default useAuth;
