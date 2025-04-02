import React from 'react'
import UsitiveLogo from "../../../../assets/usitive-logo.svg";
import './style.css'

function VideoFooter() {
  return (
    <footer className="video-footer-container">
          <div className="video-footer-left-content">
            <p>Powered by</p>
            <img src={UsitiveLogo} alt="logo" />
            <span>usitive meet</span>
          </div>
          <div className="video-footer-mid-content">
            Contact Us | Terms of Use | Privacy | Intellectual Property | Trust
          </div>
          <div className="video-footer-right-content">
            Copyright © 2025 Usitive Meet,Inc. All rights reserved
          </div>
        </footer>
  )
}

export default VideoFooter