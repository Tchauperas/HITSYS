import React from "react"
import './WindowControls.css'

export default function WindowControls() {
    const handleMin = () => {
        if (window?.electronAPI?.minimize) window.electronAPI.minimize();
    }
    const handleClose = () => {
        if (window?.electronAPI?.close) window.electronAPI.close();
    }

    return (
        <div id="titlebar">
            <div className="controls">
                <button id="min-btn" onClick={handleMin} aria-label="Minimize">―</button>
                <button id="close-btn" onClick={handleClose} aria-label="Close">✖</button>
            </div>
        </div>
    )
}