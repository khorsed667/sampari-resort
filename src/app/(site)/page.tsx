import Hero from "@/components/home/Hero";
import BookingBar from "@/components/home/BookingBar";
import About from "@/components/home/About";
import Rooms from "@/components/home/Rooms";
import Gallery from "@/components/home/Gallery";
import ResortInfo from "@/components/home/ResortInfo";
import Reviews from "@/components/home/Reviews";
import Location from "@/components/home/Location";

export default function Home() {
  return (
    <main id="booking">
      <Hero />
      <BookingBar />
      <About />
      <Rooms />
      <Gallery />
      <ResortInfo />
      <Reviews />
      <Location />
    </main>
  );
}
