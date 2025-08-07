import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  Star, 
  Navigation, 
  Clock,
  Phone,
  Globe,
  Filter,
  Heart,
  Bone
} from 'lucide-react';

const Explorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([
    {
      id: 1,
      name: "Central Park Dog Run",
      type: "Dog Park",
      rating: 4.8,
      distance: "0.5 km",
      address: "Central Park, New York, NY",
      hours: "6:00 AM - 10:00 PM",
      features: ["Off-leash area", "Water fountains", "Waste bags"],
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Pawsome Veterinary Clinic",
      type: "Veterinary",
      rating: 4.9,
      distance: "1.2 km",
      address: "123 Pet Street, New York, NY",
      hours: "8:00 AM - 8:00 PM",
      phone: "(555) 123-4567",
      image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb1ab8?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Happy Tails Pet Store",
      type: "Pet Store",
      rating: 4.6,
      distance: "0.8 km",
      address: "456 Bark Avenue, New York, NY",
      hours: "9:00 AM - 9:00 PM",
      features: ["Premium food", "Toys", "Grooming supplies"],
      image: "https://images.unsplash.com/photo-1601758065371-e2cdc2d0e843?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      name: "Riverside Dog Beach",
      type: "Beach",
      rating: 4.7,
      distance: "2.1 km",
      address: "Riverside Park, New York, NY",
      hours: "Sunrise - Sunset",
      features: ["Swimming area", "Sandy beach", "Picnic tables"],
      image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&h=200&fit=crop"
    },
    {
      id: 5,
      name: "Furry Friends Café",
      type: "Pet-Friendly Café",
      rating: 4.5,
      distance: "1.5 km",
      address: "789 Coffee Lane, New York, NY",
      hours: "7:00 AM - 6:00 PM",
      features: ["Dog treats", "Outdoor seating", "Water bowls"],
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=200&fit=crop"
    }
  ]);

  const placeTypes = [
    { label: "All", value: "all", icon: MapPin },
    { label: "Dog Parks", value: "park", icon: Heart },
    { label: "Veterinary", value: "vet", icon: MapPin },
    { label: "Pet Stores", value: "store", icon: Bone },
    { label: "Cafés", value: "cafe", icon: MapPin }
  ];

  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied or error:", error);
        }
      );
    }
  }, []);

  const filteredPlaces = nearbyPlaces.filter(place => {
    if (selectedFilter === "all") return true;
    return place.type.toLowerCase().includes(selectedFilter);
  });

  const getPlaceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'dog park': return '🏞️';
      case 'veterinary': return '🏥';
      case 'pet store': return '🏪';
      case 'beach': return '🏖️';
      case 'pet-friendly café': return '☕';
      default: return '📍';
    }
  };

  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Explorer</h1>
          <p className="text-muted-foreground">Discover pet-friendly places nearby</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {placeTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.value}
                variant={selectedFilter === type.value ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap flex-shrink-0"
                onClick={() => setSelectedFilter(type.value)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {type.label}
              </Button>
            );
          })}
        </div>

        {/* Location Status */}
        {userLocation && (
          <div className="bg-primary/10 rounded-lg p-3 flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Location detected - showing nearby places</span>
          </div>
        )}

        {/* Map Placeholder */}
        <Card className="overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Interactive Map</p>
              <p className="text-xs text-muted-foreground">Coming soon with Google Maps</p>
            </div>
            <Badge className="absolute top-2 right-2 bg-primary">
              Live Map
            </Badge>
          </div>
        </Card>

        {/* Places List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Nearby Places</h2>
            <Badge variant="secondary">{filteredPlaces.length} found</Badge>
          </div>

          {filteredPlaces.map((place) => (
            <Card key={place.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-24 h-24 flex-shrink-0">
                  <img 
                    src={place.image} 
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground flex items-center">
                        <span className="mr-1">{getPlaceIcon(place.type)}</span>
                        {place.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{place.type}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-primary fill-current" />
                      <span className="text-xs font-medium">{place.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{place.distance}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{place.hours}</span>
                    </div>
                    {place.phone && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Phone className="w-3 h-3 mr-1" />
                        <span>{place.phone}</span>
                      </div>
                    )}
                  </div>

                  {place.features && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {place.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {place.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{place.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => openInMaps(place.address)}
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-7 text-xs"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Navigate
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 px-2">
                      <Heart className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Place Button */}
        <Card className="border-dashed border-2 border-border/50">
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <h3 className="font-semibold text-foreground mb-1">Know a great pet-friendly place?</h3>
            <p className="text-sm text-muted-foreground mb-3">Help other pet parents by adding it to our map</p>
            <Button variant="outline" size="sm">
              Add Place
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Explorer;