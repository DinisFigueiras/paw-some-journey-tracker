import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Gift, Star, Trophy, Zap, Calendar, Target, Crown, Award } from 'lucide-react';

const Rewards = () => {
  const [selectedTab, setSelectedTab] = useState('achievements');

  const userStats = {
    totalPoints: 2450,
    currentStreak: 7,
    rank: 'Gold Walker',
    nextRankPoints: 500
  };

  const achievements = [
    {
      id: 1,
      title: 'First Walk',
      description: 'Complete your very first walk',
      icon: '🐕',
      earned: true,
      points: 50,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: 'Walk every day for a week',
      icon: '🗓️',
      earned: true,
      points: 200,
      date: '2024-01-22'
    },
    {
      id: 3,
      title: 'Distance Champion',
      description: 'Walk 100 miles total',
      icon: '🏃',
      earned: false,
      points: 500,
      progress: 67
    },
    {
      id: 4,
      title: 'Early Bird',
      description: 'Complete 10 morning walks',
      icon: '🌅',
      earned: true,
      points: 150,
      date: '2024-01-28'
    },
    {
      id: 5,
      title: 'Social Butterfly',
      description: 'Meet 5 other dogs at the park',
      icon: '🦋',
      earned: false,
      points: 300,
      progress: 40
    },
    {
      id: 6,
      title: 'Training Master',
      description: 'Complete 3 training programs',
      icon: '🎓',
      earned: false,
      points: 750,
      progress: 33
    }
  ];

  const rewards = [
    {
      id: 1,
      title: 'Premium Dog Treats',
      description: 'High-quality organic treats for your pup',
      points: 500,
      category: 'treats',
      inStock: true,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Custom Dog Tag',
      description: 'Personalized tag with your dog\'s name',
      points: 750,
      category: 'accessories',
      inStock: true,
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Professional Photo Session',
      description: '1-hour photo session with a pet photographer',
      points: 2000,
      category: 'experiences',
      inStock: true,
      image: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Interactive Puzzle Toy',
      description: 'Mental stimulation toy for smart dogs',
      points: 1200,
      category: 'toys',
      inStock: false,
      image: '/placeholder.svg'
    },
    {
      id: 5,
      title: 'Dog Park Day Pass',
      description: 'Free entry to premium dog parks',
      points: 300,
      category: 'experiences',
      inStock: true,
      image: '/placeholder.svg'
    },
    {
      id: 6,
      title: 'Grooming Session',
      description: 'Professional grooming at top salon',
      points: 1500,
      category: 'services',
      inStock: true,
      image: '/placeholder.svg'
    }
  ];

  const dailyChallenges = [
    {
      id: 1,
      title: 'Morning Walk',
      description: 'Take a walk before 9 AM',
      points: 50,
      progress: 100,
      completed: true
    },
    {
      id: 2,
      title: 'Photo Challenge',
      description: 'Share a photo of your walk',
      points: 30,
      progress: 0,
      completed: false
    },
    {
      id: 3,
      title: 'Distance Goal',
      description: 'Walk at least 2 miles today',
      points: 75,
      progress: 60,
      completed: false
    }
  ];

  const tabs = [
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'challenges', label: 'Daily Challenges', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Rewards</h1>
          <p className="text-muted-foreground">Earn points and unlock amazing rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{userStats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">{userStats.rank}</span>
              </div>
              <div className="text-xs text-muted-foreground">Current Rank</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-green-500">{userStats.nextRankPoints}</div>
              <div className="text-sm text-muted-foreground">To Next Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={selectedTab === tab.id ? "default" : "outline"}
                    onClick={() => setSelectedTab(tab.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {selectedTab === 'achievements' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`${achievement.earned ? 'border-primary' : ''}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="space-y-1">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    {achievement.earned && (
                      <Badge variant="default" className="bg-green-500">
                        <Award className="w-3 h-3 mr-1" />
                        Earned
                      </Badge>
                    )}
                  </div>
                  
                  {achievement.earned ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-medium">+{achievement.points} points</span>
                      <span className="text-muted-foreground">{achievement.date}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{achievement.progress}% complete</span>
                        <span>{achievement.points} points</span>
                      </div>
                      <Progress value={achievement.progress} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'rewards' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden">
                <div className="h-32 bg-muted">
                  <img 
                    src={reward.image} 
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-medium">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{reward.points}</span>
                    </div>
                    <Badge variant={reward.inStock ? "secondary" : "destructive"}>
                      {reward.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    disabled={!reward.inStock || userStats.totalPoints < reward.points}
                  >
                    {userStats.totalPoints >= reward.points ? 'Redeem' : 'Not Enough Points'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'challenges' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div key={challenge.id} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{challenge.points}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} />
                    </div>
                    
                    {challenge.completed && (
                      <Badge variant="default" className="bg-green-500">
                        <Award className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;