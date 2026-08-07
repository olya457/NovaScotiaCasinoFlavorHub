import {FlavorVenue} from '../domain/flavorHubData';

export type MainStackParamList = {
  SplashScreen: undefined;
  IntroScreen: undefined;
  MainTabs: undefined;
  VenueDetailScreen: {venue: FlavorVenue};
};

export type TabParamList = {
  HomeScreen: undefined;
  VenueGuideScreen: undefined;
  FlavorMapScreen: undefined;
  MenuScreen: undefined;
  PlannerScreen: undefined;
};

