// src/pages/Home.jsx
import Carousel from "../components/carousel";

export default function Home() {
  return (
    <main className="p-8 mt-20 transition-all duration-300 max-w-screen-lg mx-auto text-center">
      <h1 className="text-3xl font-bold">Bienvenido a RideStore</h1>
      <p className="mt-4">Aquí encontrarás las mejores motopartes para KTM.</p>
      <Carousel />
      
    </main>
  );
}
