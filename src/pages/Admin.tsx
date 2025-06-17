
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";

interface ApiData {
  id?: string;
  name: string;
  version: string;
  description: string;
  reliability: string;
  avg_response_time: string;
  rating: number;
  users: number;
  quick_start: string;
  endpoint_method: string;
  endpoint_path: string;
  endpoint_parameters: any[];
  endpoint_example: string;
  endpoint_response: any;
}

const Admin = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<ApiData>({
    name: "",
    version: "v1.0.0",
    description: "",
    reliability: "99%",
    avg_response_time: "100ms",
    rating: 4.5,
    users: 0,
    quick_start: "",
    endpoint_method: "GET",
    endpoint_path: "",
    endpoint_parameters: [],
    endpoint_example: "",
    endpoint_response: {}
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: apis = [], isLoading } = useQuery({
    queryKey: ['apis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createApiMutation = useMutation({
    mutationFn: async (newApi: ApiData) => {
      const { data, error } = await supabase
        .from('apis')
        .insert([newApi])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis'] });
      resetForm();
      toast({
        title: "Success",
        description: "API created successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create API: " + error.message,
        variant: "destructive"
      });
    }
  });

  const updateApiMutation = useMutation({
    mutationFn: async ({ id, ...updates }: ApiData & { id: string }) => {
      const { data, error } = await supabase
        .from('apis')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis'] });
      setIsEditing(null);
      resetForm();
      toast({
        title: "Success",
        description: "API updated successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update API: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteApiMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('apis')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis'] });
      toast({
        title: "Success",
        description: "API deleted successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete API: " + error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      version: "v1.0.0",
      description: "",
      reliability: "99%",
      avg_response_time: "100ms",
      rating: 4.5,
      users: 0,
      quick_start: "",
      endpoint_method: "GET",
      endpoint_path: "",
      endpoint_parameters: [],
      endpoint_example: "",
      endpoint_response: {}
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateApiMutation.mutate({ ...formData, id: isEditing });
    } else {
      createApiMutation.mutate(formData);
    }
  };

  const handleEdit = (api: any) => {
    setFormData(api);
    setIsEditing(api.id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this API?")) {
      deleteApiMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Admin Panel</h1>
          <p className="text-gray-600">Manage APIs in the marketplace</p>
        </div>

        {/* API Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {isEditing ? "Edit API" : "Add New API"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">API Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reliability">Reliability</Label>
                  <Input
                    id="reliability"
                    value={formData.reliability}
                    onChange={(e) => setFormData({ ...formData, reliability: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="avg_response_time">Avg Response Time</Label>
                  <Input
                    id="avg_response_time"
                    value={formData.avg_response_time}
                    onChange={(e) => setFormData({ ...formData, avg_response_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="users">Users</Label>
                  <Input
                    id="users"
                    type="number"
                    value={formData.users}
                    onChange={(e) => setFormData({ ...formData, users: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="quick_start">Quick Start Guide</Label>
                <Textarea
                  id="quick_start"
                  value={formData.quick_start}
                  onChange={(e) => setFormData({ ...formData, quick_start: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endpoint_method">Endpoint Method</Label>
                  <Select value={formData.endpoint_method} onValueChange={(value) => setFormData({ ...formData, endpoint_method: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="endpoint_path">Endpoint Path</Label>
                  <Input
                    id="endpoint_path"
                    value={formData.endpoint_path}
                    onChange={(e) => setFormData({ ...formData, endpoint_path: e.target.value })}
                    placeholder="/api/v1/users"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endpoint_example">Endpoint Example</Label>
                <Textarea
                  id="endpoint_example"
                  value={formData.endpoint_example}
                  onChange={(e) => setFormData({ ...formData, endpoint_example: e.target.value })}
                  rows={2}
                  placeholder="curl -X GET https://api.example.com/v1/users"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createApiMutation.isPending || updateApiMutation.isPending}>
                  {isEditing ? "Update API" : "Create API"}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={() => {
                    setIsEditing(null);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* APIs List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing APIs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading APIs...</p>
            ) : apis.length === 0 ? (
              <p className="text-gray-500">No APIs found. Create your first API above.</p>
            ) : (
              <div className="space-y-4">
                {apis.map((api: any) => (
                  <div key={api.id} className="border rounded-lg p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{api.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{api.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Version: {api.version}</span>
                        <span>Rating: {api.rating}/5</span>
                        <span>Users: {api.users}</span>
                        <span>Reliability: {api.reliability}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(api)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(api.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
