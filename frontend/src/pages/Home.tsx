import { Component } from "solid-js";
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import Footer from "../components/home/Footer";
import AlumniSection from "../components/home/AlumniSection";

const Home: Component = () => {
  return (
    <main class="flex flex-col w-screen h-screen max-w-full">
      <Header />
      <Hero />
      <AlumniSection />
      <Footer />
    </main>
  );
};

export default Home;
