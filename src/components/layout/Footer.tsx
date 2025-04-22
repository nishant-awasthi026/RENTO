
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-rento-dark text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo className="h-8" />
            <p className="text-sm text-gray-300">
              RENTO RIDE RETURN - Your trusted platform for vehicle rentals from 2-wheelers to 20-wheelers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-rento-yellow">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rento-yellow">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rento-yellow">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rento-yellow">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase mb-4 text-rento-yellow">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="text-gray-300 hover:text-white">
                  Find Vehicles
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase mb-4 text-rento-yellow">Vehicle Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search?category=2-wheeler" className="text-gray-300 hover:text-white">
                  2-Wheelers
                </Link>
              </li>
              <li>
                <Link to="/search?category=4-wheeler" className="text-gray-300 hover:text-white">
                  4-Wheelers
                </Link>
              </li>
              <li>
                <Link to="/search?category=commercial" className="text-gray-300 hover:text-white">
                  Commercial Vehicles
                </Link>
              </li>
              <li>
                <Link to="/search?category=heavy" className="text-gray-300 hover:text-white">
                  Heavy Vehicles
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase mb-4 text-rento-yellow">Contact Us</h3>
            <ul className="space-y-2 text-sm">
            <li className="flex items-start"><MapPin size={16} className="mr-2 mt-1 text-rento-yellow" /><span className="text-gray-300">SRMIST NCR CAMPUS, Modinagar, UP - 201204</span></li>

              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-rento-yellow" />
                <span className="text-gray-300">8102242652</span>
              </li>
              <li className="flex items-center"> 
                <Mail size={16} className="mr-2 text-rento-yellow" />
                <span className="text-gray-300">support@rento.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} RENTO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
