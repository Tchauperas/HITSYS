import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"

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
                <Navbar></Navbar>
                <div className="home_container">
                    <img
                        src="src\ui\assets\back_logo.png"
                        alt=""
                        className="logomarca"
                    />
                </div>
            </div>
        </>
    )
}

export default Home
