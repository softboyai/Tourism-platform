/**
 * Seed script to populate the database with sample tourism data
 * for Ogooué-Maritime Province, Gabon.
 * 
 * Run: node seed-data.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('./src/config/database');
const Site = require('./src/models/Site');
const Hotel = require('./src/models/Hotel');
const Event = require('./src/models/Event');
const Guide = require('./src/models/Guide');
const Admin = require('./src/models/Admin');

const sites = [
  {
    name: 'Pointe Denis Beach',
    category: 'beach',
    description: 'A stunning white-sand beach located across the estuary from Libreville. Known for crystal-clear waters and sea turtles nesting from November to March. Perfect for swimming, sunbathing, and water sports.',
    city: 'Port-Gentil',
    location: { lat: 0.3833, lng: 9.3167 },
    phone: '+241 01 76 23 45',
    email: 'info@pointedenis.ga',
    address: 'Pointe Denis, Estuaire Province'
  },
  {
    name: 'Lopé National Park',
    category: 'wildlife',
    description: 'UNESCO World Heritage Site combining tropical rainforest with relict savanna environments. Home to western lowland gorillas, forest elephants, mandrills, and over 400 bird species. An essential stop for wildlife enthusiasts.',
    city: 'Lopé',
    location: { lat: -0.5, lng: 11.5 },
    phone: '+241 01 44 12 78',
    email: 'reservations@lope-park.ga',
    address: 'Route Nationale 1, Lopé'
  },
  {
    name: 'Cap Lopez Lighthouse',
    category: 'monument',
    description: 'Historic lighthouse built during the colonial era at the westernmost point of Gabon. Offers panoramic ocean views and is a significant maritime heritage site. The area is also known for whale watching between July and September.',
    city: 'Port-Gentil',
    location: { lat: -0.6333, lng: 8.7167 },
    phone: '+241 01 55 89 01',
    email: 'caplopez@tourisme-ogooue.ga',
    address: 'Cap Lopez, Port-Gentil'
  },
  {
    name: 'Réserve de la Mondah',
    category: 'forest',
    description: 'A protected forest reserve north of Libreville with hiking trails through dense equatorial forest. Rich biodiversity including primates, tropical birds, and butterflies. Guided nature walks available.',
    city: 'Libreville',
    location: { lat: 0.5833, lng: 9.4333 },
    phone: '+241 01 73 56 90',
    email: 'mondah@eaux-forets.ga',
    address: 'Route du Cap Estérias, Libreville'
  },
  {
    name: 'Musée National des Arts et Traditions',
    category: 'museum',
    description: 'Gabon\'s national museum showcasing traditional masks, sculptures, musical instruments, and artifacts from the diverse ethnic groups of Gabon. Features rotating exhibitions on Gabonese culture and history.',
    city: 'Libreville',
    location: { lat: 0.3924, lng: 9.4536 },
    phone: '+241 01 72 15 67',
    email: 'musee.national@culture.ga',
    address: 'Boulevard Triomphal Omar Bongo, Libreville'
  },
  {
    name: 'Parc National de Mayumba',
    category: 'beach',
    description: 'One of the most important leatherback turtle nesting sites in the world. Between October and March, hundreds of turtles come ashore to lay their eggs. Also offers pristine beaches and whale watching.',
    city: 'Mayumba',
    location: { lat: -3.4333, lng: 10.65 },
    phone: '+241 01 88 34 21',
    email: 'mayumba@parcs-gabon.ga',
    address: 'Mayumba, Nyanga Province'
  },
  {
    name: 'Chutes de l\'Impératrice',
    category: 'waterfall',
    description: 'Spectacular waterfalls located in the interior of Gabon. Surrounded by lush tropical vegetation, these falls offer a refreshing natural swimming pool at the base. Popular for day trips and picnics.',
    city: 'Ndjolé',
    location: { lat: -0.1833, lng: 10.7667 },
    phone: '+241 01 66 78 43',
    email: 'chutes@tourisme-moyen-ogooue.ga',
    address: 'Route de Ndjolé, Moyen-Ogooué'
  },
  {
    name: 'Île Mandji',
    category: 'cultural',
    description: 'The island on which Port-Gentil is built. Rich in oil industry heritage and local Myene culture. Visit the artisanal fishing village, local markets, and enjoy the waterfront promenade at sunset.',
    city: 'Port-Gentil',
    location: { lat: -0.7193, lng: 8.7815 },
    phone: '+241 01 55 22 11',
    email: 'tourism@port-gentil.ga',
    address: 'Port-Gentil, Ogooué-Maritime'
  }
];

const hotels = [
  {
    name: 'Hôtel Mandji Palace',
    priceRange: 'luxury',
    phone: '+241 01 55 30 00',
    whatsapp: '+24101553000',
    address: 'Boulevard du Bord de Mer, Port-Gentil',
    city: 'Port-Gentil',
    location: { lat: -0.7200, lng: 8.7800 }
  },
  {
    name: 'Résidence Océane',
    priceRange: 'mid-range',
    phone: '+241 01 55 12 34',
    whatsapp: '+24101551234',
    address: 'Rue du Commerce, Port-Gentil',
    city: 'Port-Gentil',
    location: { lat: -0.7180, lng: 8.7830 }
  },
  {
    name: 'Hôtel Le Phare',
    priceRange: 'mid-range',
    phone: '+241 01 55 45 67',
    whatsapp: '+24101554567',
    address: 'Quartier du Phare, Port-Gentil',
    city: 'Port-Gentil',
    location: { lat: -0.7150, lng: 8.7750 }
  },
  {
    name: 'Auberge du Cap',
    priceRange: 'budget',
    phone: '+241 01 55 78 90',
    whatsapp: '+24101557890',
    address: 'Route du Cap Lopez, Port-Gentil',
    city: 'Port-Gentil',
    location: { lat: -0.6400, lng: 8.7200 }
  },
  {
    name: 'Hôtel Olako',
    priceRange: 'luxury',
    phone: '+241 01 76 10 00',
    whatsapp: '+24101761000',
    address: 'Boulevard de l\'Indépendance, Libreville',
    city: 'Libreville',
    location: { lat: 0.3901, lng: 9.4544 }
  },
  {
    name: 'Park Inn by Radisson',
    priceRange: 'luxury',
    phone: '+241 01 76 25 00',
    whatsapp: '+24101762500',
    address: 'Quartier Louis, Libreville',
    city: 'Libreville',
    location: { lat: 0.3950, lng: 9.4500 }
  },
  {
    name: 'Tropicana Lodge',
    priceRange: 'budget',
    phone: '+241 01 44 56 78',
    whatsapp: '+24101445678',
    address: 'Centre-ville, Omboué',
    city: 'Omboué',
    location: { lat: -1.5667, lng: 9.2500 }
  }
];

const events = [
  {
    title: 'Festival International de Port-Gentil',
    date: new Date('2026-08-15'),
    venue: 'Place de l\'Indépendance',
    description: 'Annual international cultural festival featuring music, dance, and art from across Central Africa. Live performances, food stalls, traditional crafts market, and a parade through the city center.',
    city: 'Port-Gentil',
    organizerName: 'Mairie de Port-Gentil',
    phone: '+241 01 55 00 01',
    email: 'festival@port-gentil.ga'
  },
  {
    title: 'Gabon Eco-Tourism Week',
    date: new Date('2026-09-20'),
    venue: 'Centre Culturel Français',
    description: 'A week-long celebration of Gabon\'s natural heritage. Workshops on sustainable tourism, guided nature excursions, photography exhibitions, and panel discussions with conservation experts.',
    city: 'Libreville',
    organizerName: 'Office National du Tourisme',
    phone: '+241 01 72 00 50',
    email: 'ecotourisme@tourisme.ga'
  },
  {
    title: 'Turtle Watching Season Opening',
    date: new Date('2026-11-01'),
    venue: 'Mayumba National Park',
    description: 'Official opening of the leatherback turtle nesting season. Guided nighttime beach walks to observe turtles laying eggs. Educational talks by marine biologists. Limited spots available.',
    city: 'Mayumba',
    organizerName: 'Agence Nationale des Parcs Nationaux',
    phone: '+241 01 88 34 21',
    email: 'turtles@parcs-gabon.ga'
  },
  {
    title: 'Marché des Artisans – Christmas Edition',
    date: new Date('2026-12-18'),
    venue: 'Marché Artisanal de Port-Gentil',
    description: 'Special holiday edition of the artisan market. Local craftsmen showcase carved masks, ebony sculptures, woven baskets, traditional jewelry, and more. Perfect for unique holiday gifts.',
    city: 'Port-Gentil',
    organizerName: 'Association des Artisans du Littoral',
    phone: '+241 06 23 45 67',
    email: 'artisans.littoral@gmail.com'
  },
  {
    title: 'Whale Watching Festival',
    date: new Date('2026-07-25'),
    venue: 'Cap Lopez Marina',
    description: 'Celebrate the arrival of humpback whales to Gabon\'s coast. Boat excursions, marine biology lectures, photography contests, and family activities. Whale sightings guaranteed in season!',
    city: 'Port-Gentil',
    organizerName: 'Ogooué Maritime Tourism Board',
    phone: '+241 01 55 88 99',
    email: 'whales@ogooue-tourisme.ga'
  },
  {
    title: 'Journée Nationale de la Culture',
    date: new Date('2026-10-10'),
    venue: 'Palais de la Culture',
    description: 'National Culture Day celebrations featuring traditional dances from all 9 provinces of Gabon. Bwiti ceremonies, Mvet storytelling, traditional cooking demonstrations, and cultural exhibitions.',
    city: 'Libreville',
    organizerName: 'Ministère de la Culture',
    phone: '+241 01 72 30 00',
    email: 'culture@gouv.ga'
  }
];

const guides = [
  {
    fullName: 'Jean-Baptiste Moussavou',
    languages: ['French', 'English', 'Myene'],
    fees: '50,000 XAF/day',
    phone: '+241 06 12 34 56',
    whatsapp: '+24106123456',
    areasCovered: ['Port-Gentil', 'Cap Lopez', 'Omboué'],
    city: 'Port-Gentil'
  },
  {
    fullName: 'Marie-Claire Ndong',
    languages: ['French', 'English', 'Spanish'],
    fees: '60,000 XAF/day',
    phone: '+241 06 78 90 12',
    whatsapp: '+24106789012',
    areasCovered: ['Libreville', 'Pointe Denis', 'Réserve de la Mondah'],
    city: 'Libreville'
  },
  {
    fullName: 'Pierre Ondo Nguema',
    languages: ['French', 'English', 'Fang'],
    fees: '75,000 XAF/day',
    phone: '+241 07 45 67 89',
    whatsapp: '+24107456789',
    areasCovered: ['Lopé National Park', 'Ndjolé', 'Lambaréné'],
    city: 'Lopé'
  },
  {
    fullName: 'Sylvie Bouanga',
    languages: ['French', 'English'],
    fees: '45,000 XAF/day',
    phone: '+241 06 34 56 78',
    whatsapp: '+24106345678',
    areasCovered: ['Port-Gentil', 'Île Mandji', 'Gamba'],
    city: 'Port-Gentil'
  },
  {
    fullName: 'Emmanuel Mba Obame',
    languages: ['French', 'German', 'Punu'],
    fees: '55,000 XAF/day',
    phone: '+241 07 11 22 33',
    whatsapp: '+24107112233',
    areasCovered: ['Mayumba', 'Tchibanga', 'Moukalaba-Doudou'],
    city: 'Mayumba'
  },
  {
    fullName: 'Aïcha Mbazogo',
    languages: ['French', 'English', 'Arabic'],
    fees: '65,000 XAF/day',
    phone: '+241 06 55 66 77',
    whatsapp: '+24106556677',
    areasCovered: ['Libreville', 'Cap Estérias', 'Kango'],
    city: 'Libreville'
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log('📦 Connected to database. Starting seed...\n');

    // Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tourism-gabon.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await Admin.create({ email: adminEmail, passwordHash });
      console.log(`✅ Admin created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`✅ Admin already exists: ${adminEmail}`);
    }

    // Seed Sites
    const existingSites = await Site.countDocuments();
    if (existingSites === 0) {
      await Site.insertMany(sites);
      console.log(`✅ ${sites.length} tourist sites seeded`);
    } else {
      console.log(`⏭️  Sites already exist (${existingSites} found), skipping`);
    }

    // Seed Hotels
    const existingHotels = await Hotel.countDocuments();
    if (existingHotels === 0) {
      await Hotel.insertMany(hotels);
      console.log(`✅ ${hotels.length} hotels seeded`);
    } else {
      console.log(`⏭️  Hotels already exist (${existingHotels} found), skipping`);
    }

    // Seed Events
    const existingEvents = await Event.countDocuments();
    if (existingEvents === 0) {
      await Event.insertMany(events);
      console.log(`✅ ${events.length} events seeded`);
    } else {
      console.log(`⏭️  Events already exist (${existingEvents} found), skipping`);
    }

    // Seed Guides
    const existingGuides = await Guide.countDocuments();
    if (existingGuides === 0) {
      await Guide.insertMany(guides);
      console.log(`✅ ${guides.length} guides seeded`);
    } else {
      console.log(`⏭️  Guides already exist (${existingGuides} found), skipping`);
    }

    console.log('\n🎉 Database seeding complete!');
    console.log('───────────────────────────────────────');
    console.log(`   Admin login: ${adminEmail} / ${adminPassword}`);
    console.log('   Start server: npm run dev');
    console.log('───────────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
