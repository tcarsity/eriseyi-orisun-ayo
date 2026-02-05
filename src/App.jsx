import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import AddMember from "./components/pages/AddMember";
import Login from "./components/admin/Login";
import { default as ShowAdmins } from "./components/admin/Show";
import { default as EditAdmins } from "./components/admin/Edit";
import { default as CreateAdmins } from "./components/admin/Create";
import { default as ShowTestimonials } from "./components/testimonial/Show";
import { default as EditTestimonial } from "./components/testimonial/Edit";
import { default as CreateTestimonial } from "./components/testimonial/Create";
import { default as ShowEvents } from "./components/events/Show";
import { default as CreateEvents } from "./components/events/Create";
import { default as EditEvent } from "./components/events/Edit";
import Unauthorized from "./components/admin/Unauthorized";
import NotFoundPage from "./components/admin/NotFoundPage";
import Dashboard from "./components/admin/Dashboard";
import RequireAuth from "./components/common/RequireAuth";
import Show from "./components/members/Show";
import Edit from "./components/members/Edit";
import Create from "./components/members/Create";
import AdminDashboard from "./components/admincontrol/AdminDashboard";
import ChangePassword from "./components/admin/ChangePassword";
import ForgotPassword from "./components/admin/ForgotPassword";
import ResetPassword from "./components/admin/ResetPassword";
import EditProfile from "./components/admin/EditProfile";
import { ThemeProvider } from "./components/context/ThemeContext";
import NetworkStatus from "./components/NetworkStatus";

function App() {
  return (
    <>
      <NetworkStatus />
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/admin/login" element={<Login />} />
          <Route path="/add-member" element={<AddMember />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* SUPERADMIN ROUTES  */}

          <Route element={<RequireAuth allowedRoles={["superadmin"]} />}>
            {/* <Route element={<SuperAdminLayout />}> */}
            <Route path="/superadmin-dashboard" element={<Dashboard />} />
            <Route path="/superadmin-members" element={<Show />} />
            <Route path="/superadmin-member/edit/:id" element={<Edit />} />
            <Route path="/superadmin-member/create" element={<Create />} />

            {/* admin information */}
            <Route path="/superadmin-admins" element={<ShowAdmins />} />
            <Route path="/superadmin-admin/edit/:id" element={<EditAdmins />} />
            <Route path="/superadmin-admin/create" element={<CreateAdmins />} />

            {/* Testimonials */}
            <Route
              path="/superadmin-testimonials"
              element={<ShowTestimonials />}
            />
            <Route
              path="/superadmin-testimonial/edit/:id"
              element={<EditTestimonial />}
            />

            <Route
              path="/superadmin-testimonail/create"
              element={<CreateTestimonial />}
            />

            <Route path="/superadmin-events" element={<ShowEvents />} />
            <Route path="/superadmin-event/create" element={<CreateEvents />} />
            <Route path="/superadmin-event/edit/:id" element={<EditEvent />} />

            <Route
              path="/superadmin-change-password"
              element={<ChangePassword />}
            />
            {/* </Route> */}
          </Route>

          <Route path="/superadmin-profile" element={<EditProfile />} />

          {/*  ADMIN ROUTES */}

          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            {/* <Route element={<AdminLayout />}> */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* Members */}
            <Route path="/admin-members" element={<Show />} />
            <Route path="/admin-member/edit/:id" element={<Edit />} />
            <Route path="/admin-member/create" element={<Create />} />

            {/* Testimonials */}
            <Route path="/admin-testimonials" element={<ShowTestimonials />} />

            <Route
              path="/admin-testimonial/edit/:id"
              element={<EditTestimonial />}
            />

            <Route
              path="/admin-testimonail/create"
              element={<CreateTestimonial />}
            />

            <Route path="/admin-events" element={<ShowEvents />} />
            <Route path="/admin-event/create" element={<CreateEvents />} />
            <Route path="/admin-event/edit/:id" element={<EditEvent />} />

            <Route path="/admin-change-password" element={<ChangePassword />} />
            <Route path="/admin-profile" element={<EditProfile />} />
            {/* </Route> */}
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
