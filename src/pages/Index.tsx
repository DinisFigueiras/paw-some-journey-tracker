import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';
import PetProfile from '@/components/PetProfile';
import WalkTracker from '@/components/WalkTracker';
import HealthTracker from '@/components/HealthTracker';
import Milestones from '@/components/Milestones';
import Explorer from '@/components/Explorer';
import TrainingHub from '@/components/TrainingHub';
import Rewards from '@/components/Rewards';
import AIBot from '@/components/AIBot';
import Leaderboard from '@/components/Leaderboard';
import Community from '@/components/Community';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home, 
  User, 
  MapPin, 
  Heart, 
  Trophy, 
  Compass, 
  GraduationCap, 
  Gift, 
  Bot,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import pawgoLogo from '@/assets/pawgo-mascot.png';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'walks', label: 'Walks', icon: MapPin },
    { id: 'profile', label: 'My Pets', icon: User },
    { id: 'explorer', label: 'Explore', icon: Compass },
    { id: 'community', label: 'Community', icon: BarChart3 },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'ai', label: 'AI Coach', icon: Bot, isPremium: true },
    { id: 'milestones', label: 'Milestones', icon: Trophy }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'profile': return <PetProfile />;
      case 'walks': return <WalkTracker />;
      case 'health': return <HealthTracker />;
      case 'milestones': return <Milestones />;
      case 'explorer': return <Explorer />;
      case 'training': return <TrainingHub />;
      case 'rewards': return <Rewards />;
      case 'ai': return <AIBot />;
      case 'community': return <Community />;
      case 'leaderboard': return <Leaderboard />;
      default: return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <img src={pawgoLogo} alt="Loading" className="w-16 h-16 mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading PawGo...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-amber-200 p-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-2 ${
                  isActive ? 'text-amber-600' : 'text-gray-600'
                }`}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-gray-400'}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
