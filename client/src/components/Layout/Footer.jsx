import React from 'react';
import logo from "../../../dist/assets/logo/logo.png";
import GitHubLogo from "../../../dist/assets/logo/GitHub-logo.png";
import LinkedInLogo from "../../../dist/assets/logo/Linkedin-logo.png";
import TwitterLogo from "../../../dist/assets/logo/Twitter-logo.png";
import FacebookLogo from "../../../dist/assets/logo/Facebook-logo.png";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-100 text-slate-600 pt-14 pb-6 px-6 sm:px-12 lg:px-20 border-t border-slate-100 font-sans h-auto select-none">
      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        
        {/* UPPER FOOTER MAIN GRID: Mobile pe grid-cols-2 kiya taaki columns baju-baju me aayein */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-10 items-start w-full text-left">
          
          {/* COLUMN 1: Brand Info & Badges - Mobile pe full width wrap (col-span-2) */}
          <div className="col-span-2 lg:col-span-4 flex flex-col space-y-5 w-full">
            
            {/* LOGO SECTION */}
            <div className="flex items-center gap-2">
              <img 
                src={logo}
                alt="DocNexus Logo" 
                className="w-8 h-8 rounded-lg object-fill flex-shrink-0 drop-shadow-md"
              />
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Doc<span className="text-indigo-600">Nexus</span>
              </span>
            </div>

            {/* Description: max-w-xs hata kar w-full kiya taaki right me jagah khali na dikhe */}
            <p className="text-slate-500 text-sm leading-relaxed w-full">
              Convert your documents and images to PDF instantly. Fast, secure and easy to use.
            </p>

            {/* Feature Badges Grid: max-w-xs hata kar full width kiya */}
            <div className="grid grid-cols-2 gap-3 pt-2 w-full">
              
              {/* Secure Badge */}
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 border border-slate-100 rounded-lg p-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  🛡️
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate">Secure</span>
                  <span className="text-[10px] text-white font-medium truncate">Your files are safe</span>
                </div>
              </div>

              {/* Fast Badge */}
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 border border-slate-100 rounded-lg p-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  ⚡
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate">Fast</span>
                  <span className="text-[10px] text-white font-medium truncate">Quick conversion</span>
                </div>
              </div>

              {/* High Quality Badge */}
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 border border-slate-100 rounded-lg p-2.5 col-span-2">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  🏅
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate">High Quality</span>
                  <span className="text-[10px] text-white font-medium truncate">Best PDF output</span>
                </div>
              </div>

            </div>
          </div>

          {/* COLUMN 2: Product Links (Mobile pe col-span-1 yani aaju-baju dikhega) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col space-y-3.5">
            <h4 className="text-sm font-bold text-slate-800 tracking-wide">Product</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 font-medium">
              {['Image to PDF', 'PDF to Word', 'Word to PDF', 'Digital Signature', 'Compress PDF', 'All Tools'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 group cursor-pointer">
                  <span className="text-indigo-500 font-bold text-xs transition-transform group-hover:translate-x-0.5">&gt;</span>
                  <a href="#" className="hover:text-indigo-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Resources Links (Mobile pe Product ke baju me) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col space-y-3.5">
            <h4 className="text-sm font-bold text-slate-800 tracking-wide">Resources</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 font-medium">
              {['How to Use', 'FAQs', 'Blog', 'Privacy Policy', 'Terms of Service'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 group cursor-pointer">
                  <span className="text-indigo-500 font-bold text-xs transition-transform group-hover:translate-x-0.5">&gt;</span>
                  <a href="#" className="hover:text-indigo-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: Support Links */}
          <div className="col-span-1 lg:col-span-2 flex flex-col space-y-3.5">
            <h4 className="text-sm font-bold text-slate-800 tracking-wide">Support</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 font-medium">
              {['Contact Us', 'Report Bug', 'Feature Request', 'Help Center'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 group cursor-pointer">
                  <span className="text-indigo-500 font-bold text-xs transition-transform group-hover:translate-x-0.5">&gt;</span>
                  <a href="#" className="hover:text-indigo-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 5: Stay Updated (Mobile pe Support ke baju me aur md/lg screens par setup ke hisab se automatic wrap) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col space-y-3.5 w-full min-w-0">
            <h4 className="text-sm font-bold text-slate-800 tracking-wide">Stay Updated</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Subscribe to get the latest updates.
            </p>
            
            <div className="space-y-2.5 w-full">
              <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-2 py-2 focus-within:border-indigo-500 transition-colors">
                <span className="text-slate-400 text-sm mr-1 select-none">✉️</span>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="bg-transparent text-xs text-slate-800 outline-none w-full placeholder-slate-400 font-medium"
                />
              </div>

              <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM SEPARATOR LINE AND METRICS ROW */}
        <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-5 text-xs sm:text-sm text-slate-400 font-medium w-full">
          <div>
            &copy; {new Date().getFullYear()} <span className="text-indigo-600 font-semibold">DocNexus</span>. All rights reserved.
          </div>

          <div className="flex items-center gap-14">
            {[
              { img: FacebookLogo, alt: 'Facebook', bg: 'bg-indigo-50 hover:bg-indigo-600' },
              { img: TwitterLogo, alt: 'Twitter', bg: 'bg-blue-50 hover:bg-blue-500' },
              { img: LinkedInLogo, alt: 'LinkedIn', bg: 'bg-sky-50 hover:bg-sky-600' },
              { img: GitHubLogo, alt: 'GitHub', bg: 'bg-slate-100 hover:bg-slate-800' }
            ].map((social, idx) => (
              <a
                key={idx}
                href="#"
                className={`w-8 h-8 rounded-full ${social.bg} flex items-center justify-center shadow-sm hover:scale-105 transition-all duration-200 group`}
              >
                <img 
                  src={social.img} 
                  alt={social.alt} 
                  className="w-7 h-7 object-contain transition-all duration-200 group-hover:brightness-0 group-hover:invert" 
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <span className="text-slate-200">|</span>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;