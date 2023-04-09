import React, { useState } from "react";
import "./index.css";
import { ConnectWallet } from "./connectButton";
import { Container, Nav, Navbar } from "react-bootstrap";
import HeaderLogo from "../../Assets/etm.png";
import { BsDiscord, BsReddit, BsTwitter, BsGithub } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useAccount } from "wagmi";
import { TbDotsCircleHorizontal } from "react-icons/tb";
import { NavLink, useLocation } from "react-router-dom";
import { FaTelegram } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";

function Header() {
  const { address } = useAccount();

  const [active, setActive] = useState();

  const handleClick = () => {
    setActive(!active);
  };

  const location = useLocation();

  const splitLocation = location.pathname;

  const isActiveLink = ({ isActive }) => {
    return {
      color: isActive ? "#0B8848" : "#FFFFFF",
    };
  };

  return (
    <Navbar className="navBarMain sticky-top" expand="lg">
      <Container>
        <Navbar.Brand>
          <img src={HeaderLogo} />

          <NavLink className="navBarLink" to="/" relative="path">
            Tomorrow Is in Your Hands
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navBarLinks">
            {splitLocation === "/" ? (
              <NavLink
                className={
                  splitLocation === "/dashboard"
                    ? "navBarLinkActive"
                    : "navBarLink"
                }
                // style={isActiveLink}
                to="/dashboard"
              >
                Account Info
              </NavLink>
            ) : (
              <NavLink
                className={
                  splitLocation === "/" ? "navBarLinkActive" : "navBarLink"
                }
                to="/"
              // style={isActiveLink}
              >
                Main Page
              </NavLink>
            )}

            {splitLocation === "/" ? (
              <NavLink
                className={
                  splitLocation === "/foundation"
                    ? "navBarLinkActive"
                    : "navBarLink"
                }
                // style={isActiveLink}
                to="/foundation"
              >
                Foundation
              </NavLink>
            ) : (
              <NavLink
                className={
                  splitLocation === "/" ? "navBarLinkActive" : "navBarLink"
                }
                to="/"
              // style={isActiveLink}
              >

              </NavLink>
            )}

            {splitLocation === "/" ? (
              <NavLink
                className={
                  splitLocation === "/foundationTracking"
                    ? "navBarLinkActive"
                    : "navBarLink"
                }
                // style={isActiveLink}
                to="/foundationTracking"
              >
                Foundation Tracking
              </NavLink>
            ) : (
              <NavLink
                className={
                  splitLocation === "/" ? "navBarLinkActive" : "navBarLink"
                }
                to="/"
              // style={isActiveLink}
              >

              </NavLink>
            )}

            {splitLocation === "/" ? (
              <NavLink
                className={
                  splitLocation === "/codeSearch"
                    ? "navBarLinkActive"
                    : "navBarLink"
                }
                // style={isActiveLink}
                to="/codeSearch"
              >
                Code Search
              </NavLink>
            ) : (
              <NavLink
                className={
                  splitLocation === "/" ? "navBarLinkActive" : "navBarLink"
                }
                to="/"
              // style={isActiveLink}
              >

              </NavLink>
            )}

            <NavLink className="navBarLink">
              <ConnectWallet />
            </NavLink>
            <div className="navIconForMobile">
              <a
                href="https://www.linkedin.com/in/taha-uz-18b894166/"
                target="_blank"
                className="navBarLinkIcon"
              >
                <FaTelegram />
              </a>
              <a
                href="https://www.linkedin.com/in/taha-uz-18b894166/"
                target="_blank"
                className="navBarLinkIcon"
              >
                <BsTwitter />
              </a>
              <a
                href="https://www.linkedin.com/in/taha-uz-18b894166/"
                className="navBarLinkIcon"
              >
                <TfiWorld />
              </a>
              {/* <a href="/" className="navBarLinkIcon">
                <BsGithub /> */}
              <a
                href="https://www.linkedin.com/in/taha-uz-18b894166/"
                className="navBarLinkIcon"
              >
                <BsDiscord />
              </a>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
