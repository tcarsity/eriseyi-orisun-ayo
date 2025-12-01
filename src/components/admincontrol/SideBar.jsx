import React, { useEffect, useMemo } from "react";
import { FaEdit, FaPen } from "react-icons/fa";
import { IoGrid, IoPeople } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { BsCalendarEventFill } from "react-icons/bs";

const SideBar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const rolePrefix = useMemo(
    () => (user?.role === "superadmin" ? "superadmin" : "admin"),
    [user?.role]
  );
  const showAdmins = useMemo(
    () =>
      user?.role === "superadmin" &&
      location.pathname.startsWith("/superadmin"),
    [user?.role, location.pathname]
  );
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };
  return (
    <>
      <div className="card shadow border-0">
        <div className="card-body">
          <div className="sidebar">
            <nav className="nav flex-column">
              <NavLink
                to={`/${rolePrefix}-dashboard`}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span>
                  <IoGrid /> Dashboard
                </span>
              </NavLink>

              <NavLink
                to={`/${rolePrefix}-members`}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span>
                  <IoPeople /> Members
                </span>
              </NavLink>

              {showAdmins && (
                <NavLink
                  to="/superadmin-admins"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span>
                    <IoPeople /> Admins
                  </span>
                </NavLink>
              )}

              <NavLink
                to={`/${rolePrefix}-testimonials`}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span>
                  <FaPen /> Testimonials
                </span>
              </NavLink>

              <NavLink
                to={`/${rolePrefix}-events`}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span>
                  <BsCalendarEventFill /> Events
                </span>
              </NavLink>

              <NavLink
                to={`/${rolePrefix}-profile`}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span>
                  <FaEdit /> Edit Profile
                </span>
              </NavLink>

              <NavLink
                to={`/${rolePrefix}-change-password`}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span>
                  <RiLockPasswordFill /> Change Password
                </span>
              </NavLink>

              <NavLink
                to="/logout"
                onClick={handleLogout}
                className="nav-link fw-bold"
              >
                <span style={{ color: "red" }}>
                  <MdLogout /> Logout
                </span>
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(SideBar);
