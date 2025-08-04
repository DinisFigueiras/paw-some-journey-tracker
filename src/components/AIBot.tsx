import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Heart, Lightbulb, HelpCircle, Zap } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: string;
}

const AIBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hi there! I\'m PawPal, your AI dog care assistant. I can help you with training tips, health advice, behavior guidance, and answer any questions about your furry friend! What would you like to know?',
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    { text: 'How often should I walk my dog?', category: 'exercise' },
    { text: 'My dog is pulling on the leash', category: 'training' },
    { text: 'Best training treats for puppies?', category: 'nutrition' },
    { text: 'How to stop excessive barking?', category: 'behavior' },
    { text: 'Signs of a healthy dog', category: 'health' },
    { text: 'Puppy potty training tips', category: 'training' }
  ];

  const botResponses = {
    'walk': 'Most dogs need at least 30 minutes to 2 hours of exercise daily, depending on their breed, age, and energy level. Active breeds like Border Collies need more exercise, while smaller or older dogs may need less. Regular walks help maintain physical health and mental stimulation!',
    'leash': 'Leash pulling is common! Try these tips: 1) Stop moving when they pull, 2) Use positive reinforcement when they walk beside you, 3) Keep treats handy for rewards, 4) Consider a front-clip harness. Consistency is key - it may take a few weeks to see improvement.',
    'treats': 'For puppies, look for small, soft treats that are easy to chew and digest. Good options include freeze-dried liver, small training treats, or even small pieces of cooked chicken. Avoid treats with artificial colors or excessive salt. The treat should be small enough to eat quickly during training.',
    'bark': 'Excessive barking can be managed through: 1) Identifying the trigger (boredom, anxiety, territorial), 2) Providing mental stimulation with puzzle toys, 3) Teaching the "quiet" command, 4) Ensuring adequate exercise. If barking persists, consider consulting a professional trainer.',
    'health': 'Signs of a healthy dog include: clear, bright eyes; clean ears without odor; healthy appetite; regular bathroom habits; good energy levels; shiny coat; pink gums; and normal body temperature (101-102.5°F). Regular vet checkups are essential for preventive care!',
    'potty': 'Puppy potty training tips: 1) Take them out frequently (every 2-3 hours), 2) Always go out after meals, naps, and play, 3) Praise and treat immediately after they go outside, 4) Clean accidents thoroughly with enzyme cleaner, 5) Be patient - it takes 4-6 months on average!'
  };

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let response = "I'd be happy to help with that! While I don't have specific information about that topic in my current knowledge base, I recommend consulting with your veterinarian or a certified dog trainer for personalized advice. Is there anything else I can help you with?";
      
      // Simple keyword matching for demo purposes
      const lowerMessage = userMessage.toLowerCase();
      if (lowerMessage.includes('walk') || lowerMessage.includes('exercise')) {
        response = botResponses.walk;
      } else if (lowerMessage.includes('leash') || lowerMessage.includes('pull')) {
        response = botResponses.leash;
      } else if (lowerMessage.includes('treat') || lowerMessage.includes('food')) {
        response = botResponses.treats;
      } else if (lowerMessage.includes('bark') || lowerMessage.includes('noise')) {
        response = botResponses.bark;
      } else if (lowerMessage.includes('health') || lowerMessage.includes('sick')) {
        response = botResponses.health;
      } else if (lowerMessage.includes('potty') || lowerMessage.includes('toilet') || lowerMessage.includes('house')) {
        response = botResponses.potty;
      }

      const botMessage: Message = {
        id: messages.length + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        category: 'response'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    simulateBotResponse(inputMessage);
    setInputMessage('');
  };

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    simulateBotResponse(question);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'exercise': return '🏃';
      case 'training': return '🎓';
      case 'nutrition': return '🍖';
      case 'behavior': return '🐕';
      case 'health': return '❤️';
      default: return '💡';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">PawPal AI</h1>
          </div>
          <p className="text-muted-foreground">Your intelligent dog care assistant</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  Chat with PawPal
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[450px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.type === 'bot' && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        {message.type === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Input Section */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me anything about your dog..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => handleQuickQuestion(question.text)}
                  >
                    <span className="mr-2">{getCategoryIcon(question.category)}</span>
                    <span className="text-xs">{question.text}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  What I Can Help With
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Health & Wellness</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Behavior Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Training Tips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-sm">Personalized Advice</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">
                  <strong>Disclaimer:</strong> PawPal provides general information and tips. 
                  For medical emergencies or serious health concerns, always consult 
                  with a licensed veterinarian.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBot;