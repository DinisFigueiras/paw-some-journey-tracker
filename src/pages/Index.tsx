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
import pawgoMascot from '@/assets/pawgo-mascot.png';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Pet Profile', icon: User },
    { id: 'walks', label: 'Walk Tracker', icon: MapPin },
    { id: 'health', label: 'Health Tracker', icon: Heart },
    { id: 'milestones', label: 'Milestones', icon: Trophy },
    { id: 'explorer', label: 'Explorer', icon: Compass },
    { id: 'training', label: 'Training Hub', icon: GraduationCap },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 }
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
      case 'leaderboard': return <Leaderboard />;
      default: return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <img src={pawgoMascot} alt="Loading" className="w-16 h-16 mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading PawGo...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <img src={pawgoMascot} alt="PawGo" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-primary">PawGo</h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Signed in as {user.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card border-b p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <img src={pawgoMascot} alt="PawGo" className="w-6 h-6" />
            <h1 className="text-lg font-bold text-primary">PawGo</h1>
          </div>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
