import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Crown, 
  ExternalLink, 
  MessageCircle,
  Calendar,
  Award,
  Lock
} from 'lucide-react';

const TrainingHub = () => {
  const [isPremium] = useState(false); // This would come from user context

  const freeVideos = [
    {
      id: 1,
      title: "Basic Sit Command",
      instructor: "Dog Training 101",
      duration: "5:30",
      views: "2.1M",
      rating: 4.8,
      thumbnail: "https://img.youtube.com/vi/SzadF-3XyW8/maxresdefault.jpg",
      youtubeId: "SzadF-3XyW8",
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Leash Training Basics",
      instructor: "Professional Dog Training",
      duration: "8:45",
      views: "1.5M",
      rating: 4.9,
      thumbnail: "https://img.youtube.com/vi/sFgtqgiAKoQ/maxresdefault.jpg",
      youtubeId: "sFgtqgiAKoQ",
      difficulty: "Beginner"
    },
    {
      id: 3,
      title: "House Training Puppy",
      instructor: "Puppy Training Central",
      duration: "12:20",
      views: "3.2M",
      rating: 4.7,
      thumbnail: "https://img.youtube.com/vi/VZhayE5vAck/maxresdefault.jpg",
      youtubeId: "VZhayE5vAck",
      difficulty: "Beginner"
    },
    {
      id: 4,
      title: "Stop Excessive Barking",
      instructor: "Canine Behavior Expert",
      duration: "15:10",
      views: "980K",
      rating: 4.6,
      thumbnail: "https://img.youtube.com/vi/ZZQ7ltMkqDY/maxresdefault.jpg",
      youtubeId: "ZZQ7ltMkqDY",
      difficulty: "Intermediate"
    }
  ];

  const premiumFeatures = [
    {
      title: "Personal Pet Coach",
      description: "1-on-1 video sessions with certified trainers",
      icon: MessageCircle
    },
    {
      title: "Custom Training Plans",
      description: "Personalized programs based on your dog's needs",
      icon: Calendar
    },
    {
      title: "Advanced Techniques",
      description: "Access to professional training methods",
      icon: Award
    }
  ];

  const openYouTubeVideo = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Training Hub</h1>
          <p className="text-muted-foreground">Learn and grow with your furry friend</p>
        </div>

        <Tabs defaultValue="free" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="free">Free Content</TabsTrigger>
            <TabsTrigger value="premium" className="relative">
              Premium
              <Crown className="w-3 h-3 ml-1 text-primary" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="free" className="space-y-4">
            <div className="text-center bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-1">Free YouTube Training</h3>
              <p className="text-sm text-muted-foreground">Curated content from top dog trainers</p>
            </div>

            {freeVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="flex">
                  <div className="relative w-32 h-20 flex-shrink-0">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-sm text-foreground line-clamp-2">{video.title}</h4>
                      <Badge variant="secondary" className="text-xs ml-2">
                        {video.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{video.instructor}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {video.duration}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {video.views}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-primary" />
                          {video.rating}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => openYouTubeVideo(video.youtubeId)}
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2 h-8"
                    >
                      Watch <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="premium" className="space-y-4">
            {!isPremium && (
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <CardHeader className="text-center pb-3">
                  <CardTitle className="flex items-center justify-center text-lg">
                    <Crown className="w-5 h-5 mr-2 text-primary" />
                    Upgrade to Premium
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {premiumFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                  <Button className="w-full mt-4">
                    Upgrade for $5/month
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Premium Content Preview (Locked) */}
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="relative overflow-hidden opacity-60">
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Premium Only</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Advanced Training Session {i}</h4>
                        <p className="text-sm text-muted-foreground">With certified trainer</p>
                      </div>
                    </div>
                    <Badge variant="secondary">1-on-1 Session</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainingHub;