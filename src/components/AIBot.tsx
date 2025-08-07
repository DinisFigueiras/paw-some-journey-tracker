import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Crown, 
  Send, 
  Sparkles, 
  MessageCircle, 
  Heart,
  Calendar,
  Stethoscope,
  PawPrint,
  Lock,
  Zap
} from 'lucide-react';

const AIBot = () => {
  const [isPremium] = useState(false); // This would come from user context
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: number;
    type: 'bot' | 'user';
    content: string;
    timestamp: Date;
    isPremiumRequired?: boolean;
  }>>([
    {
      id: 1,
      type: 'bot' as const,
      content: "Hi! I'm PawGo's AI Pet Coach! 🐕 I can help with training tips, health advice, and behavior questions. What would you like to know about your furry friend?",
      timestamp: new Date()
    }
  ]);

  const premiumFeatures = [
    {
      icon: Stethoscope,
      title: "Health Monitoring",
      description: "AI-powered health assessments and early warning alerts"
    },
    {
      icon: Calendar,
      title: "Training Schedule",
      description: "Personalized training plans based on your dog's breed and age"
    },
    {
      icon: Heart,
      title: "Behavior Analysis",
      description: "Deep insights into your dog's behavior patterns and mood"
    },
    {
      icon: PawPrint,
      title: "Breed Expertise",
      description: "Specialized advice tailored to your dog's specific breed"
    }
  ];

  const sampleQuestions = [
    "Why does my dog bark at strangers?",
    "How often should I feed my puppy?",
    "What's the best way to house train?",
    "My dog seems anxious, what can I do?"
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    
    if (!isPremium) {
      // Show upgrade prompt for non-premium users
      setMessages([...messages, 
        {
          id: messages.length + 1,
          type: 'user' as const,
          content: message,
          timestamp: new Date()
        },
        {
          id: messages.length + 2,
          type: 'bot' as const,
          content: "I'd love to help you with that! 🐾 For personalized AI coaching and unlimited questions, please upgrade to Premium. Free users get 3 questions per day.",
          timestamp: new Date(),
          isPremiumRequired: true
        }
      ]);
    } else {
      // Handle premium user message
      setMessages([...messages, 
        {
          id: messages.length + 1,
          type: 'user' as const,
          content: message,
          timestamp: new Date()
        }
      ]);
    }
    
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center mb-2">
            <Bot className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-xl font-bold text-foreground">AI Pet Coach</h1>
            {!isPremium && <Crown className="w-4 h-4 text-primary ml-2" />}
          </div>
          <p className="text-sm text-muted-foreground">
            {isPremium ? "Your personal AI trainer is ready!" : "Upgrade for unlimited AI coaching"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : msg.isPremiumRequired
                    ? 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20'
                    : 'bg-muted'
              }`}>
                {msg.type === 'bot' && (
                  <div className="flex items-center mb-1">
                    <Bot className="w-4 h-4 mr-1 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">AI Coach</span>
                    {msg.isPremiumRequired && <Sparkles className="w-3 h-3 ml-1 text-primary" />}
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
                {msg.isPremiumRequired && (
                  <Button size="sm" className="mt-2 w-full">
                    <Crown className="w-3 h-3 mr-1" />
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Sample Questions */}
          {messages.length === 1 && (
            <div className="space-y-3 mt-6">
              <h3 className="text-sm font-medium text-muted-foreground text-center">Try asking:</h3>
              <div className="space-y-2">
                {sampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-3 text-xs"
                    onClick={() => setMessage(question)}
                  >
                    <MessageCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Features (for non-premium users) */}
      {!isPremium && (
        <div className="max-w-md mx-auto p-4">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-center text-lg flex items-center justify-center">
                <Crown className="w-5 h-5 mr-2 text-primary" />
                Premium AI Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {premiumFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="text-center p-3 rounded-lg bg-background/50">
                      <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                      <h4 className="text-xs font-semibold text-foreground">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground bg-background/50 rounded-lg p-2">
                <Zap className="w-3 h-3 text-primary" />
                <span>Unlimited questions • 24/7 availability • Advanced insights</span>
              </div>
              <Button className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade for $5/month
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-background border-t border-border p-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isPremium ? "Ask me anything about your pet..." : "Ask me about your pet (3 free questions)"}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={!isPremium && messages.filter(m => m.type === 'user').length >= 3}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={!message.trim() || (!isPremium && messages.filter(m => m.type === 'user').length >= 3)}
              size="icon"
            >
              {!isPremium && messages.filter(m => m.type === 'user').length >= 3 ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          {!isPremium && (
            <div className="flex items-center justify-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {3 - messages.filter(m => m.type === 'user').length} free questions remaining
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBot;