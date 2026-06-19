import Navbar from "../components/Navbar/Navbar";
import FloodInfo from "../components/FloodInfo/FloodInfo";
import ReportList from "../components/ReportList/ReportList";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <FloodInfo />
      <ReportList />
      <Footer />
    </div>
  );
}

export default Home;