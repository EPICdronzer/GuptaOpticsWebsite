import React from 'react';

const PerfectPair = () => {
  const items = [
    {
      id: 1,
      title: 'CLASSIC EVERYDAY SHADES',
      bg: 'bg-[#f6f5f2]',
      image: '/eco-thumb.png',
      tilt: 'rotate-6'
    },
    {
      id: 2,
      title: 'CLASSIC EVERYDAY SHADES',
      bg: 'bg-white',
      image: '/hero-bg.png',
      tilt: '-rotate-6'
    },
    {
      id: 3,
      title: 'CLASSIC EVERYDAY SHADES',
      bg: 'bg-[#ffcc00]',
      image: '/prod-1.png',
      tilt: 'rotate-3'
    }
  ];

  return (
    <section className="w-full bg-white px-12 md:px-32 lg:px-48 py-24">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <h2 className="text-5xl md:text-7xl font-bold text-black uppercase tracking-tighter leading-none">
            READY TO<br />
            <span className="text-gray-400">FIND YOUR</span><br />
            PERFECT PAIR?
          </h2>
          
          <div className="mt-8 md:mt-0 flex items-center gap-6">
            <div className="w-24 h-24 overflow-hidden rounded-sm">
              <img src="/hero-bg.png" alt="Perfect pair detail" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-400 font-medium tracking-tight max-w-[200px]">
              // Shop our latest<br />collection and see<br />the difference.
            </p>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gray-100 mb-12"></div>

        {/* Rows */}
        <div className="flex flex-col gap-8">
          {items.map((item) => (
            <div key={item.id} className={`${item.bg} p-8 md:p-12 flex flex-col md:flex-row justify-between items-center group cursor-pointer transition-all duration-500`}>
              <div className="flex-1 max-w-2xl">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-6">{item.title}</h3>
                <p className="text-sm font-bold text-black/60 uppercase leading-relaxed tracking-wider">
                  // From aviators to wayfarers, discover frames that never go out of style. Designed with lightweight materials and UV protection, these sunglasses keep you comfortable and stylish all day, every day.
                </p>
              </div>
              
              <div className="mt-8 md:mt-0 flex justify-center items-center">
                <div className={`w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-sm transition-transform duration-500 group-hover:scale-110 ${item.tilt}`}>
                  <img src={item.image} alt="Collection detail" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerfectPair;
