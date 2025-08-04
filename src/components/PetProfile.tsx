import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera, Plus, Edit, Trash2, Heart, Weight, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  breed: z.string().min(1, 'Breed is required'),
  birth_date: z.string().min(1, 'Birth date is required'),
  gender: z.string().min(1, 'Gender is required'),
  weight_value: z.string().optional(),
  weight_unit: z.string().optional(),
  photo_url: z.string().optional(),
});

type PetForm = z.infer<typeof petSchema>;

interface Pet {
  id: string;
  name: string;
  breed: string;
  birth_date: string;
  gender: string;
  weight_value: number;
  weight_unit: string;
  photo_url: string;
  created_at: string;
}

export default function PetProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<PetForm>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      breed: '',
      birth_date: '',
      gender: '',
      weight_value: '',
      weight_unit: 'kg',
      photo_url: '',
    },
  });

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (editingPet) {
      form.reset({
        name: editingPet.name,
        breed: editingPet.breed,
        birth_date: editingPet.birth_date,
        gender: editingPet.gender,
        weight_value: editingPet.weight_value?.toString() || '',
        weight_unit: editingPet.weight_unit || 'kg',
        photo_url: editingPet.photo_url || '',
      });
      setIsFormOpen(true);
    }
  }, [editingPet, form]);

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('profile_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pets',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: PetForm) => {
    setLoading(true);
    try {
      const petData = {
        profile_id: user?.id,
        name: data.name,
        breed: data.breed,
        birth_date: data.birth_date,
        gender: data.gender,
        weight_value: data.weight_value ? parseFloat(data.weight_value) : null,
        weight_unit: data.weight_unit || null,
        photo_url: data.photo_url || null,
      };

      if (editingPet) {
        const { error } = await supabase
          .from('pets')
          .update(petData)
          .eq('id', editingPet.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Pet profile updated successfully!',
        });
      } else {
        const { error } = await supabase
          .from('pets')
          .insert(petData);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Pet profile created successfully!',
        });
      }

      form.reset();
      setEditingPet(null);
      setIsFormOpen(false);
      fetchPets();
    } catch (error) {
      console.error('Error saving pet:', error);
      toast({
        title: 'Error',
        description: 'Failed to save pet profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId: string) => {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Pet profile deleted successfully',
      });
      fetchPets();
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete pet profile',
        variant: 'destructive',
      });
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = Math.floor(diffDays / 365);
    const diffMonths = Math.floor((diffDays % 365) / 30);

    if (diffYears > 0) {
      return `${diffYears} year${diffYears !== 1 ? 's' : ''} ${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    } else {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Pet Profiles</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Add New Pet Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Furry Friends</h2>
          <Button
            onClick={() => {
              setEditingPet(null);
              form.reset();
              setIsFormOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Pet
          </Button>
        </div>

        {/* Pet Form */}
        {isFormOpen && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingPet ? 'Edit Pet Profile' : 'Add New Pet'}
              </CardTitle>
              <CardDescription>
                {editingPet 
                  ? 'Update your pet\'s information'
                  : 'Fill in your pet\'s details to create their profile'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter pet's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breed</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter breed" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birth_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter weight"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight_unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight Unit</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kg">Kilograms</SelectItem>
                              <SelectItem value="lbs">Pounds</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="photo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter photo URL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : editingPet ? 'Update Pet' : 'Add Pet'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsFormOpen(false);
                        setEditingPet(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Pets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    {pet.photo_url ? (
                      <img
                        src={pet.photo_url}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingPet(pet)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePet(pet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{pet.name}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>{pet.breed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{calculateAge(pet.birth_date)} old</span>
                    </div>
                    {pet.weight_value && (
                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4" />
                        <span>{pet.weight_value} {pet.weight_unit}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {pets.length === 0 && !isFormOpen && (
          <Card className="text-center p-8">
            <CardContent>
              <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No pets yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first pet to get started with PawGo
              </p>
              <Button
                onClick={() => {
                  setEditingPet(null);
                  form.reset();
                  setIsFormOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Pet
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}