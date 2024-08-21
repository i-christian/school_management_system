import { Component } from 'solid-js';
import Header from '../components/home/Header';
import Hero from '../components/home/Hero';
import Footer from '../components/home/Footer';


const Home: Component = () => {
  return (
    <main class="flex flex-col">
      <Header />
      <Hero />
      <Footer />
    </main >
  )
}

export default Home;
