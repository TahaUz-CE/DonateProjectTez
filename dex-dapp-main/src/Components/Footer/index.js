import React from "react";
import "./index.css";
import { Container, Row, Col } from "react-bootstrap";
import HeaderLogo from "../../Assets/etm.png";
import { BsDiscord, BsReddit, BsTwitter, BsGithub } from "react-icons/bs";
import { FaTelegram } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";

function Footer() {
  return (
    <div className="footerBackground">
      <Container>
        <Row>
          <Col>
            <div className="footerMain">
              <div className="footerRight">
                <img className="footerLogo" src={HeaderLogo} />
                <div className="footerRightText">Tomorrow Is in Your Hands</div>
              </div>
              <div className="footerLeft">
                <div className="footerLeftText">
                  Copyright @ Tomorrow Is in Your Hands 2023
                </div>
                <div className="footerLeftIcons">
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
                  <a
                    href="https://www.linkedin.com/in/taha-uz-18b894166/"
                    className="navBarLinkIcon"
                  >
                    <BsDiscord />
                  </a>
                </div>
              </div>
              <div className="footerLeftMobile">
                <div className="footerLeftIconsMobile">
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
                  <a
                    href="https://www.linkedin.com/in/taha-uz-18b894166/"
                    className="navBarLinkIcon"
                  >
                    <BsDiscord />
                  </a>
                </div>
                <div className="footerLeftTextMobile">
                  Copyright @ Tomorrow Is in Your Hands 2023
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
