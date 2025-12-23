import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { LogOut, MessageSquare, Settings, User, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

const INDIAN_LANGUAGES = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાફી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਲੀ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "en", name: "English", nativeName: "English" },
];

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const currentLanguage = INDIAN_LANGUAGES.find(lang => lang.code === language) || INDIAN_LANGUAGES[0];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">ChatWithMe</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                className="btn btn-sm gap-2 transition-colors"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50">
                  <div className="py-2 max-h-64 overflow-y-auto">
                    {INDIAN_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        className={`w-full px-4 py-2 text-left hover:bg-base-200 transition-colors flex items-center justify-between ${
                          language === lang.code ? 'bg-primary/10 text-primary' : ''
                        }`}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{lang.nativeName}</span>
                          <span className="text-xs text-base-content/70">{lang.name}</span>
                        </div>
                        {language === lang.code && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isLanguageDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}
    </header>
  );
};
export default Navbar;