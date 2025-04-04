import Logo from "@assets/icons/Logo";
import "./Register.scss";
import Link from "next/link";

const Register = () => {
  return (
    <main className="register container mx-auto justify-center items-center min-h-screen flex flex-col">
      <Logo className="" />
      <h1 className="title">Регистрация</h1>
      <div className="RegisterArea flex  flex-col justify-center items-center">
        <div className="input-wrapper ">
          <input className="Register__login" placeholder="Логин" />
        </div>
        <div className="input-wrapper">
          <input className="Register__password" placeholder="Пароль" type="password" />
        </div>
        <div className="ToLogin self-end">
          <p>
            Есть аккаунт? <Link href="/Auth/login">Войди!</Link>
          </p>
        </div>
        <button className="Register-btn px-10">Зарегистрироваться</button>
      </div>
    </main>
  );
};

export default Register;