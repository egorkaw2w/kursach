"use client";
import "./footer.scss";
import Logo from "@assets/icons/Logo";

const Footer = () => {
  return (
    <div className="footer flex flex-col items-center   container  mx-auto mt-24">
      <div className="RestLogo ">
        <Logo />
        </div>
        <div className="footer_content container mx-auto flex justify-between items-center ">
          <div className="mapArea">
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3Af9d5460666b2cf8b06904eb3842b9b366eed352598d717a92bb3b9ec9e251376&source=constructor&scroll=false&theme=dark"
              width="500"
              height="300"
            ></iframe>
          </div>
          <div className="description_area">
            <p className="tel">8 (123) 456-78-90</p>
            <p className="tel">8 (123) 456-78-90 (доб 123)</p>
            <p className="mail mt-7">ChillAndDrill@gmail.com</p>
          </div>
        </div>
      </div>
  );
};

export default Footer;