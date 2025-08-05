import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Share2, MapPin, Camera, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import dogAvatar1 from '@/assets/dog-avatar-1.jpg';
import dogAvatar2 from '@/assets/dog-avatar-2.jpg';
import dogAvatar3 from '@/assets/dog-avatar-3.jpg';

const Community = () => {
  const [filterDistance, setFilterDistance] = useState('all');
  const [filterBreed, setFilterBreed] = useState('all');
  const [selectedTab, setSelectedTab] = useState('posts');

  const mockPosts = [
    {
      id: 1,
      user: 'Sarah & Buddy',
      avatar: dogAvatar1,
      breed: 'Golden Retriever',
      time: '2 hours ago',
      distance: '2.5km',
      location: 'Central Park',
      content: 'Amazing sunset walk with Buddy today! 🌅 He made 3 new friends at the dog park.',
      image: null,
      likes: 24,
      comments: 8,
      isPremium: true
    },
    {
      id: 2,
      user: 'Mike & Luna',
      avatar: dogAvatar2,
      breed: 'Husky',
      time: '4 hours ago',
      distance: '5.1km',
      location: 'Riverside Trail',
      content: 'Luna\'s first 5km run! She\'s getting stronger every day 💪',
      image: null,
      likes: 31,
      comments: 12,
      isPremium: false
    },
    {
      id: 3,
      user: 'Emma & Max',
      avatar: dogAvatar3,
      breed: 'Beagle',
      time: '6 hours ago',
      distance: '1.8km',
      location: 'Neighborhood',
      content: 'Max discovered his love for puddles today 😅 Bath time incoming!',
      image: null,
      likes: 45,
      comments: 15,
      isPremium: false
    }
  ];

  const filteredPosts = mockPosts.filter(post => {
    const distanceMatch = filterDistance === 'all' || 
      (filterDistance === '5km' && parseFloat(post.distance) <= 5) ||
      (filterDistance === '10km' && parseFloat(post.distance) <= 10) ||
      (filterDistance === '50km' && parseFloat(post.distance) <= 50);
    
    const breedMatch = filterBreed === 'all' || post.breed === filterBreed;
    
    return distanceMatch && breedMatch;
  });

  const handleLike = (postId: number) => {
    toast({
      title: "Post liked! ❤️",
      description: "Showing some love to fellow pet parents!",
    });
  };

  const handleShare = () => {
    toast({
      title: "Coming soon! 📱",
      description: "Share feature will be available in the next update.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-amber-800 mb-2">🐾 Community</h1>
          <p className="text-amber-700 text-sm">Share your paw-some adventures!</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 bg-white/60 p-1 rounded-lg">
          <Button
            variant={selectedTab === 'posts' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setSelectedTab('posts')}
          >
            Posts
          </Button>
          <Button
            variant={selectedTab === 'photos' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setSelectedTab('photos')}
          >
            Photos
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardContent className="p-4 space-y-3">
            <div className="flex space-x-2">
              <Select value={filterDistance} onValueChange={setFilterDistance}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All distances</SelectItem>
                  <SelectItem value="5km">Within 5km</SelectItem>
                  <SelectItem value="10km">Within 10km</SelectItem>
                  <SelectItem value="50km">Within 50km</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterBreed} onValueChange={setFilterBreed}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All breeds</SelectItem>
                  <SelectItem value="Golden Retriever">Golden Retriever</SelectItem>
                  <SelectItem value="Husky">Husky</SelectItem>
                  <SelectItem value="Beagle">Beagle</SelectItem>
                  <SelectItem value="Labrador">Labrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Create Post Button */}
        <Button className="w-full bg-amber-600 hover:bg-amber-700" size="lg">
          <Camera className="w-5 h-5 mr-2" />
          Share Your Adventure
        </Button>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="bg-white/80 backdrop-blur-sm border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.avatar} alt={post.user} />
                    <AvatarFallback>{post.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-sm">{post.user}</h3>
                      {post.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Badge variant="outline" className="text-xs">{post.breed}</Badge>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm mb-3">{post.content}</p>

                <div className="flex items-center space-x-2 text-xs text-gray-600 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{post.location}</span>
                  <span>•</span>
                  <span>{post.distance}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className="text-xs"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-xs"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No posts match your filters. Try adjusting your search!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Community;