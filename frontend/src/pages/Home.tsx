import { Component } from 'solid-js';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';


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
