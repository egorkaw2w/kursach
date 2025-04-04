import AboutUs from "@components/Home/About_us/AboutUs";
import ButtonArea from "@components/Home/ButtonArea/ButtonArea";
import WelcomeImage from "@components/Home/WelcomeImage/WelcomeImage"
export default function Home() {
  return (
    <div className="">
      <WelcomeImage/>
      <AboutUs/>
      <ButtonArea/>
    </div>
  );
}
