import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Check, Clock, Star, BookOpen, Trophy, Target } from 'lucide-react';

const TrainingHub = () => {
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  const trainingPrograms = [
    {
      id: 1,
      title: 'Basic Obedience',
      level: 'beginner',
      duration: '4 weeks',
      lessons: 12,
      completed: 8,
      description: 'Essential commands every dog should know',
      skills: ['Sit', 'Stay', 'Come', 'Down'],
      rating: 4.8,
      enrolled: 1250
    },
    {
      id: 2,
      title: 'Leash Training Mastery',
      level: 'beginner',
      duration: '3 weeks',
      lessons: 9,
      completed: 0,
      description: 'Walk without pulling and enjoy stress-free walks',
      skills: ['Heel', 'Loose leash', 'Focus', 'Direction changes'],
      rating: 4.9,
      enrolled: 890
    },
    {
      id: 3,
      title: 'Advanced Tricks',
      level: 'intermediate',
      duration: '6 weeks',
      lessons: 18,
      completed: 5,
      description: 'Impressive tricks to show off your dog\'s intelligence',
      skills: ['Roll over', 'Play dead', 'Spin', 'High five'],
      rating: 4.7,
      enrolled: 567
    },
    {
      id: 4,
      title: 'Agility Fundamentals',
      level: 'advanced',
      duration: '8 weeks',
      lessons: 24,
      completed: 0,
      description: 'Build confidence and athleticism through agility training',
      skills: ['Jumps', 'Tunnels', 'Weaves', 'Contacts'],
      rating: 4.9,
      enrolled: 234
    }
  ];

  const quickTips = [
    {
      title: 'Use Positive Reinforcement',
      description: 'Reward good behavior immediately with treats or praise',
      icon: '🎾'
    },
    {
      title: 'Keep Sessions Short',
      description: '5-10 minute sessions work best for most dogs',
      icon: '⏰'
    },
    {
      title: 'Be Consistent',
      description: 'Use the same commands and signals every time',
      icon: '🎯'
    },
    {
      title: 'End on Success',
      description: 'Always finish training with a successful command',
      icon: '✨'
    }
  ];

  const levels = [
    { id: 'beginner', label: 'Beginner', icon: BookOpen },
    { id: 'intermediate', label: 'Intermediate', icon: Target },
    { id: 'advanced', label: 'Advanced', icon: Trophy }
  ];

  const filteredPrograms = trainingPrograms.filter(program => 
    selectedLevel === 'all' || program.level === selectedLevel
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Training Hub</h1>
          <p className="text-muted-foreground">Professional training programs for every dog</p>
        </div>

        {/* Level Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => {
                const Icon = level.icon;
                return (
                  <Button
                    key={level.id}
                    variant={selectedLevel === level.id ? "default" : "outline"}
                    onClick={() => setSelectedLevel(level.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {level.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Training Programs */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Training Programs</h2>
            
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{program.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={program.level === 'beginner' ? 'secondary' : 
                                  program.level === 'intermediate' ? 'default' : 'destructive'}
                        >
                          {program.level}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {program.duration}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {program.rating}
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={program.completed > 0 ? "outline" : "default"}
                    >
                      {program.completed > 0 ? (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Continue
                        </>
                      ) : (
                        'Start Program'
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                  
                  {/* Progress */}
                  {program.completed > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{program.completed}/{program.lessons} lessons</span>
                      </div>
                      <Progress value={(program.completed / program.lessons) * 100} />
                    </div>
                  )}
                  
                  {/* Skills */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Skills you'll learn:</h4>
                    <div className="flex flex-wrap gap-1">
                      {program.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t">
                    <span>{program.enrolled} enrolled</span>
                    <span>{program.lessons} lessons</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Training Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickTips.map((tip, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tip.icon}</span>
                      <h4 className="text-sm font-medium">{tip.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">
                      {tip.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Today's Challenge */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Challenge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-medium">Perfect the "Stay" Command</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice holding the stay position for 30 seconds
                  </p>
                </div>
                <Button className="w-full" size="sm">
                  <Check className="w-4 h-4 mr-1" />
                  Mark Complete
                </Button>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievement</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-3xl">🏆</div>
                <h3 className="font-medium">First Command Mastered!</h3>
                <p className="text-sm text-muted-foreground">
                  Your dog successfully learned "Sit"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingHub;