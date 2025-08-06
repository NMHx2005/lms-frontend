import TopBar from "@/components/Client/Home/TopBar/TopBar";
import Hero from "@/components/Client/Home/Hero/Hero";
import Partners from "@/components/Client/Home/Partners/Partners";
import FeaturedPrograms from "@/components/Client/Home/FeaturedPrograms/FeaturedPrograms";
import Courses from "@/components/Client/Home/Courses/Courses";
import FeaturedLearning from "@/components/Client/Home/FeaturedLearning/FeaturedLearning";
import CTA from "@/components/Client/Home/CTA/CTA";
import Testimonials from "@/components/Client/Home/Testimonial/Testimonials";
import Newsletter from "@/components/Client/Home/Newsletter/Newsletter";
import "@/styles/home.css"
import Header from "@/components/Layout/client/Header";
import Footer from "@/components/Layout/client/Footer";

const Home = () => {
    return (
        <>
            <TopBar />
            <Header />
            
            <main>
                <Hero />
                <Partners />
                <FeaturedPrograms />
                <Courses />
                <FeaturedLearning />
                <CTA />
                <Testimonials />
                <Newsletter />
            </main>
            <Footer />
        </>
    );
}

export default Home;