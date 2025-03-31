import "./profile.scss"
type ProfileProps = {
    name: string,
    gender: string,
    DOB: string,
    mail: string,
    img:string,
}

const Profile = ({name = "пользователь",img, gender = "мужской",DOB = "04.05.2005",mail = "example@mail.com"}: ProfileProps) => {
    return (
        <div className="Profile container mx-auto grid grid-cols-2  mt-10">
            <p className="col-span-2 self-center justify-self-center my-10">Здравствуйте, {name}</p>
            <div className="Profile__img">
                <img src={img} alt="profile Img" />
            </div>
            <div className="Profile__data w-1/2 ">
                <div className="gender flex justify-between ">
                    <p>Пол</p>
                    <p>{gender}</p>
                </div>
                <div className="DOB flex justify-between my-6">
                    <p>День рождения</p>
                    <p>{DOB}</p>
                </div>
                <div className="profile__mail flex justify-between">
                    <p>Почта</p>
                    <p>{mail}</p>
                </div>
            </div>
        </div>
    )
}
export default Profile

