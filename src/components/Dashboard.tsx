import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  PawPrint, 
  MapPin, 
  Plus, 
  Play, 
  Heart, 
  Trophy, 
  BookOpen, 
  Gift,
  MessageCircle,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [walkStats, setWalkStats] = useState<WalkStats>({
    totalWalks: 0,
    totalDistance: 0,
    totalDuration: 0,
    weeklyWalks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPets();
      fetchWalkStats();
    }
  }, [user]);

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('profile_id', user?.id);

      if (error) throw error;

      setPets(data || []);
      if (data && data.length > 0 && !selectedPet) {
        setSelectedPet(data[0]);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalkStats = async () => {
    try {
      const { data, error } = await supabase
        .from('walks')
        .select('duration, distance, created_at')
        .eq('user_id', user?.id);

      if (error) throw error;

      const walks = data || [];
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const weeklyWalks = walks.filter(walk => 
        new Date(walk.created_at) >= weekAgo
      ).length;

      const totalDistance = walks.reduce((sum, walk) => sum + (walk.distance || 0), 0);
      const totalDuration = walks.reduce((sum, walk) => sum + (walk.duration || 0), 0);

      setWalkStats({
        totalWalks: walks.length,
        totalDistance: Number(totalDistance.toFixed(1)),
        totalDuration: Math.round(totalDuration / 60), // Convert to minutes
        weeklyWalks,
      });
    } catch (error) {
      console.error('Error fetching walk stats:', error);
    }
  };

  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${distance} m`;
  };

  const quickActions = [
    {
      title: 'Start Walk',
      description: 'Begin tracking a new walk',
      icon: Play,
      color: 'bg-primary text-primary-foreground',
      action: () => onNavigate('walk-tracker'),
    },
    {
      title: 'Add Pet',
      description: 'Register a new furry friend',
      icon: Plus,
      color: 'bg-secondary text-secondary-foreground',
      action: () => onNavigate('pet-profile'),
    },
    {
      title: 'Explore',
      description: 'Find dog-friendly places',
      icon: MapPin,
      color: 'bg-accent text-accent-foreground',
      action: () => onNavigate('explorer'),
    },
    {
      title: 'Health Check',
      description: 'View health reminders',
      icon: Heart,
      color: 'bg-destructive text-destructive-foreground',
      action: () => onNavigate('health'),
    },
  ];

  const features = [
    {
      title: 'Milestones',
      description: 'View your achievements',
      icon: Trophy,
      action: () => onNavigate('milestones'),
    },
    {
      title: 'Training Hub',
      description: 'Learn new tricks',
      icon: BookOpen,
      action: () => onNavigate('training'),
    },
    {
      title: 'Rewards',
      description: 'Unlock exclusive offers',
      icon: Gift,
      action: () => onNavigate('rewards'),
    },
    {
      title: 'AI Assistant',
      description: 'Ask dog care questions',
      icon: MessageCircle,
      action: () => onNavigate('ai-bot'),
    },
    {
      title: 'Leaderboard',
      description: 'See community rankings',
      icon: Users,
      action: () => onNavigate('leaderboard'),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <PawPrint className="h-12 w-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading your paws...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PawPrint className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">PawGo</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="hidden sm:flex">
                {walkStats.weeklyWalks} walks this week
              </Badge>
              <Button variant="ghost" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Pet Selector */}
        {pets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PawPrint className="h-5 w-5" />
                Your Pets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all cursor-pointer min-w-[120px] ${
                      selectedPet?.id === pet.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPet(pet)}
                  >
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={pet.photo_url} alt={pet.name} />
                      <AvatarFallback>
                        {pet.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-center">{pet.name}</span>
                    <span className="text-sm text-muted-foreground text-center">
                      {pet.breed}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{walkStats.totalWalks}</p>
                  <p className="text-sm text-muted-foreground">Total Walks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{formatDistance(walkStats.totalDistance)}</p>
                  <p className="text-sm text-muted-foreground">Distance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{walkStats.totalDuration}m</p>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{walkStats.weeklyWalks}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent"
                  onClick={action.action}
                >
                  <div className={`p-3 rounded-full ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Explore Features</CardTitle>
            <CardDescription>Discover everything PawGo has to offer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-auto p-4 flex items-center gap-3 justify-start hover:bg-accent"
                  onClick={feature.action}
                >
                  <feature.icon className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Empty State for No Pets */}
        {pets.length === 0 && (
          <Card className="text-center p-8">
            <CardContent>
              <PawPrint className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Welcome to PawGo!</h3>
              <p className="text-muted-foreground mb-6">
                Start your journey by adding your first pet profile
              </p>
              <Button onClick={() => onNavigate('pet-profile')} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Pet
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}