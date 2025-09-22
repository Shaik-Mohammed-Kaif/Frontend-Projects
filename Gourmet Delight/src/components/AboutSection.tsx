import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-slide-in-left">
            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-gold mb-6">
              Our Story
            </h2>

            <div className="space-y-6 text-muted-foreground font-inter leading-relaxed text-lg">
              <p>
                Founded in 2018, Gourmet Delight emerged from a simple vision: to create an
                extraordinary dining experience that celebrates the artistry of fine cuisine
                and the warmth of genuine hospitality.
              </p>

              <p>
                Our talented team of chefs, led by Executive Chef Maria Rodriguez, brings together
                culinary traditions from around the world, using locally sourced ingredients and
                innovative techniques to craft dishes that surprise and delight.
              </p>

              <p>
                Every element of our restaurant, from the carefully curated wine selection to
                the elegant atmosphere, is designed to create moments of pure culinary bliss
                that our guests will treasure forever.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-playfair font-bold text-gold mb-2">5+</div>
                <div className="text-muted-foreground font-inter">Years of Excellence</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-playfair font-bold text-gold mb-2">15k+</div>
                <div className="text-muted-foreground font-inter">Happy Guests</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="animate-slide-in-right">
            <div className="elegant-card">
              <h3 className="text-3xl font-playfair font-semibold text-cream mb-8">
                What Makes Us Special
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-charcoal font-bold">★</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-playfair font-semibold text-cream mb-2">
                      Farm-to-Table Philosophy
                    </h4>
                    <p className="text-muted-foreground font-inter">
                      We partner with local farms to ensure the freshest, highest-quality ingredients
                      in every dish we serve.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-charcoal font-bold">♥</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-playfair font-semibold text-cream mb-2">
                      Artisanal Craftsmanship
                    </h4>
                    <p className="text-muted-foreground font-inter">
                      Our chefs are true artists, creating visually stunning dishes that taste
                      as amazing as they look.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-charcoal font-bold">◆</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-playfair font-semibold text-cream mb-2">
                      Intimate Atmosphere
                    </h4>
                    <p className="text-muted-foreground font-inter">
                      Every detail of our space is designed to create a warm, inviting environment
                      perfect for memorable moments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;