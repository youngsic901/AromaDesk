import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const AdminMainPage = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/admin/products"); }, [navigate]);
  return null;
};
export default AdminMainPage;
