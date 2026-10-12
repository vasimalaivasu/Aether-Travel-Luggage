/**
 * AETHER VOYAGE — Global Bagagerie & Luxury Luggage Database
 * Curated Collections featuring 100% Authentic Luggage, Carry-On, Trunk, Backpack & Duffle Photography
 */

const AETHER_DATA = {
  "brands": [
    {
      "id": "brand-aether",
      "name": "Aether Atelier",
      "category": "aviation-tech",
      "origin": "Zurich, Switzerland (Est. 1928)",
      "tagline": "Aviation Aluminum & Master Watchmaker Tolerances",
      "description": "Pioneers in monocoque rivetless aluminum alloy luggage. Each case is laser-calibrated with whisper-silent Japanese ball-bearing spinner wheels.",
      "badge": "Swiss Precision Grade",
      "sustainability": "100% Recyclable Aeronautical Alloys & Zero-Waste Assembly",
      "image": "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "AeroShield™ Monocoque",
        "GlideBearing 360°",
        "Biometric TSA Lock"
      ]
    },
    {
      "id": "brand-goyard",
      "name": "Goyard",
      "category": "haute-couture",
      "origin": "Paris, France (Est. 1853)",
      "tagline": "The World's Most Discreet & Exclusive Trunkmaker",
      "description": "Handcrafted trunkmaking rooted in 233 Rue Saint-Honoré. Celebrated for iconic hand-painted Goyardine chevron canvas, natural beechwood slats, and bespoke royal crest commissions.",
      "badge": "Heritage Trunkmaker",
      "sustainability": "Natural Hemp, Linen & Vegetable-Dressed Leather Trims",
      "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "Goyardine Chevron Canvas",
        "Beechwood Clavetage",
        "Brass Trunk Corner Bracing"
      ]
    },
    {
      "id": "brand-louis-vuitton",
      "name": "Louis Vuitton",
      "category": "haute-couture",
      "origin": "Paris, France (Est. 1854)",
      "tagline": "The Legendary Pioneer of Modern Luxury Travel",
      "description": "Inventor of the flat-top waterproof canvas steamer trunk and the patented unpickable Tumbler Lock. Built with centuries of French malletier mastery and iconic monogram canvas.",
      "badge": "French Malletier Legend",
      "sustainability": "LVMH Life 360 Environmental Craftsmanship Protocol",
      "image": "https://images.unsplash.com/photo-1563903530908-afdd155d057a?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "Patented Tumbler Lock",
        "Damier & Monogram Canvas",
        "Asnières-sur-Seine Hand Joinery"
      ]
    },
    {
      "id": "brand-globe-trotter",
      "name": "Globe-Trotter",
      "category": "haute-couture",
      "origin": "London & Hertfordshire, UK (Est. 1897)",
      "tagline": "Handcrafted Vulcanized Fibreboard & British Royal Heritage",
      "description": "Purveyors to HM Queen Elizabeth II, Sir Winston Churchill, and the official luggage partner of James Bond 007. Handcrafted on Victorian machinery with patented vulcanized fibreboard.",
      "badge": "Royal Warrant of Appointment",
      "sustainability": "100% Organic Cotton & Wood Pulp Vulcanized Fibreboard",
      "image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "Vulcanized Fibreboard™",
        "Molded Leather Corner Shrouds",
        "Victorian Riveting Method"
      ]
    },
    {
      "id": "brand-rimowa",
      "name": "Rimowa",
      "category": "aviation-tech",
      "origin": "Cologne, Germany (Est. 1898)",
      "tagline": "Distinctive Parallel Grooves of Aviation Legend",
      "description": "The German pioneer of corrugated grooved aluminum and high-durability polycarbonate travel luggage built for discerning globetrotters and transatlantic aviators.",
      "badge": "German Precision",
      "sustainability": "Lifetime Functional Repair Guarantee",
      "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "Groove Aluminum Shell",
        "Multiwheel® System",
        "Flex Divider™"
      ]
    },
    {
      "id": "brand-fpm-milano",
      "name": "FPM Milano",
      "category": "aviation-tech",
      "origin": "Milan, Italy (Est. 1946)",
      "tagline": "Italian Fine Luggage & Industrial Travel Trunks",
      "description": "Fabbrica Pelletterie Milano collaborates with legendary designer Marc Sadler to forge the Bank Collection—featuring solid aluminum shells, handcrafted Italian leather handles, and maxi butterfly locks.",
      "badge": "Italian Craftsmanship",
      "sustainability": "Fully Disassemblable Aerospace Grade Aluminum",
      "image": "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "Maxi Butterfly Locks",
        "Bank Ribbed Anodized Armor",
        "Hand-Stitched Cuoio Handles"
      ]
    },
    {
      "id": "brand-montblanc",
      "name": "Montblanc",
      "category": "contemporary",
      "origin": "Hamburg & Florence (Est. 1906)",
      "tagline": "High-Performance #MY4810 & Florentine Leather Trims",
      "description": "Where German precision engineering meets Italian leather crafting. High-performance polycarbonate shells lined with jacquard motifs and whisper-quiet Japanese ball-bearing spinner wheels.",
      "badge": "Alpine Luxury Benchmark",
      "sustainability": "Pelleterie Leather Sourced from Certified Italian Tanneries",
      "image": "https://images.unsplash.com/photo-1631080801009-5b4741cf3f12?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "#MY4810 Polycarbonate",
        "Florentine Leather Trim Inserts",
        "360° Ball-Bearing Wheels"
      ]
    },
    {
      "id": "brand-tumi",
      "name": "Tumi",
      "category": "aviation-tech",
      "origin": "New Jersey, USA (Est. 1975)",
      "tagline": "Ultra-Durable FXT Ballistic Nylon & Fluid Contour Aluminum",
      "description": "The gold standard for international business executives, featuring fluid 19 Degree contouring, aircraft-grade aluminum telescoping handles, and Omega closure systems.",
      "badge": "Executive First-Class",
      "sustainability": "Tumi Tracer® Product Recovery Program",
      "image": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "FXT™ Ballistic Nylon",
        "Omega Closure System®",
        "19 Degree Fluid Contour™"
      ]
    },
    {
      "id": "brand-carl-friedrik",
      "name": "Carl Friedrik",
      "category": "artisanal-leather",
      "origin": "London & Florence (Est. 2012)",
      "tagline": "Hand-Burnished Tuscan Vachetta Leather",
      "description": "Bespoke leather weekender bags and briefcases handcrafted by master artisans in Tuscany using vegetable-tanned Italian hides.",
      "badge": "Artisanal Italian Leather",
      "sustainability": "100% Natural Vegetable Tanning (Chrome-Free)",
      "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "Vachetta Artisan Edge",
        "Raccagni Symphony Zips",
        "Modular Trolley Sleeve"
      ]
    },
    {
      "id": "brand-samsonite",
      "name": "Samsonite",
      "category": "contemporary",
      "origin": "Denver, USA (Est. 1910)",
      "tagline": "The Benchmark of World Travel Engineering",
      "description": "Creators of the world's lightest and strongest self-reinforced Curv® composite suitcases and multi-stage Roxkin™ polymers.",
      "badge": "Centennial Heritage",
      "sustainability": "Recyclex™ Material Technology Initiative",
      "image": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "Curv® Woven Composite",
        "Roxkin™ Polypropylene",
        "Aero-Trac™ Suspension"
      ]
    },
    {
      "id": "brand-briggs-riley",
      "name": "Briggs & Riley",
      "category": "contemporary",
      "origin": "New York, USA (Est. 1993)",
      "tagline": "Patented CX™ Compression-Expansion & Unconditional Warranty",
      "description": "Engineered for maximum packing efficiency. Famous for patented CX™ one-touch compression systems, outsider handle design for wrinkle-free flat packing, and legendary lifetime repair guarantee.",
      "badge": "Executive Favorite",
      "sustainability": "Guaranteed for Life Unconditional Repair Program",
      "image": "https://images.unsplash.com/photo-1506169894395-36397e4aaee4?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "CX™ Compression-Expansion",
        "Outsider® Handle System",
        "SpeedThru™ Pocket"
      ]
    },
    {
      "id": "brand-american-tourister",
      "name": "American Tourister",
      "category": "contemporary",
      "origin": "Providence, USA (Est. 1933)",
      "tagline": "Vibrant Circular Grooves & Unstoppable Durability",
      "description": "Global travel favorites famous for their iconic grooved concentric circular designs, shock-resistant polypropylene shells, and lightweight adventure engineering.",
      "badge": "Global Icon",
      "sustainability": "Eco-Conscious Recyclex™ Interior Fabrics",
      "image": "https://images.unsplash.com/photo-1581553680196-857cb3e0bc98?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "Curio Ridgeform™",
        "PlentiVol™ Packing",
        "ShockGrip™ Polypropylene"
      ]
    },
    {
      "id": "brand-skybags",
      "name": "Skybags",
      "category": "contemporary",
      "origin": "Mumbai, India (Est. 2011)",
      "tagline": "Dynamic Youthful Energy & High-Velocity Commuter Gear",
      "description": "Renowned for bold geometric textures, weather-shielded hard-shell trunks, and agile ergonomic commuter backpacks engineered for modern urban explorers.",
      "badge": "Urban Explorer Choice",
      "sustainability": "Water-Repellent EcoShield™ Coating",
      "image": "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80",
      "patents": [
        "GeoArmor™ Texture",
        "AirMesh™ Backing",
        "ArmorGlide™ Dual Wheels"
      ]
    }
  ],
  "products": [
    {
      "id": "prod-aether-horizon",
      "name": "Aether Horizon Aluminum Cabin Spinner",
      "tagline": "Aviation-Grade Anodized Monocoque Shell with Dual TSA Locks",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "Aether Atelier",
      "price": 680,
      "originalPrice": 750,
      "rating": 4.9,
      "reviewsCount": 154,
      "badge": "Bestseller",
      "featured": true,
      "inStock": true,
      "baseImage": "assets/images/aether_horizon_silver.jpg",
      "images": [
        "assets/images/aether_horizon_silver.jpg",
        "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "55 x 40 x 20 cm (21.6 x 15.7 x 7.8 in)",
      "weight": "4.1 kg (9.0 lbs)",
      "volume": "35 Liters",
      "material": "100% High-Grade Anodized Aeronautical Aluminum Alloy with Japanese Hinomoto 360° Ball-Bearing Wheels",
      "description": "Engineered for high-frequency transatlantic travelers. Featuring a rivetless monocoque aluminum chassis, twin biometric-compatible TSA combination latch locks, and an ultra-plush antimicrobial compression interior system.",
      "airlineCompliant": [
        "Emirates",
        "Delta",
        "British Airways",
        "Air France",
        "Lufthansa",
        "Singapore Airlines",
        "United"
      ],
      "specs": [
        "Lifetime Unconditional Repair Warranty",
        "Dual TSA-Integrated Latch Locks (No Zippers)",
        "Whisper-Quiet 360° Ball-Bearing Japanese Spinner Wheels",
        "Removable Luxury Suiter & Compression Divider",
        "Integrated Hidden Airtag / GPS Tracking Pocket"
      ]
    },
    {
      "id": "prod-at-curio",
      "name": "American Tourister Curio 360° Spinner",
      "tagline": "Iconic Concentric Ripple Shell with PlentiVol™ Expansion",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "American Tourister",
      "price": 180,
      "originalPrice": 220,
      "rating": 4.8,
      "reviewsCount": 310,
      "badge": "Popular Pick",
      "featured": true,
      "inStock": true,
      "baseImage": "assets/images/at_curio_yellow.jpg",
      "images": [
        "assets/images/at_curio_yellow.jpg",
        "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "55 x 36 x 24 cm (21.7 x 14.2 x 9.4 in)",
      "weight": "2.6 kg (5.7 lbs)",
      "volume": "37L (Expands to 43L)",
      "material": "High-Impact Shock-Absorbing Polypropylene (PP) with Double Steer Wheels",
      "description": "Inspired by vinyl records, the American Tourister Curio is an international sensation. Its concentric ridged design absorbs airport handling shocks while offering expandable capacity for spontaneous souvenir shopping.",
      "airlineCompliant": [
        "Emirates",
        "Ryanair",
        "EasyJet",
        "IndiGo",
        "Qatar Airways",
        "American Airlines"
      ],
      "specs": [
        "PlentiVol™ 40/60 Split Packing Ratio",
        "Puncture-Resistant Double Coil Zippers",
        "Integrated Recessed 3-Dial TSA Combination Lock",
        "Shock-Dampening 360° Dual Spinner Wheels",
        "Duosaf™ Security Zipper"
      ]
    },
    {
      "id": "prod-skybags-rubik",
      "name": "Skybags Rubik Geometric Check-In Trunk",
      "tagline": "Faceted Diamond-Texture Polycarbonate with ArmorGlide Wheels",
      "category": "suitcases",
      "subCategory": "check-in",
      "brand": "Skybags",
      "price": 145,
      "originalPrice": 190,
      "rating": 4.7,
      "reviewsCount": 228,
      "badge": "Trending",
      "featured": true,
      "inStock": true,
      "baseImage": "assets/images/skybags_rubik_emerald.jpg",
      "images": [
        "assets/images/skybags_rubik_emerald.jpg",
        "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "68 x 46 x 29 cm (26.7 x 18.1 x 11.4 in)",
      "weight": "3.4 kg (7.5 lbs)",
      "volume": "68 Liters",
      "material": "Scratch-Resistant Micro-Diamond Polycarbonate Polymer",
      "description": "Designed for travelers who want bold aesthetic distinction on airport conveyor belts. Features high-velocity 360° spinner wheels, scratch-masking geometric facets, and water-repellent zippers.",
      "airlineCompliant": [
        "All International Check-In Baggage Limits (62 linear inches)"
      ],
      "specs": [
        "Anti-Scratch Micro-Facet Diamond Texture",
        "Push-Button Multi-Stage Aluminum Telescoping Arm",
        "Combination Number Lock with TSA Override",
        "Internal Wet-Pack Toiletry Pocket & Cross Ribbons",
        "ArmorGlide™ Smooth Dual Wheel System"
      ]
    },
    {
      "id": "prod-samsonite-clite",
      "name": "Samsonite C-Lite Curv® Ultralight Spinner",
      "tagline": "Patented Woven Curv® Composite Engineered in Belgium",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "Samsonite",
      "price": 540,
      "originalPrice": 620,
      "rating": 4.9,
      "reviewsCount": 189,
      "badge": "Ultralight",
      "featured": true,
      "inStock": true,
      "baseImage": "assets/images/samsonite_clite_curv.png",
      "images": [
        "assets/images/samsonite_clite_curv.png",
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "55 x 40 x 20 cm (21.6 x 15.7 x 7.8 in)",
      "weight": "1.9 kg (4.2 lbs) — World's Lightest Class",
      "volume": "36 Liters",
      "material": "Woven Polypropylene Curv® Composite Technology",
      "description": "Made in Europe, the Samsonite C-Lite combines extreme lightness with astounding shock resilience. The self-reinforcing organic wave silhouette dissipates harsh impacts effortlessly.",
      "airlineCompliant": [
        "Air France",
        "KLM",
        "British Airways",
        "Lufthansa",
        "Singapore Airlines",
        "Emirates"
      ],
      "specs": [
        "Featherlight 1.9 kg Construction",
        "Integrated USB Port for Device Charging Mid-Flight",
        "Elongated Double Tube Pull Handle for Backpack Stacking",
        "Eco-Friendly Recyclex™ Interior Lining Fabric",
        "10-Year Global Commercial Warranty"
      ]
    },
    {
      "id": "prod-rimowa-classic",
      "name": "Rimowa Classic Aluminum Cabin",
      "tagline": "Hand-Riveted Anodized Aluminum with Leather Handles",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "Rimowa",
      "price": 1350,
      "originalPrice": 1450,
      "rating": 5,
      "reviewsCount": 94,
      "badge": "Luxury Icon",
      "featured": true,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "55 x 40 x 23 cm (21.7 x 15.8 x 9.1 in)",
      "weight": "4.3 kg (9.5 lbs)",
      "volume": "36 Liters",
      "material": "High-End Anodized Aluminum with Hand-Stitched Leather Handles",
      "description": "Designed for the connoisseur of classic luxury. Features hand-riveted aluminum high-gloss corners, artisanal leather grab handles, and the legendary Multiwheel® ball-bearing suspension.",
      "airlineCompliant": [
        "All Major International First & Business Class Cabins"
      ],
      "specs": [
        "Handcrafted Leather Grab Handles (Black / Tan)",
        "TSA-Approved Dual Combination Lever Locks",
        "Height-Adjustable Flex Divider Compression System",
        "Multiwheel® Ball-Bearing System with Cushioned Axles",
        "Lifetime Functional Guarantee"
      ]
    },
    {
      "id": "prod-tumi-19deg",
      "name": "Tumi 19 Degree Aluminum International Carry-On",
      "tagline": "Fluid Sculpted Contours with Aircraft-Grade Handle System",
      "category": "accessories",
      "subCategory": "carry-on",
      "brand": "Tumi",
      "price": 1195,
      "originalPrice": 1295,
      "rating": 4.9,
      "reviewsCount": 112,
      "badge": "Executive First-Class",
      "featured": true,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1587317996270-908c352f1b09?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "56 x 35.5 x 23 cm (22 x 14 x 9 in)",
      "weight": "5.0 kg (11.0 lbs)",
      "volume": "33 Liters",
      "material": "Aircraft-Grade Sculpted Aluminum with Protective Corner Bumpers",
      "description": "A testament to fluid industrial engineering. Its distinctive sculpted ridges capture light with metallic vibrancy, paired with Tumi Tracer® recovery protection.",
      "airlineCompliant": [
        "Delta",
        "United",
        "American Airlines",
        "Emirates",
        "Cathay Pacific"
      ],
      "specs": [
        "Patented X-Brace 45® Telescoping Handle",
        "Dual Integrated Push-Button TSA Lock Closures",
        "Dual-Spinning Recessed Hinomoto Wheels",
        "Tumi Tracer® Global Anti-Theft Barcode",
        "Complimentary Monogram Patch Personalization"
      ]
    },
    {
      "id": "prod-cf-weekender",
      "name": "Carl Friedrik Handcrafted Tuscan Weekender",
      "tagline": "Vegetable-Tanned Italian Vachetta Leather Travel Duffle",
      "category": "duffles",
      "subCategory": "weekender",
      "brand": "Carl Friedrik",
      "price": 795,
      "originalPrice": 875,
      "rating": 4.9,
      "reviewsCount": 78,
      "badge": "Artisanal Choice",
      "featured": true,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "49 x 31 x 25 cm (19.3 x 12.2 x 9.8 in)",
      "weight": "2.1 kg (4.6 lbs)",
      "volume": "38 Liters",
      "material": "Full-Grain Italian Vachetta Leather from Santa Croce sull'Arno, Tuscany",
      "description": "Handcrafted by multi-generational leather artisans in Florence. Features hand-painted burnished edges, symmetrical Raccagni silver-finish zippers, and a modular luggage pass-through sleeve.",
      "airlineCompliant": [
        "Universal International Carry-On & Under-Seat Compliant"
      ],
      "specs": [
        "Heavy-Duty Solid Nickel Hardware from Milan",
        "Padded Interior 15-inch Laptop Compartment",
        "Removable Ergonomic Leather Shoulder Strap",
        "Reinforced Base with Metal Protective Studs",
        "100-Year Repair Warranty on Stitching & Zippers"
      ]
    },
    {
      "id": "prod-skybags-brat",
      "name": "Skybags Brat Ergonomic City Backpack",
      "tagline": "Weather-Shielded Ripstop with AirMesh Ergonomic Spine Suspension",
      "category": "backpacks",
      "subCategory": "commuter",
      "brand": "Skybags",
      "price": 65,
      "originalPrice": 85,
      "rating": 4.6,
      "reviewsCount": 440,
      "badge": "Value Choice",
      "featured": false,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "47 x 32 x 18 cm (18.5 x 12.6 x 7.1 in)",
      "weight": "0.75 kg (1.6 lbs)",
      "volume": "27 Liters",
      "material": "High-Density EcoShield™ Water-Resistant Ripstop Polyester",
      "description": "The definitive urban commuter backpack. Engineered with contoured shoulder straps, dedicated quick-access device compartments, and rain-tested fabric to protect electronics in unexpected downpours.",
      "airlineCompliant": [
        "All International Under-Seat Personal Item Requirements"
      ],
      "specs": [
        "Padded Compartment for up to 16-inch Laptops",
        "Breathable AirMesh Spinal Cushion Backing",
        "Concealed Passport & Wallet Anti-Pickpocket Pocket",
        "Dual Elastic Water Bottle / Umbrella Side Sleeves",
        "Reinforced Bartack Stitching at High-Stress Points"
      ]
    },
    {
      "id": "prod-at-frontec",
      "name": "American Tourister Frontec Quick-Access Spinner",
      "tagline": "Vertical Top-Opening Front Lid with USB Port & PlentiVol",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "American Tourister",
      "price": 195,
      "originalPrice": 240,
      "rating": 4.8,
      "reviewsCount": 165,
      "badge": "Smart Tech",
      "featured": false,
      "inStock": true,
      "baseImage": "assets/images/at_frontec_spinner.jpg",
      "images": [
        "assets/images/at_frontec_spinner.jpg",
        "https://images.unsplash.com/photo-1581553680196-857cb3e0bc98?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "54 x 36 x 25 cm (21.2 x 14.1 x 9.8 in)",
      "weight": "3.1 kg (6.8 lbs)",
      "volume": "38L (Expands to 43L)",
      "material": "100% Impact-Resistant Polycarbonate Shell with Optimov™ Shock Dampening Wheels",
      "description": "Revolutionary front-opening lid lets travelers pull out laptops and security liquids without unzipping the full suitcase on dirty airport floors. Includes integrated battery bank pocket and USB-C port.",
      "airlineCompliant": [
        "Air France",
        "Delta",
        "British Airways",
        "KLM",
        "IndiGo",
        "Qantas"
      ],
      "specs": [
        "Book-Opening Front Access Laptop Compartment",
        "Optimov™ Shock-Absorbing Spinner Suspension",
        "Duosaf™ Anti-Theft Double Coil Zipper",
        "Integrated TSA 008 Combination Lock",
        "Antimicrobial Treated Interior Lining"
      ]
    },
    {
      "id": "prod-tumi-alpha3",
      "name": "Tumi Alpha 3 Continental 4-Wheel Carry-On",
      "tagline": "FXT® Ultra-Durable Ballistic Nylon with Lever Lock Expansion",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "Tumi",
      "price": 895,
      "originalPrice": 995,
      "rating": 4.9,
      "reviewsCount": 204,
      "badge": "Executive Standard",
      "featured": false,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "56 x 40.5 x 23 cm (22 x 16 x 9 in)",
      "weight": "5.1 kg (11.3 lbs)",
      "volume": "42 Liters",
      "material": "Patented FXT® Ballistic Nylon with Molded Impact-Resistant Side Panels",
      "description": "The business world's most trusted carry-on case. Made with virtually indestructible FXT® ballistic nylon, lever lock two-stage expansion, and a built-in garment suiter sleeve for tailored suits.",
      "airlineCompliant": [
        "Delta",
        "United",
        "American Airlines",
        "British Airways",
        "Lufthansa"
      ],
      "specs": [
        "Patented Lever Lock™ 2-Stage Expansion System",
        "Removable Suiter Section with Hanger Bracket",
        "Built-in USB Power Port with Protective Sliding Cover",
        "Aircraft-Grade 3-Stage Telescoping Handle",
        "Tumi Tracer® Product Identification System"
      ]
    },
    {
      "id": "prod-skybags-cardiff",
      "name": "Skybags Cardiff Weekend Holdall Duffle",
      "tagline": "Waterproof Coated Canvas with Shoe Garage & Shoulder Strap",
      "category": "duffles",
      "subCategory": "weekender",
      "brand": "Skybags",
      "price": 55,
      "originalPrice": 75,
      "rating": 4.7,
      "reviewsCount": 198,
      "badge": "Sport & Leisure",
      "featured": false,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1473445730015-841f29a9490b?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "52 x 28 x 26 cm (20.5 x 11.0 x 10.2 in)",
      "weight": "0.85 kg (1.9 lbs)",
      "volume": "38 Liters",
      "material": "Matte PU-Coated 600D Poly Canvas with Waterproof Bottom Panel",
      "description": "A versatile gym-to-getaway holdall. Features a ventilated side shoe garage, moisture-sealed toiletry compartment, and high-tensile seatbelt webbing handles for effortless grab-and-go portability.",
      "airlineCompliant": [
        "All International Cabin & Overhead Locker Sizes"
      ],
      "specs": [
        "Ventilated Shoe Garage with Odor-Barrier Lining",
        "Heavy-Duty Water-Repellent Outer Coating",
        "Detachable Padded Ergonomic Shoulder Strap",
        "Quick-Stash Outer Passport & Phone Sleeve",
        "Reinforced Dual Carrying Handles with Padded Grip"
      ]
    },
    {
      "id": "prod-aether-portfolio",
      "name": "Aether Grand Voyage Passport & Tech Portfolio",
      "tagline": "Italian Saddle Leather with RFID-Shielded Passport Vault",
      "category": "accessories",
      "subCategory": "organizer",
      "brand": "Aether Atelier",
      "price": 240,
      "originalPrice": 280,
      "rating": 5,
      "reviewsCount": 88,
      "badge": "Artisanal",
      "featured": false,
      "inStock": true,
      "baseImage": "assets/images/aether_portfolio_leather.svg",
      "images": [
        "assets/images/aether_portfolio_leather.svg",
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "24 x 16 x 3 cm (9.4 x 6.3 x 1.2 in)",
      "weight": "0.38 kg (0.8 lbs)",
      "volume": "1.2 Liters",
      "material": "Full-Grain Italian Tuscan Saddle Leather with Soft Alcantara Suede Lining",
      "description": "Crafted for the modern globetrotter who values order and tactile elegance. Houses four passports, eight boarding passes, international SIM cards, Apple AirTag, and an iPad Mini in RFID-shielded luxury.",
      "airlineCompliant": [
        "In-Flight Personal Hand-Held Accessory"
      ],
      "specs": [
        "Military-Grade RFID Blocking Metallic Interlining",
        "Dedicated iPad Mini & Kindle Velvet Pouch",
        "AirTag Concealed Vault Pocket",
        "Solid Brass Laser-Engraved Aether Puller",
        "Hand-Burnished Waxed Edges"
      ]
    },
    {
      "id": "prod-gt-centenary",
      "name": "Globe-Trotter Centenary 20\" Carry-On Case",
      "tagline": "Handcrafted Vulcanized Fibreboard with British Leather Corners",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "Globe-Trotter",
      "price": 2195,
      "originalPrice": 2350,
      "rating": 5,
      "reviewsCount": 62,
      "badge": "Royal Warrant",
      "featured": true,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "55 x 42 x 18 cm (21.7 x 16.5 x 7.1 in)",
      "weight": "4.2 kg (9.2 lbs)",
      "volume": "34 Liters",
      "material": "Patented Vulcanized Fibreboard with Vegetable-Tanned English Bridle Leather Corners",
      "description": "Purveyors of bespoke luggage to royalty, explorers, and icons since 1897. Hand-shaped on Victorian machinery in Hertfordshire, England. Fourteen layers of organic wood pulp bonded together for extreme strength.",
      "airlineCompliant": [
        "British Airways",
        "Emirates",
        "Singapore Airlines",
        "Virgin Atlantic",
        "Cathay Pacific"
      ],
      "specs": [
        "Hand-Formed English Bridle Leather Corner Bracing",
        "Solid Brass Dual Clasp Locks with Key Lock Mechanism",
        "Extendable Telescopic Wooden-Accent Pull Handle",
        "Silent In-Line Double Gliding Wheels",
        "Royal Warrant of Appointment Embossed Crest"
      ]
    },
    {
      "id": "prod-goyard-grand-hotel",
      "name": "Goyard Grand Hôtel MM Steamer Trunk Trolley",
      "tagline": "Hand-Painted Goyardine Canvas with Natural Beechwood Slats",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "Goyard",
      "price": 4850,
      "originalPrice": 5200,
      "rating": 5,
      "reviewsCount": 37,
      "badge": "Classic Heritage",
      "featured": true,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "55 x 39 x 21 cm (21.6 x 15.3 x 8.2 in)",
      "weight": "4.6 kg (10.1 lbs)",
      "volume": "37 Liters",
      "material": "Goyardine Waterproof Hemp & Linen Canvas with Cervon Calfskin Trims and Solid Brass Clavetage",
      "description": "Rooted in 1853 Paris at 233 Rue Saint-Honoré. Featuring the legendary chevron pattern dot-painted by hand, reinforced with kiln-dried French beechwood slats and stamped brass hardware.",
      "airlineCompliant": [
        "Air France La Première",
        "Emirates First Class",
        "Etihad The Residence",
        "Singapore Suites"
      ],
      "specs": [
        "Hand-Applied Goyardine Waterproof Chevron Weave",
        "Kiln-Dried French Beechwood Longitudinal Battens",
        "Hand-Stitched Cervon Leather Grab Handles",
        "Solid Brass Clavetage Trunk Corner Reinforcements",
        "Numbered Certificate of Authenticity from Paris Workshop"
      ]
    },
    {
      "id": "prod-lv-horizon55",
      "name": "Louis Vuitton Horizon 55 Monogram 4-Wheel Spinner",
      "tagline": "Designed by Marc Newson — Wide External Cane Handle System",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "Louis Vuitton",
      "price": 3400,
      "originalPrice": 3650,
      "rating": 5,
      "reviewsCount": 142,
      "badge": "Iconic Design",
      "featured": true,
      "inStock": true,
      "baseImage": "assets/images/lv_horizon_monogram.png",
      "images": [
        "assets/images/lv_horizon_monogram.png",
        "https://images.unsplash.com/photo-1563903530908-afdd155d057a?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "55 x 38 x 21 cm (21.7 x 15.0 x 8.3 in)",
      "weight": "3.2 kg (7.0 lbs)",
      "volume": "37 Liters",
      "material": "Monogram Coated Canvas with Cowhide Leather Trims and Ultra-Light Aluminium Hardware",
      "description": "Imagined by industrial design visionary Marc Newson. Moving the telescoping handle to the outside creates a completely flat interior packing bed, maximizing volume and preventing wrinkled garments.",
      "airlineCompliant": [
        "Air France",
        "Delta",
        "British Airways",
        "Lufthansa",
        "Emirates",
        "Swiss"
      ],
      "specs": [
        "Wide External Aluminium Pull-Handle for 100% Flat Interior",
        "Ultra-Lightweight Mesh Compression Divider Pads",
        "Compact 3-Digit TSA Combination Padlock Mechanism",
        "Whisper-Quiet Multiwheel Suspension System",
        "Removable Leather Name Tag with Hot-Stamped Monogramming"
      ]
    },
    {
      "id": "prod-fpm-bank53",
      "name": "FPM Milano Bank Spinner 53 Aluminum Trunk",
      "tagline": "Designed by Marc Sadler — Maxi Butterfly Latches & Cuoio Leather",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "FPM Milano",
      "price": 1650,
      "originalPrice": 1800,
      "rating": 4.9,
      "reviewsCount": 71,
      "badge": "Italian Craftsmanship",
      "featured": true,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "53 x 36 x 21.5 cm (20.8 x 14.1 x 8.4 in)",
      "weight": "5.1 kg (11.2 lbs)",
      "volume": "36.6 Liters",
      "material": "100% Solid Virgin Aluminum (10 Micron Anodization) with Hand-Stitched Italian Cuoio Leather",
      "description": "Forged in Italy under the direction of Marc Sadler. Inspired by vintage bank deposit vaults, featuring solid maxi butterfly lock latches, riveted corner armor, and hand-stitched Tuscan saddle leather grips.",
      "airlineCompliant": [
        "Lufthansa",
        "Air France",
        "British Airways",
        "Emirates",
        "Swiss",
        "ITA Airways"
      ],
      "specs": [
        "Dual Solid Aluminum Maxi Butterfly Locks with TSA Override",
        "Non-Slip Hinomoto Japanese Double Ball-Bearing Wheels",
        "Hand-Stitched Italian Cuoio Full-Grain Leather Handles",
        "Quilted Removable Interior Lining with Elastic Luggage Belts",
        "Entirely Crafted and Hand-Assembled in Italy"
      ]
    },
    {
      "id": "prod-montblanc-my4810",
      "name": "Montblanc #MY4810 High-Performance Cabin Trolley",
      "tagline": "German Engineering with Florentine Leather Corner Inserts",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "Montblanc",
      "price": 980,
      "originalPrice": 1080,
      "rating": 4.8,
      "reviewsCount": 105,
      "badge": "Alpine Luxury",
      "featured": false,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1631080801009-5b4741cf3f12?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1631080801009-5b4741cf3f12?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "55 x 38 x 23 cm (21.6 x 15.0 x 9.0 in)",
      "weight": "3.7 kg (8.1 lbs)",
      "volume": "37 Liters",
      "material": "High-Performance Polycarbonate with Florentine Leather Details and Jacquard Lining",
      "description": "The official travel companion for the international executive. High-impact resistant polycarbonate shell adorned with Montblanc's iconic hexagonal snowcap emblem and black Florentine leather corner trims.",
      "airlineCompliant": [
        "Lufthansa",
        "Swiss",
        "Austrian Airlines",
        "Singapore Airlines",
        "Emirates"
      ],
      "specs": [
        "Montblanc Emblem Encrusted in Palladium-Coated Ring",
        "Japanese Hinomoto 360° Whisper Ball-Bearing Wheels",
        "Multi-Stop Precision German Telescoping Arm",
        "Integrated Hidden Business Card / Identification Holder",
        "Hexagonal Jacquard Pattern Interior Fabric"
      ]
    },
    {
      "id": "prod-briggs-baseline",
      "name": "Briggs & Riley Baseline CX Global Carry-On Spinner",
      "tagline": "Patented One-Touch CX™ Compression-Expansion System",
      "category": "suitcases",
      "subCategory": "carry-on",
      "brand": "Briggs & Riley",
      "price": 699,
      "originalPrice": 779,
      "rating": 4.9,
      "reviewsCount": 380,
      "badge": "Lifetime Repair",
      "featured": true,
      "inStock": true,
      "baseImage": "https://images.unsplash.com/photo-1506169894395-36397e4aaee4?auto=format&fit=crop&w=1000&q=80",
      "images": [
        "https://images.unsplash.com/photo-1506169894395-36397e4aaee4?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=80"
      ],
      "dimensions": "53.5 x 38 x 23 cm (21 x 15 x 9 in)",
      "weight": "4.5 kg (9.9 lbs)",
      "volume": "39L (Expands to 48L with CX™)",
      "material": "1680D Ballistic Nylon Fabric Resists Wear, Moisture, Dirt, and Abrasion",
      "description": "The gold standard for frequent flyers who value packing space. The patented CX™ system expands the case up to 25% for packing, then compresses it back to regulation cabin size with a single push.",
      "airlineCompliant": [
        "United",
        "Delta",
        "American Airlines",
        "British Airways",
        "Air Canada"
      ],
      "specs": [
        "Patented CX™ One-Touch Expansion-Compression System",
        "Outsider® Handle System Provides Wrinkle-Free Flat Packing",
        "Built-in Tri-Fold Garment Suiter with Foam Roll Bar",
        "SpeedThru™ Front Pocket for Instant Airport Security Access",
        "Guaranteed for Life Unconditional Functional Repair Warranty"
      ]
    }
  ],
  "warrantyData": {
    "heroTitle": "Lifetime Unconditional Warranty",
    "heroSubtitle": "Every journey is guarded by our century-long commitment to functional longevity, artisan restoration, and seamless global courier support.",
    "sampleClaim": {
      "claimNumber": "CLM-AV-89241",
      "customerName": "Alexander Vance",
      "productName": "Aether Horizon Aluminum Cabin Spinner",
      "serialNumber": "AETH-HOR-2026-90412",
      "status": "In Restoration",
      "progressPercent": 30,
      "dateSubmitted": "2026-09-01",
      "estimatedCompletion": "2026-09-09",
      "center": "Aether Soho Service Center (New York)",
      "steps": [
        {
          "title": "Claim Registered & Case Inspected",
          "date": "Sep 01, 2026",
          "status": "completed"
        },
        {
          "title": "Priority Courier Received at Workshop",
          "date": "Sep 03, 2026",
          "status": "current"
        },
        {
          "title": "Hand Stitching Restoration & Leather Hydration",
          "date": "Pending (Sep 05)",
          "status": "upcoming"
        },
        {
          "title": "Brass Hardware Buffing & Quality Check",
          "date": "Pending (Sep 08)",
          "status": "upcoming"
        },
        {
          "title": "Express Dispatched to Customer Doorstep",
          "date": "Pending (Sep 09)",
          "status": "upcoming"
        }
      ]
    }
  },
  "faqs": [
    {
      "q": "What does the Aether Lifetime Unconditional Warranty cover?",
      "a": "Our warranty covers functional damage sustained during your travels—including broken wheels, cracked shells, bent telescoping handles, damaged TSA locks, broken zippers, and torn handles across all authorized brands. If airline baggage handlers mishandle your luggage, we will repair it or replace it free of charge."
    },
    {
      "q": "How does the repair turnaround process work?",
      "a": "Once your claim is submitted online, we immediately generate a prepaid complimentary courier shipping label. You can either hand it to the courier at your doorstep or drop it off at any of our flagship service centers in Paris, New York, Tokyo, London, Dubai, Mumbai, or Singapore. Typical repair turnaround is 24 to 72 hours."
    },
    {
      "q": "Can I receive a loaner suitcase while mine is being repaired?",
      "a": "Yes. For our VIP Club members and international travelers mid-journey, our support team can deliver a complimentary loaner suitcase directly to your luxury hotel or residence in major global metropolitan hubs."
    },
    {
      "q": "Are scratches and natural cosmetic patina covered under warranty?",
      "a": "Natural surface scratches and organic darkening patina of leather are celebrated hallmarks of world travel. However, we offer complimentary professional ultrasonic polishing, cleaning, and leather reconditioning at any flagship boutique at any time."
    },
    {
      "q": "How do I verify airline cabin compliance for my carry-on?",
      "a": "Each piece in our collection is certified against international IATA carry-on standards (typically 55 x 40 x 20 cm). You can click 'Quick View' on any product to see the full list of verified airlines including Emirates, Delta, Singapore Airlines, British Airways, Air France, and Lufthansa."
    }
  ]
};

// Export to window/global for modular browser scripts and Node.js
if (typeof window !== 'undefined') {
  window.AETHER_DATA = AETHER_DATA;
  window.AETHER_PRODUCTS = AETHER_DATA.products;
}
if (typeof global !== 'undefined') {
  global.AETHER_DATA = AETHER_DATA;
  global.AETHER_PRODUCTS = AETHER_DATA.products;
}
