import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Search, Filter, Camera } from 'lucide-react';

const Explorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const nearbyPlaces = [
    {
      id: 1,
      name: 'Central Park Dog Run',
      distance: '0.3 mi',
      rating: 4.8,
      reviews: 127,
      type: 'Dog Park',
      tags: ['Off-leash', 'Water fountain', 'Agility course'],
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Riverside Walking Trail',
      distance: '0.7 mi', 
      rating: 4.6,
      reviews: 89,
      type: 'Trail',
      tags: ['Scenic', 'Paved', 'Dog-friendly'],
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'PetSmart',
      distance: '1.2 mi',
      rating: 4.3,
      reviews: 203,
      type: 'Pet Store',
      tags: ['Grooming', 'Supplies', 'Vet services'],
      image: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Happy Tails Veterinary',
      distance: '1.5 mi',
      rating: 4.9,
      reviews: 156,
      type: 'Veterinary',
      tags: ['Emergency care', '24/7', 'Specialists'],
      image: '/placeholder.svg'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Places' },
    { id: 'parks', label: 'Dog Parks' },
    { id: 'trails', label: 'Trails' },
    { id: 'stores', label: 'Pet Stores' },
    { id: 'vets', label: 'Veterinary' }
  ];

  const filteredPlaces = nearbyPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'parks' && place.type === 'Dog Park') ||
      (selectedFilter === 'trails' && place.type === 'Trail') ||
      (selectedFilter === 'stores' && place.type === 'Pet Store') ||
      (selectedFilter === 'vets' && place.type === 'Veterinary');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Explore</h1>
          <p className="text-muted-foreground">Discover dog-friendly places near you</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for places, parks, vets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.id)}
                  className="text-xs"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {filter.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Places Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPlaces.map((place) => (
            <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <img 
                  src={place.image} 
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80">
                    {place.type}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{place.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{place.distance}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{place.rating}</span>
                    <span>({place.reviews} reviews)</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {place.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                  <Button size="sm" variant="outline">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No places found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explorer;