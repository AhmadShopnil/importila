const GenderCategories = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop By Category
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Find the perfect toys for your little ones
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <a 
            href="#boys" 
            className="group relative overflow-hidden rounded-3xl p-8 gradient-boy text-white hover:scale-[1.02] transition-all duration-300 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
             
              <h3 className="text-2xl font-bold mb-2">For Boys</h3>
              <p className="text-white/80 mb-6">Cars, Action Figures, Building Blocks & More</p>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 group-hover:bg-white/30 transition-colors">
                <span className="font-medium">Explore</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
           
          </a>
          
          <a 
            href="#girls" 
            className="group relative overflow-hidden rounded-3xl p-8 gradient-girl text-white hover:scale-[1.02] transition-all duration-300 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              
              <h3 className="text-2xl font-bold mb-2">For Girls</h3>
              <p className="text-white/80 mb-6">Dolls, Kitchen Sets, Art & Craft & More</p>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 group-hover:bg-white/30 transition-colors">
                <span className="font-medium">Explore</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 text-7xl opacity-30 group-hover:opacity-50 transition-opacity">
              🎀
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GenderCategories;