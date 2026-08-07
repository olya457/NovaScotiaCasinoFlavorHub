import {ImageSourcePropType} from 'react-native';
import {dishArtwork, venueArtwork} from '../foundation/assets';

export type FlavorVenue = {
  id: string;
  title: string;
  schedule: string;
  summary: string;
  description: string;
  serviceType: 'FOOD' | 'DRINK' | 'LOUNGE';
  image: ImageSourcePropType;
  spotlight: string[];
};

export type MenuSection = 'Breakfast' | 'Small Plates' | 'Signature Plates' | 'Desserts' | 'Drinks';

export type FlavorItem = {
  id: string;
  title: string;
  section: MenuSection;
  price: number;
  prepMinutes: number;
  description: string;
  tags: string[];
  image: ImageSourcePropType;
};

export const flavorVenues: FlavorVenue[] = [
  {
    id: 'harbour-table',
    title: 'Harbour Table',
    schedule: '7:00 AM – 10:30 PM',
    summary: 'Coastal breakfast, seafood plates, and chef-led dinner features.',
    description: 'Harbour Table is the all-day dining room for guests who want polished food service without losing the energy of the casino floor. The menu shifts from breakfast classics to premium Atlantic dinner plates and desserts made for sharing.',
    serviceType: 'FOOD',
    image: venueArtwork.ocean,
    spotlight: ['Chef tasting boards', 'Atlantic seafood', 'Late dinner seating'],
  },
  {
    id: 'blue-note-bar',
    title: 'Blue Note Bar',
    schedule: '11:00 AM – 1:00 AM',
    summary: 'Signature cocktails, zero-proof flights, and lounge snacks.',
    description: 'Blue Note Bar brings the social side of Nova Scotia Casino Flavor Hub together with cocktail service, quick bites, dessert pairings, and a strong list of spirit-free drinks for guests staying on the move.',
    serviceType: 'DRINK',
    image: venueArtwork.lounge,
    spotlight: ['Cocktail flights', 'Mocktail program', 'Live lounge music'],
  },
  {
    id: 'quick-bite-counter',
    title: 'Quick Bite Counter',
    schedule: 'Open 24 Hours',
    summary: 'Fast sandwiches, coffee, pastries, and grab-and-go favorites.',
    description: 'Quick Bite Counter is designed for short breaks between entertainment, meetings, and gaming sessions. Guests can build a snack run, coffee stop, or dessert pickup without leaving the main circulation areas.',
    serviceType: 'FOOD',
    image: venueArtwork.shop,
    spotlight: ['24-hour coffee', 'Fresh pastry drops', 'Fast pickup'],
  },
  {
    id: 'terrace-sips',
    title: 'Terrace Sips',
    schedule: '4:00 PM – 12:00 AM',
    summary: 'Evening wines, chilled pours, and dessert-forward drink pairings.',
    description: 'Terrace Sips focuses on after-dinner drinks and mellow seating for guests who want a more relaxed tempo. The menu leans into sparkling wine, dessert cocktails, and local tasting pours.',
    serviceType: 'DRINK',
    image: venueArtwork.conference,
    spotlight: ['Wine pairings', 'Dessert cocktails', 'Late-evening seating'],
  },
];

export const flavorItems: FlavorItem[] = [
  {id: 'harbour-benedict', title: 'Harbour Benedict', section: 'Breakfast', price: 19, prepMinutes: 14, description: 'Poached eggs, smoked salmon, toasted muffin, citrus hollandaise.', tags: ['Brunch', 'Seafood'], image: dishArtwork.eggs},
  {id: 'blueberry-stack', title: 'Blueberry Maple Stack', section: 'Breakfast', price: 16, prepMinutes: 12, description: 'Fluffy blueberry pancakes with maple butter and berry compote.', tags: ['Sweet', 'Vegetarian'], image: dishArtwork.pancakes},
  {id: 'market-omelette', title: 'Market Garden Omelette', section: 'Breakfast', price: 17, prepMinutes: 10, description: 'Three-egg omelette with roasted peppers, herbs, and aged cheddar.', tags: ['Vegetarian', 'Protein'], image: dishArtwork.omelette},
  {id: 'shellfish-chowder', title: 'Atlantic Shellfish Chowder', section: 'Small Plates', price: 18, prepMinutes: 15, description: 'Creamy chowder with mussels, shrimp, potatoes, and herbs.', tags: ['Seafood', 'Comfort'], image: dishArtwork.chowder},
  {id: 'fish-taco-duo', title: 'Crispy Fish Taco Duo', section: 'Small Plates', price: 22, prepMinutes: 16, description: 'Atlantic fish, cabbage slaw, lime crema, and smoked salsa.', tags: ['Street Food', 'Seafood'], image: dishArtwork.tacos},
  {id: 'caesar-plate', title: 'Grilled Caesar Plate', section: 'Small Plates', price: 20, prepMinutes: 14, description: 'Charred romaine, grilled chicken, parmesan, and garlic crumb.', tags: ['Classic', 'Protein'], image: dishArtwork.caesar},
  {id: 'salmon-board', title: 'Atlantic Salmon Board', section: 'Signature Plates', price: 35, prepMinutes: 24, description: 'Grilled salmon with asparagus, lemon butter, and potato fondant.', tags: ['Signature', 'Seafood'], image: dishArtwork.salmon},
  {id: 'lobster-risotto', title: 'Lobster Risotto', section: 'Signature Plates', price: 39, prepMinutes: 28, description: 'Creamy risotto finished with lobster, parmesan, and herbs.', tags: ['Chef Pick', 'Seafood'], image: dishArtwork.risotto},
  {id: 'filet-service', title: 'Filet Service', section: 'Signature Plates', price: 47, prepMinutes: 30, description: 'Filet mignon, whipped potatoes, and red wine reduction.', tags: ['Premium', 'Steak'], image: dishArtwork.filet},
  {id: 'midnight-linguine', title: 'Midnight Seafood Linguine', section: 'Signature Plates', price: 33, prepMinutes: 22, description: 'Shrimp, scallops, mussels, garlic, herbs, and white wine.', tags: ['Late Dinner', 'Seafood'], image: dishArtwork.linguine},
  {id: 'lava-finish', title: 'Chocolate Lava Finish', section: 'Desserts', price: 14, prepMinutes: 9, description: 'Warm chocolate cake with vanilla gelato.', tags: ['Dessert', 'Shareable'], image: dishArtwork.lava},
  {id: 'berry-cheesecake', title: 'Berry Cheesecake Slice', section: 'Desserts', price: 12, prepMinutes: 5, description: 'New York cheesecake with berry compote and mint.', tags: ['Dessert', 'Classic'], image: dishArtwork.cheesecake},
  {id: 'dessert-tart', title: 'Seasonal Fruit Tart', section: 'Desserts', price: 11, prepMinutes: 6, description: 'Pastry cream tart with fresh fruit and glazed finish.', tags: ['Dessert', 'Vegetarian'], image: dishArtwork.tart},
  {id: 'citrus-spritz', title: 'Citrus Spritz', section: 'Drinks', price: 13, prepMinutes: 4, description: 'Bright sparkling spritz with citrus peel and herb finish.', tags: ['Cocktail', 'Refreshing'], image: dishArtwork.gelato},
  {id: 'midnight-mocktail', title: 'Midnight Mocktail', section: 'Drinks', price: 10, prepMinutes: 4, description: 'Zero-proof berry tonic with rosemary aroma.', tags: ['Zero Proof', 'Signature'], image: dishArtwork.brulee},
  {id: 'espresso-pour', title: 'Espresso Velvet', section: 'Drinks', price: 11, prepMinutes: 5, description: 'Chilled espresso drink finished with cocoa foam.', tags: ['Coffee', 'After Dinner'], image: dishArtwork.continental},
];

