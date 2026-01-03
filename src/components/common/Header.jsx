import React, { useMemo, useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import logo from "../../assets/images/logo.jpg";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { FaBell, FaFacebookF, FaTiktok } from "react-icons/fa";
import { useNewMembers } from "../../hooks/useNewMembers";
import { FaSquareInstagram } from "react-icons/fa6";

const Header = ({ showAllLinks }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [pendingScroll, setPendingScroll] = useState(null);
  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleNavClick = (e, id) => {
    e.preventDefault();

    // if offcanvas is open -> close it and wait for onExited
    if (showOffcanvas) {
      setPendingScroll(id);
      setShowOffcanvas(false);
      return;
    }
    // Desktop behavior
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  const { data: newMembers = [] } = useNewMembers();

  const today = new Date().toISOString().split("T")[0];

  const newMembersCount = newMembers.filter((m) => {
    const date = new Date(m.created_at?.replace(" ", "T"));
    return date.toISOString().split("T")[0] === today;
  }).length;

  const { user } = useAuth();

  const isLoggedIn = !!user;

  const dashboardRoute =
    user?.role === "superadmin" ? "/superadmin-dashboard" : "/admin-dashboard";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  const stringColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const bgColor = stringColor(user?.name);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar--home");
      if (!navbar) return;

      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={isHomePage ? "header--home" : "header--page"}>
        <div className="container">
          {["xl"].map((expand) => {
            const offcanvasId = `offcanvasNavbar-expand-${expand}`;
            return (
              <Navbar
                key={expand}
                expand={expand}
                expanded={showOffcanvas}
                className={
                  isHomePage
                    ? "navbar--home floating-navbar"
                    : "navbar--default"
                }
              >
                {/* centered white rounded box inside container */}
                <div className="floating-inner d-flex align-items-center w-100">
                  <div className="d-flex align-items-center navbar-left">
                    <Navbar.Brand href="/" className="logo">
                      <img src={logo} width={55} className="me-2" />
                      <span className="brand-text">
                        C &amp; S Eriseyi Orisun Ayo
                      </span>
                    </Navbar.Brand>
                  </div>
                  <Navbar.Toggle
                    // aria-controls={`offcanvasNavbar-expand-${expand}`}
                    aria-controls={offcanvasId}
                    onClick={handleShow}
                  />

                  <Navbar.Offcanvas
                    id={offcanvasId}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                    show={showOffcanvas}
                    onHide={handleClose}
                    onExited={() => {
                      if (pendingScroll) {
                        const section = document.getElementById(pendingScroll);
                        if (section) {
                          section.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });

                          window.history.replaceState(
                            null,
                            "",
                            `#${pendingScroll}`
                          );
                        }
                        setPendingScroll(null);
                      }
                    }}
                  >
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title
                        id={`offcanvasNavbarLabel-expand-${expand}`}
                      >
                        C &amp; S Eriseyi Orisun Ayo
                      </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                      {/* CENTER: nav links (visible on xl and up). use auto margin to center */}
                      <Nav className="d-xl-flex nav-center mx-auto gap-3">
                        <Nav.Link
                          href="/"
                          className={`nav-link ${
                            activeLink === "home" ? "active" : ""
                          }`}
                          onClick={(e) => {
                            setActiveLink("home");
                            handleClose();
                          }}
                        >
                          Home
                        </Nav.Link>

                        {showAllLinks && (
                          <>
                            <Nav.Link
                              href="/#about"
                              className={`nav-link ${
                                activeLink === "about" ? "active" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveLink("about");
                                handleNavClick(e, "about");
                              }}
                            >
                              About
                            </Nav.Link>
                            <Nav.Link
                              href="/#services"
                              className={`nav-link ${
                                activeLink === "services" ? "active" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveLink("services");
                                handleNavClick(e, "services");
                              }}
                            >
                              Services
                            </Nav.Link>
                            <Nav.Link
                              href="/#shepherd"
                              className={`nav-link ${
                                activeLink === "shepherd" ? "active" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveLink("shepherd");
                                handleNavClick(e, "shepherd");
                              }}
                            >
                              Shepherd
                            </Nav.Link>
                            <Nav.Link
                              href="/#testimonials"
                              className={`nav-link ${
                                activeLink === "testimonials" ? "active" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveLink("testimonials");
                                handleNavClick(e, "testimonials");
                              }}
                            >
                              Testimonials
                            </Nav.Link>

                            <Nav.Link
                              href="/#event"
                              className={`nav-link ${
                                activeLink === "event" ? "active" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveLink("event");
                                handleNavClick(e, "event");
                              }}
                            >
                              Events
                            </Nav.Link>
                            <Nav.Link
                              href="/#contact"
                              className={`nav-link ${
                                activeLink === "contact" ? "active" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveLink("contact");
                                handleNavClick(e, "contact");
                              }}
                            >
                              Contact
                            </Nav.Link>
                          </>
                        )}
                      </Nav>

                      {/*RIGHT: social icons + avatar + bell + toggle */}
                      <div className="d-flex align-items-center gap-3 navbar-right">
                        <div className="social-icons d-flex align-items-center gap-2">
                          <a
                            href="https://www.facebook.com/share/1BySrrPov/?mibextid=wwXlfr"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="facebook"
                          >
                            <FaFacebookF size={18} />
                          </a>

                          <a
                            href="#"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="instagram"
                          >
                            <FaSquareInstagram size={18} />
                          </a>

                          <a
                            href="https://www.tiktok.com/eriseyi___"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="tiktok"
                          >
                            <FaTiktok size={18} />
                          </a>
                        </div>

                        {isLoggedIn && (
                          <>
                            <Link
                              to={dashboardRoute}
                              className="text-decoration-none mt-2 notif-badge"
                            >
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold "
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: bgColor,
                                  fontSize: "14px",
                                }}
                                title={`${user?.name} (${user?.role})`}
                              >
                                {initials}
                              </div>
                            </Link>

                            <div className="position-relative notif-wrap">
                              <FaBell size={20} className="cursor-pointer" />
                              {newMembersCount > 0 && (
                                <span className="notif-badge position-absolute translate-middle badge rounded-pill bg-danger">
                                  {newMembersCount}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {/* always show toggle on smaller screens and on xl it will still be present but visually ok*/}
                    </Offcanvas.Body>
                  </Navbar.Offcanvas>
                </div>
              </Navbar>
            );
          })}
        </div>
      </header>
    </>
  );
};

export default React.memo(Header);
