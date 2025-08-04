import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  MapPin, 
  Clock, 
  TrendingUp,
  PawPrint,
  Save,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Pet {
  id: string;
  name: string;
  breed: string;
}

interface WalkLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
}

export default function WalkTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [walkData, setWalkData] = useState({
    distance: 0,
    duration: 0,
    startTime: null as Date | null,
    endTime: null as Date | null,
    title: '',
    description: '',
    notes: '',
  });
  const [locations, setLocations] = useState<WalkLocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [saving, setSaving] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPets();
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('id, name, breed')
        .eq('profile_id', user?.id);

      if (error) throw error;
      setPets(data || []);
      if (data && data.length > 0) {
        setSelectedPet(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      });
    });
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const startWalk = async () => {
    if (!selectedPet) {
      toast({
        title: 'Error',
        description: 'Please select a pet first',
        variant: 'destructive',
      });
      return;
    }

    try {
      const position = await getCurrentLocation();
      const startLocation: WalkLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now(),
        accuracy: position.coords.accuracy,
      };

      setLocations([startLocation]);
      setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      setWalkData({
        ...walkData,
        startTime: new Date(),
        distance: 0,
        duration: 0,
      });
      setIsTracking(true);
      setIsPaused(false);

      // Start watching position
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          if (!isPaused) {
            const newLocation: WalkLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date.now(),
              accuracy: position.coords.accuracy,
            };

            setLocations(prev => {
              const updated = [...prev, newLocation];
              
              // Calculate total distance
              let totalDistance = 0;
              for (let i = 1; i < updated.length; i++) {
                totalDistance += calculateDistance(
                  updated[i-1].latitude,
                  updated[i-1].longitude,
                  updated[i].latitude,
                  updated[i].longitude
                );
              }

              setWalkData(prev => ({ ...prev, distance: totalDistance }));
              return updated;
            });

            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to get your location. Please check your GPS settings.',
            variant: 'destructive',
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 5000,
        }
      );

      // Start duration timer
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setWalkData(prev => ({
            ...prev,
            duration: Date.now() - (prev.startTime?.getTime() || Date.now()),
          }));
        }
      }, 1000);

      toast({
        title: 'Walk Started!',
        description: 'Your walk tracking has begun',
      });

    } catch (error) {
      console.error('Error starting walk:', error);
      toast({
        title: 'Error',
        description: 'Could not start walk tracking. Please check location permissions.',
        variant: 'destructive',
      });
    }
  };

  const pauseWalk = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? 'Walk Resumed' : 'Walk Paused',
      description: isPaused ? 'Tracking resumed' : 'Tracking paused',
    });
  };

  const stopWalk = () => {
    setIsTracking(false);
    setIsPaused(false);
    setWalkData(prev => ({ ...prev, endTime: new Date() }));

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    toast({
      title: 'Walk Stopped',
      description: 'You can now save your walk or start a new one',
    });
  };

  const saveWalk = async () => {
    if (!selectedPet || !walkData.startTime) {
      toast({
        title: 'Error',
        description: 'Invalid walk data',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      // Save walk
      const { data: walk, error: walkError } = await supabase
        .from('walks')
        .insert({
          user_id: user?.id,
          pet_id: selectedPet,
          start_time: walkData.startTime.toISOString(),
          end_time: walkData.endTime?.toISOString() || new Date().toISOString(),
          duration: Math.floor(walkData.duration / 1000), // Convert to seconds
          distance: walkData.distance,
          title: walkData.title || `Walk with ${pets.find(p => p.id === selectedPet)?.name}`,
          description: walkData.description,
          notes: walkData.notes,
          route_data: {
            locations: locations as any,
            startLocation: locations[0] as any,
            endLocation: locations[locations.length - 1] as any,
          } as any,
        })
        .select('id')
        .single();

      if (walkError) throw walkError;

      // Save locations
      if (walk && locations.length > 0) {
        const locationData = locations.map(loc => ({
          walk_id: walk.id,
          latitude: loc.latitude,
          longitude: loc.longitude,
          accuracy: loc.accuracy || null,
          timestamp: new Date(loc.timestamp).toISOString(),
        }));

        const { error: locError } = await supabase
          .from('walk_locations')
          .insert(locationData);

        if (locError) throw locError;
      }

      toast({
        title: 'Walk Saved!',
        description: 'Your walk has been saved successfully',
      });

      // Reset state
      setWalkData({
        distance: 0,
        duration: 0,
        startTime: null,
        endTime: null,
        title: '',
        description: '',
        notes: '',
      });
      setLocations([]);
      setCurrentLocation(null);

    } catch (error) {
      console.error('Error saving walk:', error);
      toast({
        title: 'Error',
        description: 'Failed to save walk',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(2)} km`;
    }
    return `${distance.toFixed(0)} m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Walk Tracker</h1>
            {isTracking && (
              <Badge variant={isPaused ? "secondary" : "default"} className="ml-auto">
                {isPaused ? 'Paused' : 'Tracking'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Pet Selection */}
        {!isTracking && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your Walking Buddy</CardTitle>
              <CardDescription>Choose which pet you're walking with</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedPet} onValueChange={setSelectedPet}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} ({pet.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Walk Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{formatDistance(walkData.distance)}</p>
              <p className="text-sm text-muted-foreground">Distance</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{formatDuration(walkData.duration)}</p>
              <p className="text-sm text-muted-foreground">Duration</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{locations.length}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </CardContent>
          </Card>
        </div>

        {/* Map Placeholder */}
        <Card>
          <CardContent className="p-4">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {currentLocation 
                    ? `Current: ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`
                    : 'Map view will appear here when tracking starts'
                  }
                </p>
                {locations.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {locations.length} GPS points recorded
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 justify-center">
              {!isTracking ? (
                <Button
                  onClick={startWalk}
                  size="lg"
                  className="gap-2 px-8"
                  disabled={!selectedPet}
                >
                  <Play className="h-5 w-5" />
                  Start Walk
                </Button>
              ) : (
                <>
                  <Button
                    onClick={pauseWalk}
                    variant="secondary"
                    size="lg"
                    className="gap-2"
                  >
                    {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    onClick={stopWalk}
                    variant="destructive"
                    size="lg"
                    className="gap-2"
                  >
                    <Square className="h-5 w-5" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Walk Summary Form (shown after stopping) */}
        {!isTracking && walkData.endTime && (
          <Card>
            <CardHeader>
              <CardTitle>Save Your Walk</CardTitle>
              <CardDescription>Add details about your walk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Walk Title</label>
                <Input
                  placeholder="e.g., Morning park walk"
                  value={walkData.title}
                  onChange={(e) => setWalkData({...walkData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Brief description of the walk"
                  value={walkData.description}
                  onChange={(e) => setWalkData({...walkData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Any additional notes about the walk..."
                  value={walkData.notes}
                  onChange={(e) => setWalkData({...walkData, notes: e.target.value})}
                />
              </div>
              <Button
                onClick={saveWalk}
                disabled={saving}
                className="w-full gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Walk'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* GPS Permission Notice */}
        {!isTracking && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Location Permission Required
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Please allow location access when prompted to track your walks accurately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State for No Pets */}
        {pets.length === 0 && (
          <Card className="text-center p-8">
            <CardContent>
              <PawPrint className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No pets found</h3>
              <p className="text-muted-foreground mb-6">
                Add a pet profile first to start tracking walks
              </p>
              <Button variant="outline">
                Go to Pet Profiles
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}