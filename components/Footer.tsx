import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-honey-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4">
            <Image 
              src="/logo.png" 
              alt="Seujia Honey" 
              fill 
              className="object-contain" 
            />
          </div>

          {/* Motto */}
          <div className="mb-6">
            <p className="text-yellow-300 font-bold text-lg sm:text-xl tracking-wide text-center">
              Nature's Trust, Seujia's Promise
            </p>
            <p className="text-honey-200 text-sm sm:text-base text-center mt-2 max-w-md mx-auto">
              Bringing you pure, authentic honey from nature to your home
            </p>
          </div>

          {/* Social Media Links */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Instagram */}
              <a 
                href="https://instagram.com/seujiahoney" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-honey-200 transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm font-medium">Instagram</span>
              </a>

              {/* Email */}
              <a 
                href="mailto:seujiaorganics@gmail.com" 
                className="flex items-center space-x-2 hover:text-honey-200 transition-colors duration-200"
                aria-label="Email"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">seujiaorganics@gmail.com</span>
              </a>

              {/* Phone */}
              <a 
                href="tel:+916001582738" 
                className="flex items-center space-x-2 hover:text-honey-200 transition-colors duration-200"
                aria-label="Phone"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-medium">+91 600 158 2738</span>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-honey-300 text-xs sm:text-sm">
            © {new Date().getFullYear()} Seujia Honey. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
