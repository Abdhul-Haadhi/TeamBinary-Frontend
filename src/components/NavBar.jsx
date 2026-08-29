import React, { useEffect, useRef, useState } from "react";
import {
    Shield,
    Menu,
    Bell,
    ChevronDown,
    LogOut,
    User,
    Building2,
    X,
} from "lucide-react";

import "../css/NavBar.css";
import autoTraceLogo from "../assets/autoTraceLogo.png";


const NavBar = ({
    title = "Dashboard",
    toggleSidebar,
}) => {

    const [showProfile, setShowProfile] =
        useState(false);

    const profileRef =
        useRef(null);


    // =========================================================
    // USER
    // =========================================================

    const getStoredUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(
                storedUser
            );

        } catch (error) {

            console.error(
                "Could not read user information:",
                error
            );

            return null;
        }
    };


    const user =
        getStoredUser();


    // =========================================================
    // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
    // =========================================================

    useEffect(() => {

        const handleOutsideClick = (
            event
        ) => {

            if (
                profileRef.current &&
                !profileRef.current.contains(
                    event.target
                )
            ) {

                setShowProfile(false);
            }
        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "token"
        );

        window.location.href =
            "/login";
    };


    // =========================================================
    // ROLE DISPLAY
    // =========================================================

    const getRoleLabel = () => {

        if (!user?.role) {
            return "User";
        }

        switch (user.role) {

            case "SYSTEM_ADMIN":
                return "System Administrator";

            case "ADMIN":
                return "Administrator";

            case "INVESTIGATOR":
                return "Investigator";

            default:
                return user.role;
        }
    };


    // =========================================================
    // INITIALS
    // =========================================================

    const getInitials = () => {

        if (!user?.email) {
            return "U";
        }


        const email =
            user.email.trim();


        if (!email) {
            return "U";
        }


        return email
            .charAt(0)
            .toUpperCase();
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <nav className="navbar">


            {/* ==================================================
                LEFT SIDE
            ================================================== */}

            <div className="navbar-left">


                {/* Sidebar Button */}

                <button
                    className="menu-btn"
                    onClick={() => {

                        if (
                            typeof toggleSidebar ===
                            "function"
                        ) {

                            toggleSidebar();
                        }

                    }}
                    aria-label="Toggle navigation"
                >
                    <Menu size={21} />
                </button>


                {/* Brand */}

                <div className="navbar-brand">

                    <div className="brand-icon">

                        <img
                            className="logo"
                            src={autoTraceLogo}
                            alt="AutoTrace Logo"
                        />

                        {/* <Shield
                            size={20}
                            strokeWidth={2.4}
                        /> */}

                    </div>


                    <div className="brand-text">

                        <span className="brand-name">
                            AutoTrace
                        </span>

                        <span className="brand-subtitle">
                            VEHICLE INTELLIGENCE
                        </span>

                    </div>

                </div>


                {/* Separator */}

                <div className="navbar-divider"></div>


                {/* Current Page */}

                <div className="navbar-page-info">

                    <span className="navbar-page-label">
                        Current Module
                    </span>

                    <span className="navbar-page-title">
                        {title}
                    </span>

                </div>

            </div>


            {/* ==================================================
                RIGHT SIDE
            ================================================== */}

            <div className="navbar-right">


                {/* Organization */}

                {user?.organizationName && (

                    <div className="navbar-organization">

                        <div className="organization-icon">

                            <Building2 size={15} />

                        </div>


                        <div className="organization-text">

                            <span>
                                Organization
                            </span>

                            <strong>
                                {
                                    user.organizationName
                                }
                            </strong>

                        </div>

                    </div>

                )}


                {/* Notification */}

                <button
                    className="notification-btn"
                    title="Notifications"
                    aria-label="Notifications"
                >

                    <Bell size={19} />

                    <span className="notification-dot"></span>

                </button>


                {/* Vertical divider */}

                <div className="navbar-small-divider"></div>


                {/* Profile */}

                <div
                    className="profile-wrapper"
                    ref={profileRef}
                >

                    <button
                        className="profile-button"
                        onClick={() =>
                            setShowProfile(
                                (previous) =>
                                    !previous
                            )
                        }
                    >


                        <div className="profile-avatar">

                            {getInitials()}

                        </div>


                        <div className="profile-info">

                            <span className="profile-email">

                                {
                                    user?.email ||
                                    "User"
                                }

                            </span>

                            <span className="profile-role">

                                {getRoleLabel()}

                            </span>

                        </div>


                        <ChevronDown
                            size={15}
                            className={
                                `profile-chevron ${showProfile
                                    ? "open"
                                    : ""
                                }`
                            }
                        />

                    </button>


                    {/* ==================================================
                        PROFILE DROPDOWN
                    ================================================== */}

                    {showProfile && (

                        <div className="profile-dropdown">


                            <div className="profile-dropdown-header">

                                <div className="profile-dropdown-avatar">

                                    {getInitials()}

                                </div>


                                <div>

                                    <strong>
                                        {
                                            user?.email ||
                                            "User"
                                        }
                                    </strong>

                                    <span>
                                        {getRoleLabel()}
                                    </span>

                                </div>

                            </div>


                            <div className="profile-dropdown-divider"></div>


                            <div className="profile-detail-row">

                                <User
                                    size={14}
                                />

                                <div>

                                    <span>
                                        Account
                                    </span>

                                    <strong>
                                        {
                                            user?.email ||
                                            "Not available"
                                        }
                                    </strong>

                                </div>

                            </div>


                            {user?.organizationName && (

                                <div className="profile-detail-row">

                                    <Building2
                                        size={14}
                                    />

                                    <div>

                                        <span>
                                            Organization
                                        </span>

                                        <strong>
                                            {
                                                user.organizationName
                                            }
                                        </strong>

                                    </div>

                                </div>

                            )}


                            <div className="profile-dropdown-divider"></div>


                            <button
                                className="dropdown-logout-btn"
                                onClick={
                                    handleLogout
                                }
                            >

                                <LogOut
                                    size={15}
                                />

                                <span>
                                    Sign out
                                </span>

                            </button>

                        </div>

                    )}

                </div>


                {/* Quick logout button */}

                <button
                    className="navbar-logout-btn"
                    onClick={
                        handleLogout
                    }
                    title="Logout"
                >

                    <LogOut size={16} />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </nav>
    );
};


export default NavBar;