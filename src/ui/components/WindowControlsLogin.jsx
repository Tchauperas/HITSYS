import React from "react"
import './WindowControlsLogin.css'

export default function WindowControlsLogin() {
    const handleMin = () => {
        if (window?.electronAPI?.minimize) window.electronAPI.minimize();
    }
    const handleClose = () => {
        if (window?.electronAPI?.close) window.electronAPI.close();
    }

    return (
        <div id="titlebar-login">
            <div className="controls-login">
                <button id="min-btn-login" onClick={handleMin} aria-label="Minimize">―</button>
                <button id="close-btn-login" onClick={handleClose} aria-label="Close">✖</button>
            </div>
        </div>
    )
}