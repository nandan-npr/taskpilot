import { Link } from "react-router";
import { CheckCircle2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F8F3EA] border-t border-[#DED2C0] text-[#1F1D1A]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="rounded-[2rem] border border-[#D8C9B3] bg-[#FFFDF8] p-6 sm:p-8 card-shadow">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr_0.8fr] gap-8">
          </div>

          <div className="border-t border-[#E5D9C7] mt-9 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm font-semibold text-[#6F675D]">
              © {new Date().getFullYear()} TaskPilot. Built as a full-stack
              task manager project.
            </p>

            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;