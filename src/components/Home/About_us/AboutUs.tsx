
import "./AboutUs.scss"
const AboutUs = () =>{

    return(
        <div className="AboutUs container mx-auto  my-24">
            <section className="container grid grid-cols-2 gap-x-28">
                <article className="textArea container   ">
                    <h2 className="aboutUs__textTitle ">За нас будут говорить наши блюда</h2>
                    <p className="aboutUs__text mt-6">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque laboriosam nihil facere quia! Rerum cumque ab officiis quod sed natus cum, veritatis temporibus, libero blanditiis iste fuga qui a vitae? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque laboriosam nihil facere quia! Rerum cumque ab officiis quod sed natus cum, veritatis temporibus, libero blanditiis iste fuga qui a vitae?</p>
                </article>
                <div className="imgArea grid h-4/6 grid-cols-2 grid-rows-2  gap-4 ">
                    <img src="/usable_img/FoodImage/image_2.png" className="row-span-2 h-full w-full" alt="#"  />
                    <img src="/usable_img/FoodImage/image_3.png" className="h-full w-full" alt="#" />
                    <img src="/usable_img/FoodImage/image_4.png" className="h-full w-full" alt="#" />
                </div>
            </section>

            <section className="container grid grid-cols-2 gap-x-28">
                <img src="/usable_img/presonal.png" alt= "#" />
                <article className="textArea">
                    <h2 className="aboutUs__textTitle"> У нас работают лучшие  повары!</h2>
                    <p className="aboutUs__text"> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque laboriosam nihil facere quia! Rerum cumque ab officiis quod sed natus cum, veritatis temporibus, libero blanditiis iste fuga qui a vitae? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque laboriosam nihil facere quia! Rerum cumque ab officiis quod sed natus cum, veritatis temporibus, libero blanditiis iste fuga qui a vitae?</p>
                </article>
            </section>


        </div>
    )
}

export default AboutUs;