import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import WindowControls from "../components/WindowControls"
import backLogo from "../assets/back_logo.png"




const Home = () => {
    const [token, setToken] = useState(null)

    useEffect(() => {
        window.electronAPI?.onReceiveToken((jwt) => {
            console.log("Token receive: ", jwt)
            setToken(jwt)
        })
    }, [])

    return (
        <>
            <div>
                <WindowControls />
                <Navbar></Navbar>
                <div className="home_container">
                    <img src={backLogo} className="logomarca" />
                </div>
            </div>
        </>
    )
}

export default Home
