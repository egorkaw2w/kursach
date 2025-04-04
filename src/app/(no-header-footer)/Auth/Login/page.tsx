import Logo from "@assets/icons/Logo";
import "./Login.scss";
import Link from "next/link";

const Login = () => {
  return (
    <main className="Login flexc flex-col">
      <Logo className="" />
      <h1 className="title">Авторизация</h1>
      <div className="LoginArea flex justify-center items-center">
        <div className="input-wrapper">
          <input className="Login__login" placeholder="Логин" />
        </div>
        <div className="input-wrapper">
          <input className="Login__password" placeholder="Пароль" type="password" />
        </div>
        <div className="ToAuth self-end">
          <p>Нет аккаунта? <Link href = "./Register">
          Зарегистрируйся!</Link></p>
        </div>
        <button className="Login-btn px-10 py-2">Авторизоваться</button>
      </div>
    </main>
  );
};

export default Login;