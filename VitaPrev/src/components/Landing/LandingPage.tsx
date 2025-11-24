import LandingNavbar from "./LandingNavbar";
import FeaturesSection from "./Features";
import Publico from "./Publico";
import Hero from "./Hero";


export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-emerald-50">
      
      <LandingNavbar/>
      <Hero/>
      <div className="w-full h-20 bg-linear-to-b from-emerald-50 to-white"></div>
      <FeaturesSection/>
      <div className="w-full h-20 bg-linear-to-b from-white to-emerald-50"></div>
      <Publico/>

    </div>
  );
}
