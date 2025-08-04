import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Crown, Star, TrendingUp, Calendar, MapPin } from 'lucide-react';

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  const leaderboardData = {
    weekly: [
      {
        rank: 1,
        name: 'Sarah & Max',
        avatar: '/placeholder.svg',
        points: 1250,
        walks: 14,
        distance: '28.5 mi',
        streak: 7,
        badge: 'gold'
      },
      {
        rank: 2,
        name: 'Mike & Luna',
        avatar: '/placeholder.svg',
        points: 1180,
        walks: 12,
        distance: '24.2 mi',
        streak: 5,
        badge: 'silver'
      },
      {
        rank: 3,
        name: 'Emma & Charlie',
        avatar: '/placeholder.svg',
        points: 1050,
        walks: 11,
        distance: '22.8 mi',
        streak: 6,
        badge: 'bronze'
      },
      {
        rank: 4,
        name: 'Alex & Buddy',
        avatar: '/placeholder.svg',
        points: 920,
        walks: 10,
        distance: '18.4 mi',
        streak: 4,
        badge: null
      },
      {
        rank: 5,
        name: 'Lisa & Bella',
        avatar: '/placeholder.svg',
        points: 890,
        walks: 9,
        distance: '17.6 mi',
        streak: 3,
        badge: null
      },
      {
        rank: 6,
        name: 'You & Your Pup',
        avatar: '/placeholder.svg',
        points: 780,
        walks: 8,
        distance: '15.2 mi',
        streak: 2,
        badge: null,
        isCurrentUser: true
      }
    ],
    monthly: [
      {
        rank: 1,
        name: 'Emma & Charlie',
        avatar: '/placeholder.svg',
        points: 4850,
        walks: 52,
        distance: '112.3 mi',
        streak: 28,
        badge: 'gold'
      },
      {
        rank: 2,
        name: 'Sarah & Max',
        avatar: '/placeholder.svg',
        points: 4720,
        walks: 48,
        distance: '108.7 mi',
        streak: 25,
        badge: 'silver'
      },
      {
        rank: 3,
        name: 'Mike & Luna',
        avatar: '/placeholder.svg',
        points: 4320,
        walks: 45,
        distance: '96.4 mi',
        streak: 22,
        badge: 'bronze'
      }
    ]
  };

  const achievements = [
    {
      title: 'Consistency King',
      description: 'Most consecutive days walking',
      winner: 'Emma & Charlie',
      value: '28 days',
      icon: Calendar
    },
    {
      title: 'Distance Champion',
      description: 'Longest total distance this month',
      winner: 'Sarah & Max',
      value: '108.7 mi',
      icon: MapPin
    },
    {
      title: 'Early Bird',
      description: 'Most morning walks (before 8 AM)',
      winner: 'Mike & Luna',
      value: '24 walks',
      icon: TrendingUp
    }
  ];

  const getBadgeIcon = (badge: string | null, rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <Trophy className="w-5 h-5 text-muted-foreground" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank among fellow dog walkers</p>
        </div>

        {/* Period Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === 'weekly' ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod('weekly')}
              >
                This Week
              </Button>
              <Button
                variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod('monthly')}
              >
                This Month
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {selectedPeriod === 'weekly' ? 'Weekly' : 'Monthly'} Rankings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaderboardData[selectedPeriod as keyof typeof leaderboardData].map((user) => (
                  <div
                    key={user.rank}
                    className={`p-4 rounded-lg border transition-colors ${
                      user.isCurrentUser 
                        ? 'bg-primary/5 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center gap-2 min-w-[60px]">
                        <span className={`text-2xl font-bold ${getRankColor(user.rank)}`}>
                          #{user.rank}
                        </span>
                        {getBadgeIcon(user.badge, user.rank)}
                      </div>

                      {/* Avatar and Name */}
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.split(' ')[0][0]}{user.name.split(' ')[2]?.[0] || 'P'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          {user.isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-4 text-center min-w-[240px]">
                        <div>
                          <div className="text-lg font-bold text-primary">{user.points}</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{user.walks}</div>
                          <div className="text-xs text-muted-foreground">Walks</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{user.distance}</div>
                          <div className="text-xs text-muted-foreground">Distance</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-500">{user.streak}</div>
                          <div className="text-xs text-muted-foreground">Streak</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">#6</div>
                  <div className="text-sm text-muted-foreground">Current Rank</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Points this week</span>
                    <span className="font-medium">780</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Walks completed</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Distance covered</span>
                    <span className="font-medium">15.2 mi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Current streak</span>
                    <span className="font-medium text-orange-500">2 days</span>
                  </div>
                </div>
                
                <Button className="w-full" size="sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Improve Rank
                </Button>
              </CardContent>
            </Card>

            {/* Special Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Special Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" />
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">{achievement.winner}</span>
                        <Badge variant="outline" className="text-xs">{achievement.value}</Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Competition Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Challenge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <h3 className="font-medium">Distance Challenge</h3>
                  <p className="text-sm text-muted-foreground">
                    Walk the most miles this week to win premium treats!
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time left</span>
                  <span className="font-medium">3 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current leader</span>
                  <span className="font-medium">Sarah & Max</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;