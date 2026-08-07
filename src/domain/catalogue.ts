import {ImageSourcePropType} from 'react-native';
import {dishArtwork, venueArtwork} from '../foundation/assets';

export type Venue = {id: string; name: string; hours: string; short: string; detail: string; kind: string; image: ImageSourcePropType};
export type DishCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Desserts';
export type Dish = {id: string; category: DishCategory; name: string; price: number; minutes: number; description: string; image: ImageSourcePropType};

export const venues: Venue[] = [
  {id: 'ocean', name: 'Ocean View Restaurant', hours: '7:00 AM – 10:00 PM', short: 'Signature seafood dining with ocean views.', kind: 'DINING', image: venueArtwork.ocean, detail: 'Ocean View Restaurant offers an elegant dining experience inspired by Atlantic coastal cuisine. Guests can enjoy fresh seafood, premium steaks, and seasonal specialties prepared by experienced chefs. The stylish interior and panoramic views create a memorable atmosphere. Every dish is crafted using carefully selected local ingredients. Breakfast, lunch, and dinner are served daily with a wide selection of beverages and desserts. Vegetarian and gluten-free options are available. Reservations are recommended during peak dining hours. Smart casual attire is appreciated.'},
  {id: 'lounge', name: 'Blue Harbor Lounge', hours: '11:00 AM – 12:00 AM', short: 'Premium cocktails and relaxing evening atmosphere.', kind: 'LOUNGE', image: venueArtwork.lounge, detail: 'Blue Harbor Lounge is the perfect place to relax with handcrafted cocktails, premium wines, and signature spirits. Comfortable seating and ambient lighting create a sophisticated atmosphere. Live music performances are featured on selected evenings. Light meals and gourmet appetizers are served throughout the day.'},
  {id: 'spa', name: 'Wellness Spa', hours: '8:00 AM – 8:00 PM', short: 'Relaxing spa treatments and wellness experiences.', kind: 'WELLNESS', image: venueArtwork.spa, detail: 'A peaceful retreat designed to restore balance and relaxation, with massages, facial treatments, body therapies, aromatherapy, sauna and a private relaxation lounge.'},
  {id: 'pool', name: 'Indoor Pool', hours: '6:00 AM – 10:00 PM', short: 'Heated indoor pool for every season.', kind: 'LEISURE', image: venueArtwork.pool, detail: 'The heated indoor pool provides year-round relaxation in a comfortable setting. Spacious lounge areas, fresh towels, lockers and showers are available to hotel guests.'},
  {id: 'fitness', name: 'Fitness Center', hours: 'Open 24 Hours', short: 'Modern gym with premium workout equipment.', kind: 'FITNESS', image: venueArtwork.fitness, detail: 'Advanced cardio machines, strength equipment and free weights for every fitness level, with complimentary towels and filtered water.'},
  {id: 'casino', name: 'Casino Floor', hours: 'Open 24 Hours', short: 'Exciting gaming with premium entertainment options.', kind: 'CASINO', image: venueArtwork.casino, detail: 'World-class gaming with modern slot machines, table games, exclusive VIP areas, regular tournaments and responsible gaming information.'},
  {id: 'conference', name: 'Conference Center', hours: '8:00 AM – 6:00 PM', short: 'Flexible meeting spaces for business events.', kind: 'BUSINESS', image: venueArtwork.conference, detail: 'Versatile meeting rooms with modern presentation technology, high-speed Wi-Fi, catering and professional event coordination.'},
  {id: 'shop', name: 'Gift Shop', hours: '9:00 AM – 9:00 PM', short: 'Souvenirs, gifts, travel essentials, local products.', kind: 'SHOP', image: venueArtwork.shop, detail: 'A curated collection of souvenirs, branded merchandise, locally crafted products and everyday travel essentials near the main lobby.'},
];

export const dishes: Dish[] = [
  {id:'eggs',category:'Breakfast',name:'Atlantic Eggs Benedict',price:18.5,minutes:15,description:'Poached eggs, smoked salmon, hollandaise, toasted muffin.',image:dishArtwork.eggs},
  {id:'pancakes',category:'Breakfast',name:'Blueberry Pancakes',price:15,minutes:12,description:'Fluffy pancakes with maple syrup and blueberries.',image:dishArtwork.pancakes},
  {id:'omelette',category:'Breakfast',name:'Classic Omelette',price:16,minutes:10,description:'Three eggs, cheese, herbs, fresh vegetables.',image:dishArtwork.omelette},
  {id:'avocado',category:'Breakfast',name:'Avocado Toast',price:14.5,minutes:8,description:'Sourdough, avocado, tomatoes, feta, microgreens.',image:dishArtwork.avocado},
  {id:'continental',category:'Breakfast',name:'Continental Breakfast',price:21,minutes:10,description:'Pastries, fruit, yogurt, juice, fresh coffee.',image:dishArtwork.continental},
  {id:'caesar',category:'Lunch',name:'Grilled Chicken Caesar',price:19.5,minutes:15,description:'Romaine, parmesan, croutons, grilled chicken, dressing.',image:dishArtwork.caesar},
  {id:'chowder',category:'Lunch',name:'Seafood Chowder',price:17,minutes:18,description:'Creamy seafood soup with herbs and potatoes.',image:dishArtwork.chowder},
  {id:'burger',category:'Lunch',name:'Angus Beef Burger',price:23,minutes:20,description:'Beef patty, cheddar, bacon, fries, pickles.',image:dishArtwork.burger},
  {id:'tacos',category:'Lunch',name:'Atlantic Fish Tacos',price:21.5,minutes:18,description:'Crispy fish, slaw, salsa, lime crema.',image:dishArtwork.tacos},
  {id:'pasta',category:'Lunch',name:'Garden Pasta Primavera',price:20,minutes:16,description:'Seasonal vegetables, parmesan, herbs, creamy sauce.',image:dishArtwork.pasta},
  {id:'salmon',category:'Dinner',name:'Grilled Atlantic Salmon',price:34,minutes:25,description:'Fresh salmon, asparagus, lemon butter, potatoes.',image:dishArtwork.salmon},
  {id:'filet',category:'Dinner',name:'Filet Mignon',price:46,minutes:30,description:'Premium beef, mashed potatoes, red wine sauce.',image:dishArtwork.filet},
  {id:'linguine',category:'Dinner',name:'Seafood Linguine',price:32.5,minutes:24,description:'Shrimp, mussels, scallops, garlic white wine.',image:dishArtwork.linguine},
  {id:'chicken',category:'Dinner',name:'Herb Roasted Chicken',price:29,minutes:22,description:'Roasted chicken, vegetables, rosemary, garlic butter.',image:dishArtwork.chicken},
  {id:'risotto',category:'Dinner',name:'Lobster Risotto',price:38,minutes:28,description:'Creamy risotto with lobster and parmesan cheese.',image:dishArtwork.risotto},
  {id:'cheesecake',category:'Desserts',name:'New York Cheesecake',price:12,minutes:5,description:'Creamy cheesecake with berry compote and mint.',image:dishArtwork.cheesecake},
  {id:'lava',category:'Desserts',name:'Chocolate Lava Cake',price:13.5,minutes:10,description:'Warm chocolate cake with vanilla ice cream.',image:dishArtwork.lava},
  {id:'brulee',category:'Desserts',name:'Crème Brûlée',price:11.5,minutes:8,description:'Classic vanilla custard with caramelized sugar crust.',image:dishArtwork.brulee},
  {id:'tart',category:'Desserts',name:'Seasonal Fruit Tart',price:10.5,minutes:6,description:'Fresh seasonal fruits on buttery pastry cream.',image:dishArtwork.tart},
  {id:'gelato',category:'Desserts',name:'Gelato Selection',price:9.5,minutes:3,description:'Three artisan gelato scoops with fresh berries.',image:dishArtwork.gelato},
];
