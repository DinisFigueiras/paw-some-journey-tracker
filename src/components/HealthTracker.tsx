import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Heart, 
  Syringe, 
  Pill, 
  Stethoscope, 
  Plus, 
  Bell,
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Pet {
  id: string;
  name: string;
  breed: string;
}

interface HealthRecord {
  id: string;
  pet_id: string;
  type: 'vaccination' | 'medication' | 'vet_visit' | 'weight_check';
  title: string;
  description: string;
  date: string;
  next_due_date?: string;
  status: 'completed' | 'upcoming' | 'overdue';
  reminder_days: number;
}

export default function HealthTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'vaccination' as const,
    title: '',
    description: '',
    date: new Date(),
    next_due_date: null as Date | null,
    reminder_days: 7,
  });

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      fetchHealthRecords();
    }
  }, [selectedPet]);

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

  const fetchHealthRecords = async () => {
    // For now, we'll use mock data since we don't have a health_records table
    // In a real implementation, you would create this table and fetch from it
    const mockRecords: HealthRecord[] = [
      {
        id: '1',
        pet_id: selectedPet,
        type: 'vaccination',
        title: 'Annual Vaccination',
        description: 'DHPP vaccine administered',
        date: '2024-01-15',
        next_due_date: '2025-01-15',
        status: 'completed',
        reminder_days: 14,
      },
      {
        id: '2',
        pet_id: selectedPet,
        type: 'vet_visit',
        title: 'Regular Checkup',
        description: 'Routine health examination',
        date: '2024-06-20',
        next_due_date: '2024-12-20',
        status: 'upcoming',
        reminder_days: 7,
      },
      {
        id: '3',
        pet_id: selectedPet,
        type: 'medication',
        title: 'Flea Prevention',
        description: 'Monthly flea and tick prevention',
        date: '2024-07-01',
        next_due_date: '2024-08-01',
        status: 'overdue',
        reminder_days: 3,
      },
    ];

    // Calculate status based on dates
    const now = new Date();
    const recordsWithStatus = mockRecords.map(record => {
      if (!record.next_due_date) return record;
      
      const dueDate = parseISO(record.next_due_date);
      const reminderDate = addDays(dueDate, -record.reminder_days);
      
      let status: 'completed' | 'upcoming' | 'overdue';
      if (isAfter(now, dueDate)) {
        status = 'overdue';
      } else if (isAfter(now, reminderDate)) {
        status = 'upcoming';
      } else {
        status = 'completed';
      }
      
      return { ...record, status };
    });

    setHealthRecords(recordsWithStatus);
  };

  const addHealthRecord = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would save to the database
      const newId = Date.now().toString();
      const record: HealthRecord = {
        id: newId,
        pet_id: selectedPet,
        type: newRecord.type,
        title: newRecord.title,
        description: newRecord.description,
        date: format(newRecord.date, 'yyyy-MM-dd'),
        next_due_date: newRecord.next_due_date ? format(newRecord.next_due_date, 'yyyy-MM-dd') : undefined,
        status: 'completed',
        reminder_days: newRecord.reminder_days,
      };

      setHealthRecords(prev => [record, ...prev]);
      setShowAddDialog(false);
      setNewRecord({
        type: 'vaccination',
        title: '',
        description: '',
        date: new Date(),
        next_due_date: null,
        reminder_days: 7,
      });

      toast({
        title: 'Success',
        description: 'Health record added successfully',
      });
    } catch (error) {
      console.error('Error adding health record:', error);
      toast({
        title: 'Error',
        description: 'Failed to add health record',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'upcoming':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'upcoming':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Due Soon</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="h-5 w-5" />;
      case 'medication':
        return <Pill className="h-5 w-5" />;
      case 'vet_visit':
        return <Stethoscope className="h-5 w-5" />;
      case 'weight_check':
        return <Heart className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  const upcomingRecords = healthRecords.filter(r => r.status === 'upcoming' || r.status === 'overdue');
  const overdueRecords = healthRecords.filter(r => r.status === 'overdue');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Health Tracker</h1>
            {overdueRecords.length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {overdueRecords.length} Overdue
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Pet Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Health Dashboard</span>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Health Record</DialogTitle>
                    <DialogDescription>
                      Add a new health record for your pet
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={newRecord.type} onValueChange={(value: any) => setNewRecord({...newRecord, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="vet_visit">Vet Visit</SelectItem>
                          <SelectItem value="weight_check">Weight Check</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="e.g., Annual Vaccination"
                        value={newRecord.title}
                        onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Additional details..."
                        value={newRecord.description}
                        onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Calendar
                        mode="single"
                        selected={newRecord.date}
                        onSelect={(date) => date && setNewRecord({...newRecord, date})}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Next Due Date (Optional)</label>
                      <Calendar
                        mode="single"
                        selected={newRecord.next_due_date}
                        onSelect={(date) => setNewRecord({...newRecord, next_due_date: date})}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reminder Days Before</label>
                      <Input
                        type="number"
                        value={newRecord.reminder_days}
                        onChange={(e) => setNewRecord({...newRecord, reminder_days: parseInt(e.target.value) || 7})}
                      />
                    </div>
                    <Button onClick={addHealthRecord} disabled={loading || !newRecord.title}>
                      {loading ? 'Adding...' : 'Add Record'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
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

        {/* Alerts */}
        {upcomingRecords.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Bell className="h-5 w-5" />
                Health Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-white dark:bg-yellow-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(record.type)}
                      <div>
                        <p className="font-medium">{record.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {record.next_due_date ? format(parseISO(record.next_due_date), 'MMM dd, yyyy') : 'No date set'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Records */}
        <Card>
          <CardHeader>
            <CardTitle>Health History</CardTitle>
            <CardDescription>
              Complete health record for {pets.find(p => p.id === selectedPet)?.name || 'your pet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthRecords.map((record) => (
                <div key={record.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="p-2 rounded-full bg-primary/10">
                    {getTypeIcon(record.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{record.title}</h4>
                        <p className="text-sm text-muted-foreground">{record.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {format(parseISO(record.date), 'MMM dd, yyyy')}
                          </span>
                          {record.next_due_date && (
                            <span className="flex items-center gap-1">
                              <Bell className="h-4 w-4" />
                              Next: {format(parseISO(record.next_due_date), 'MMM dd, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {healthRecords.length === 0 && (
                <div className="text-center py-8">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No health records yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start tracking your pet's health by adding their first record
                  </p>
                  <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Record
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {healthRecords.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Syringe className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {healthRecords.filter(r => r.type === 'vaccination').length}
                </p>
                <p className="text-sm text-muted-foreground">Vaccinations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Stethoscope className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {healthRecords.filter(r => r.type === 'vet_visit').length}
                </p>
                <p className="text-sm text-muted-foreground">Vet Visits</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Pill className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {healthRecords.filter(r => r.type === 'medication').length}
                </p>
                <p className="text-sm text-muted-foreground">Medications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {upcomingRecords.length}
                </p>
                <p className="text-sm text-muted-foreground">Due Soon</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State for No Pets */}
        {pets.length === 0 && (
          <Card className="text-center p-8">
            <CardContent>
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No pets found</h3>
              <p className="text-muted-foreground mb-6">
                Add a pet profile first to start tracking their health
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