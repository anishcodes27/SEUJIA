export default function AuthenticitySection() {
  // Replace these Google Drive links with your actual video links
  // How to get Google Drive video link:
  // 1. Upload video to Google Drive
  // 2. Right-click video → Share → Change to "Anyone with the link"
  // 3. Copy the link (looks like: https://drive.google.com/file/d/FILE_ID/view)
  // 4. Extract the FILE_ID from the link
  // 5. Use format: https://drive.google.com/file/d/FILE_ID/preview
  
  const videos = [
    {
      id: 1,
      title: 'Honey Harvesting Process',
      videoUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_1/preview',
      description: 'Watch how we carefully harvest pure honey from our hives'
    },
    {
      id: 2,
      title: 'Our Bee Farm',
      videoUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_2/preview',
      description: 'A tour of our sustainable bee farming facilities'
    },
    {
      id: 3,
      title: 'Quality Testing',
      videoUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_3/preview',
      description: 'See our rigorous quality control and testing process'
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-honey-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-honey-600 font-bold text-xl">Nature's Trust, Seujia's Promise</span>
          </div>
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <span className="text-4xl">🎥</span>
            <span className="text-4xl">🍯</span>
            <span className="text-4xl">🐝</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-honey-800 mb-4">
            See Our Authenticity in Action
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Transparency builds trust. Watch our journey from hive to home, and see the purity 
            and care that goes into every bottle of Seujia Honey.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-honey-400 to-honey-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
            >
              {/* Video Container */}
              <div className="relative aspect-video bg-gray-200 overflow-hidden">
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-honey-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-honey-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-gradient-to-r from-honey-600 to-honey-700 rounded-2xl p-8 md:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-5xl mb-2">✓</div>
              <h3 className="text-2xl font-bold">100% Transparent</h3>
              <p className="text-honey-100">
                Every step documented from hive to home
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-5xl mb-2">🌿</div>
              <h3 className="text-2xl font-bold">Natural Process</h3>
              <p className="text-honey-100">
                No artificial additives or processing
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-5xl mb-2">🔬</div>
              <h3 className="text-2xl font-bold">Lab Tested</h3>
              <p className="text-honey-100">
                Certified pure and quality assured
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-700 mb-6 text-lg">
            Have questions about our process? Want to visit our farm?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:info@seujiahoney.com"
              className="inline-flex items-center space-x-2 bg-honey-600 hover:bg-honey-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact Us</span>
            </a>
            <a
              href="tel:+911234567890"
              className="inline-flex items-center space-x-2 bg-white border-2 border-honey-600 text-honey-700 hover:bg-honey-50 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
