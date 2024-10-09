import { Component } from "solid-js";
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import Footer from "../components/home/Footer";
import AlumniSection from "../components/home/AlumniSection";

const Home: Component = () => {
  return (
    <main class="flex bg-inherit flex-col w-screen h-screen max-w-full">
      <Header />
      <div class="bg-inherit border-slate-900 border-2 h-2"></div>
      <Hero />
      <div class="bg-inherit border-2"></div>
      <AlumniSection />
      <div class="bg-inherit border-2"></div>
      <Footer />
    </main>
  );
};

export default Home;
