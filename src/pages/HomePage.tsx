import { Link } from 'react-router-dom';
import Features from '../components/Features';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <Features />
        <Footer />
      </div>
    </div>
  );
}