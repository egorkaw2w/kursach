import AboutUs from "@components/About_us/AboutUs";
import ButtonArea from "@components/ButtonArea/ButtonArea";
import Header from "@components/header/Header"
import WelcomeImage from "@components/WelcomeImage/WelcomeImage"
export default function Home() {
  return (
    <div className="">
      <Header />
      <WelcomeImage/>
      <AboutUs/>
      <ButtonArea/>
    </div>
  );
}
