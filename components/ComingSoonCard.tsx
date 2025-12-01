'use client';

export default function ComingSoonCard() {
  return (
    <div className="bg-gradient-to-br from-honey-100 to-honey-200 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-dashed border-honey-400">
      <div className="relative h-64 bg-gradient-to-br from-honey-200 to-honey-300 flex items-center justify-center">
        <div className="text-center">
          <span className="text-7xl animate-bounce inline-block">🌸</span>
          <div className="mt-2 text-honey-700 font-bold text-lg">Seasonal</div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-honey-800 mb-2 text-center">
          More Varieties Coming Soon!
        </h3>
        
        <p className="text-sm text-gray-700 mb-4 text-center leading-relaxed">
          We're constantly adding new seasonal honey varieties based on flower availability. 
          Check back for limited edition flavors!
        </p>

        <div className="bg-white rounded-lg p-3 border border-honey-300">
          <p className="text-xs text-honey-700 font-semibold mb-1 text-center">
            🌿 Upcoming Varieties
          </p>
          <div className="flex flex-wrap gap-1 justify-center">
            <span className="text-xs bg-honey-100 text-honey-800 px-2 py-1 rounded-full">
              Litchi
            </span>
            <span className="text-xs bg-honey-100 text-honey-800 px-2 py-1 rounded-full">
              Eucalyptus
            </span>
            <span className="text-xs bg-honey-100 text-honey-800 px-2 py-1 rounded-full">
              Wild Forest
            </span>
            <span className="text-xs bg-honey-100 text-honey-800 px-2 py-1 rounded-full">
              & More
            </span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600 italic">
            ✨ Nature's bounty varies with the seasons
          </p>
        </div>
      </div>
    </div>
  );
}
