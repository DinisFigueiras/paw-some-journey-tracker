import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Users, MapPin, Trophy, Sparkles } from 'lucide-react';
import pawgoMascot from '@/assets/pawgo-mascot.png';

const AuthScreen = () => {
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signUp(email, password, email.split('@')[0]); // Use email prefix as username
    } catch (err: any) {
      setError(err.message);
    }
  };

  const features = [
    { icon: Heart, title: "Health Tracking", desc: "Monitor your dog's wellness" },
    { icon: MapPin, title: "GPS Walks", desc: "Track every adventure" },
    { icon: Users, title: "Community", desc: "Connect with dog parents" },
    { icon: Trophy, title: "Achievements", desc: "Celebrate milestones" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/10 to-accent/10 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="text-center mb-8 max-w-md">
          <div className="relative mb-6">
            <img 
              src={pawgoMascot} 
              alt="PawGo Mascot" 
              className="w-20 h-20 mx-auto mb-4 animate-bounce"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to PawGo</h1>
          <p className="text-muted-foreground text-lg">Track your dog's life, every step of the way</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md w-full">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-xl p-4 text-center border border-border/50">
                <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Auth Card */}
        <Card className="w-full max-w-md border-border/50 shadow-xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-foreground">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                  {error && <p className="text-destructive text-sm">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full h-12 text-base">
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                  {error && <p className="text-destructive text-sm">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full h-12 text-base">
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground max-w-md">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;