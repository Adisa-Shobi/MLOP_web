
import React from "react";
import { Link } from "react-router-dom";
import { 
  LineChart, Upload, BarChart3, RefreshCw
} from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-gradient-to-r from-fitness-primary to-fitness-secondary p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Fitness ML Platform</Link>
        
        <div className="flex space-x-6">
          <NavLink to="/" label="Predict" icon={<LineChart className="h-5 w-5" />} />
          <NavLink to="/visualize" label="Visualize" icon={<BarChart3 className="h-5 w-5" />} />
          <NavLink to="/upload" label="Upload Data" icon={<Upload className="h-5 w-5" />} />
          <NavLink to="/train" label="Train Model" icon={<RefreshCw className="h-5 w-5" />} />
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NavLink = ({ to, label, icon }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className="flex items-center space-x-1 hover:text-fitness-light transition-colors duration-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Navigation;
