import Navbar from "../components/Navbar"

const Home = () => {
  return (
    <>
      <div>
        <Navbar></Navbar>
        <div className="home_container">
          <img src="src\ui\assets\back_logo.png" alt="" className="logomarca" />
        </div>
      </div>
    </>
  );
};

export default Home;
