import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Plus, 
  Camera,
  Crown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import dogAvatar1 from '@/assets/dog-avatar-1.jpg';
import dogAvatar2 from '@/assets/dog-avatar-2.jpg';

interface Pet {
  id: string;
  name: string;
  breed: string;
  photo_url: string;
  birth_date: string;
}

interface WalkStats {
  totalWalks: number;
  totalDistance: number;
  totalDuration: number;
  weeklyWalks: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [walkStats, setWalkStats] = useState<WalkStats>({
    totalWalks: 3,
    totalDistance: 5.2,
    totalDuration: 0,
    weeklyWalks: 0,
  });

  const mockPets = [
    { name: 'Buddy', breed: 'Golden Retriever', age: '4 years', avatar: dogAvatar1, lastWalk: '2 hours ago' },
    { name: 'Luna', breed: 'Husky', age: '7 years', avatar: dogAvatar2, lastWalk: '2 hours ago' },
  ];

  const recentActivities = [
    { id: 1, description: 'Completed walk with Buddy', time: '2 hours ago', distance: '1.8 km' },
    { id: 2, description: 'Luna discovered a new park!', time: '4 hours ago', distance: '2.1 km' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center pt-4 space-y-2">
          <h1 className="text-2xl font-bold text-amber-800">Good evening, AdminName2! 🐕</h1>
          <p className="text-amber-700 text-sm">Ready for some paw-some adventures today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-800">3</p>
              <p className="text-sm text-amber-600">Today's Walks</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-800">5.2 km</p>
              <p className="text-sm text-amber-600">Distance</p>
            </CardContent>
          </Card>
        </div>

        {/* My Pets */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-amber-800">My Pets</CardTitle>
              <Button variant="ghost" size="sm" className="text-amber-600">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPets.map((pet, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-amber-50/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={pet.avatar} alt={pet.name} />
                  <AvatarFallback>{pet.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">{pet.name}</h3>
                  <p className="text-xs text-amber-700">{pet.breed} • {pet.age}</p>
                  <p className="text-xs text-amber-600">● Last walk: {pet.lastWalk}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-amber-600">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-20 bg-amber-600 hover:bg-amber-700 flex flex-col gap-2">
            <MapPin className="h-6 w-6" />
            <span className="text-sm font-medium">Find Parks</span>
          </Button>
          <Button className="h-20 bg-amber-600 hover:bg-amber-700 flex flex-col gap-2">
            <Plus className="h-6 w-6" />
            <span className="text-sm font-medium">New Walk</span>
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-green-800">{activity.description}</p>
                  <p className="text-sm text-green-600">{activity.time} • {activity.distance}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Premium Upgrade Card */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
            <h3 className="font-bold mb-1">Upgrade to Premium</h3>
            <p className="text-sm opacity-90 mb-3">AI Coach, Rewards & More for just $5/month!</p>
            <Button variant="secondary" size="sm" className="bg-white text-purple-600 hover:bg-gray-100">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}