import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  MapPin, 
  Clock, 
  TrendingUp,
  Zap,
  Target,
  Calendar,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'distance' | 'frequency' | 'duration' | 'exploration' | 'social';
  requirement: number;
  current: number;
  unit: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  badge_color: string;
}

interface WalkStats {
  totalWalks: number;
  totalDistance: number;
  totalDuration: number;
  uniqueLocations: number;
  longestWalk: number;
  weeklyWalks: number;
  monthlyWalks: number;
}

interface MilestonesProps {
  onBack: () => void;
}

export default function Milestones({ onBack }: MilestonesProps) {
  const { user } = useAuth();
  const [walkStats, setWalkStats] = useState<WalkStats>({
    totalWalks: 0,
    totalDistance: 0,
    totalDuration: 0,
    uniqueLocations: 0,
    longestWalk: 0,
    weeklyWalks: 0,
    monthlyWalks: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWalkStats();
    }
  }, [user]);

  useEffect(() => {
    if (walkStats.totalWalks > 0) {
      generateAchievements();
    }
  }, [walkStats]);

  const fetchWalkStats = async () => {
    try {
      const { data: walks, error } = await supabase
        .from('walks')
        .select('duration, distance, created_at, route_data')
        .eq('user_id', user?.id);

      if (error) throw error;

      const walksData = walks || [];
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const weeklyWalks = walksData.filter(walk => 
        new Date(walk.created_at) >= weekAgo
      ).length;

      const monthlyWalks = walksData.filter(walk => 
        new Date(walk.created_at) >= monthAgo
      ).length;

      const totalDistance = walksData.reduce((sum, walk) => sum + (walk.distance || 0), 0);
      const totalDuration = walksData.reduce((sum, walk) => sum + (walk.duration || 0), 0);
      const longestWalk = Math.max(...walksData.map(walk => walk.distance || 0), 0);

      // Simulate unique locations based on walk count (in real app, you'd analyze route_data)
      const uniqueLocations = Math.min(walksData.length * 2, walksData.length + 5);

      setWalkStats({
        totalWalks: walksData.length,
        totalDistance: Number(totalDistance.toFixed(1)),
        totalDuration: Math.round(totalDuration / 60), // Convert to minutes
        uniqueLocations,
        longestWalk: Number(longestWalk.toFixed(1)),
        weeklyWalks,
        monthlyWalks,
      });
    } catch (error) {
      console.error('Error fetching walk stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAchievements = () => {
    const achievementTemplates: Omit<Achievement, 'id' | 'current' | 'isUnlocked' | 'unlockedAt'>[] = [
      // Distance Achievements
      {
        title: 'First Steps',
        description: 'Complete your first walk',
        icon: Trophy,
        category: 'distance',
        requirement: 1,
        unit: 'walks',
        badge_color: 'bg-yellow-500',
      },
      {
        title: 'Getting Started',
        description: 'Walk a total of 1 kilometer',
        icon: MapPin,
        category: 'distance',
        requirement: 1000,
        unit: 'meters',
        badge_color: 'bg-blue-500',
      },
      {
        title: 'Marathon Walker',
        description: 'Walk a total of 10 kilometers',
        icon: Medal,
        category: 'distance',
        requirement: 10000,
        unit: 'meters',
        badge_color: 'bg-purple-500',
      },
      {
        title: 'Distance Champion',
        description: 'Walk a total of 50 kilometers',
        icon: Award,
        category: 'distance',
        requirement: 50000,
        unit: 'meters',
        badge_color: 'bg-gold-500',
      },
      // Frequency Achievements
      {
        title: 'Consistent Walker',
        description: 'Complete 5 walks',
        icon: Star,
        category: 'frequency',
        requirement: 5,
        unit: 'walks',
        badge_color: 'bg-green-500',
      },
      {
        title: 'Walking Enthusiast',
        description: 'Complete 25 walks',
        icon: Zap,
        category: 'frequency',
        requirement: 25,
        unit: 'walks',
        badge_color: 'bg-orange-500',
      },
      {
        title: 'Century Walker',
        description: 'Complete 100 walks',
        icon: Target,
        category: 'frequency',
        requirement: 100,
        unit: 'walks',
        badge_color: 'bg-red-500',
      },
      // Duration Achievements
      {
        title: 'Time Keeper',
        description: 'Walk for a total of 1 hour',
        icon: Clock,
        category: 'duration',
        requirement: 60,
        unit: 'minutes',
        badge_color: 'bg-teal-500',
      },
      {
        title: 'Endurance Walker',
        description: 'Walk for a total of 10 hours',
        icon: TrendingUp,
        category: 'duration',
        requirement: 600,
        unit: 'minutes',
        badge_color: 'bg-indigo-500',
      },
      // Exploration Achievements
      {
        title: 'Explorer',
        description: 'Visit 5 different locations',
        icon: MapPin,
        category: 'exploration',
        requirement: 5,
        unit: 'locations',
        badge_color: 'bg-cyan-500',
      },
      {
        title: 'Adventurer',
        description: 'Visit 20 different locations',
        icon: Award,
        category: 'exploration',
        requirement: 20,
        unit: 'locations',
        badge_color: 'bg-emerald-500',
      },
      // Social Achievements
      {
        title: 'Weekly Warrior',
        description: 'Complete 7 walks in a week',
        icon: Calendar,
        category: 'social',
        requirement: 7,
        unit: 'weekly walks',
        badge_color: 'bg-pink-500',
      },
      {
        title: 'Monthly Master',
        description: 'Complete 30 walks in a month',
        icon: Users,
        category: 'social',
        requirement: 30,
        unit: 'monthly walks',
        badge_color: 'bg-violet-500',
      },
    ];

    const processedAchievements: Achievement[] = achievementTemplates.map((template, index) => {
      let current = 0;
      
      switch (template.category) {
        case 'distance':
          current = template.unit === 'walks' ? walkStats.totalWalks : walkStats.totalDistance;
          break;
        case 'frequency':
          current = walkStats.totalWalks;
          break;
        case 'duration':
          current = walkStats.totalDuration;
          break;
        case 'exploration':
          current = walkStats.uniqueLocations;
          break;
        case 'social':
          current = template.unit === 'weekly walks' ? walkStats.weeklyWalks : walkStats.monthlyWalks;
          break;
      }

      const isUnlocked = current >= template.requirement;
      
      return {
        ...template,
        id: `achievement-${index}`,
        current,
        isUnlocked,
        unlockedAt: isUnlocked ? new Date().toISOString() : undefined,
      };
    });

    setAchievements(processedAchievements);
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'meters' && value >= 1000) {
      return `${(value / 1000).toFixed(1)} km`;
    }
    return `${value} ${unit}`;
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const inProgressAchievements = achievements.filter(a => !a.isUnlocked && a.current > 0);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked && a.current === 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="h-12 w-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Milestones & Achievements</h1>
            <Badge variant="secondary" className="ml-auto">
              {unlockedAchievements.length}/{achievements.length} Unlocked
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{formatValue(walkStats.totalDistance, 'meters')}</p>
              <p className="text-sm text-muted-foreground">Total Distance</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{walkStats.totalDuration}m</p>
              <p className="text-sm text-muted-foreground">Total Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{walkStats.totalWalks}</p>
              <p className="text-sm text-muted-foreground">Total Walks</p>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Unlocked Achievements
              </CardTitle>
              <CardDescription>Congratulations on your accomplishments!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-full ${achievement.badge_color} text-white`}>
                        <achievement.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                          {achievement.description}
                        </p>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* In Progress Achievements */}
        {inProgressAchievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                In Progress
              </CardTitle>
              <CardDescription>Keep going to unlock these achievements!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inProgressAchievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-full ${achievement.badge_color} text-white opacity-75`}>
                        <achievement.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <span className="text-sm text-muted-foreground">
                            {formatValue(achievement.current, achievement.unit)} / {formatValue(achievement.requirement, achievement.unit)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {achievement.description}
                        </p>
                        <Progress 
                          value={(achievement.current / achievement.requirement) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-gray-500" />
                Upcoming Achievements
              </CardTitle>
              <CardDescription>Start walking to unlock these milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 border rounded-lg opacity-60">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        <achievement.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <Badge variant="outline" className="text-gray-500">
                          {formatValue(achievement.requirement, achievement.unit)} required
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {achievements.length === 0 && (
          <Card className="text-center p-8">
            <CardContent>
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
              <p className="text-muted-foreground mb-6">
                Take your first walk to start earning achievements and unlocking milestones!
              </p>
              <Button onClick={onBack} variant="outline">
                Start Walking
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}