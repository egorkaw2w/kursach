import AboutUs from "@components/Home/About_us/AboutUs";
import ButtonArea from "@components/Home/ButtonArea/ButtonArea";
import Footer from "@components/footer/footer";
import Header from "@components/header/Header"
import WelcomeImage from "@components/Home/WelcomeImage/WelcomeImage"
export default function Home() {
  return (
    <div className="">
      <Header />
      <WelcomeImage/>
      <AboutUs/>
      <ButtonArea/>
      <Footer/>
    </div>
  );
}
