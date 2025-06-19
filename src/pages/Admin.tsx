import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Code, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";

interface ApiData {
  id?: string;
  name: string;
  version: string;
  description: string;
  category: string;
  status: string;
  pricing_model: string;
  rate_limit: number;
  reliability: string;
  avg_response_time: string;
  rating: number;
  users: number;
  quick_start: string;
  quick_start_python: string;
  endpoint_method: string;
  endpoint_path: string;
  endpoint_parameters: any[];
  endpoint_example: string;
  endpoint_response: any;
  documentation_url: string;
  credits_required: number;
}

const Admin = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("js");
  const [formData, setFormData] = useState<ApiData>({
    name: "",
    version: "v1.0.0",
    description: "",
    category: "General",
    status: "active",
    pricing_model: "free",
    rate_limit: 1000,
    reliability: "99%",
    avg_response_time: "100ms",
    rating: 4.5,
    users: 0,
    quick_start: "",
    quick_start_python: "",
    endpoint_method: "GET",
    endpoint_path: "",
    endpoint_parameters: [],
    endpoint_example: "",
    endpoint_response: {},
    documentation_url: "",
    credits_required: 1
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
      category: "General",
      status: "active",
      pricing_model: "free",
      rate_limit: 1000,
      reliability: "99%",
      avg_response_time: "100ms",
      rating: 4.5,
      users: 0,
      quick_start: "",
      quick_start_python: "",
      endpoint_method: "GET",
      endpoint_path: "",
      endpoint_parameters: [],
      endpoint_example: "",
      endpoint_response: {},
      documentation_url: "",
      credits_required: 1
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
    setFormData({
      ...api,
      quick_start_python: api.quick_start_python || "",
      credits_required: api.credits_required || 1
    });
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="AI/ML">AI/ML</SelectItem>
                      <SelectItem value="Data">Data</SelectItem>
                      <SelectItem value="Payment">Payment</SelectItem>
                      <SelectItem value="Social">Social</SelectItem>
                      <SelectItem value="Communication">Communication</SelectItem>
                      <SelectItem value="Utility">Utility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="beta">Beta</SelectItem>
                      <SelectItem value="deprecated">Deprecated</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pricing_model">Pricing Model</Label>
                  <Select value={formData.pricing_model} onValueChange={(value) => setFormData({ ...formData, pricing_model: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rate_limit">Rate Limit (per hour)</Label>
                  <Input
                    id="rate_limit"
                    type="number"
                    value={formData.rate_limit}
                    onChange={(e) => setFormData({ ...formData, rate_limit: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="credits_required">Credits Required</Label>
                  <Input
                    id="credits_required"
                    type="number"
                    min="1"
                    value={formData.credits_required}
                    onChange={(e) => setFormData({ ...formData, credits_required: parseInt(e.target.value) })}
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
                <Label htmlFor="documentation_url">Documentation URL</Label>
                <Input
                  id="documentation_url"
                  type="url"
                  value={formData.documentation_url}
                  onChange={(e) => setFormData({ ...formData, documentation_url: e.target.value })}
                  placeholder="https://docs.example.com"
                />
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="users">Users</Label>
                  <Input
                    id="users"
                    type="number"
                    value={formData.users}
                    onChange={(e) => setFormData({ ...formData, users: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {/* Quick Start Guides */}
              <div>
                <Label>Quick Start Guides</Label>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                  <TabsList>
                    <TabsTrigger value="js" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      JavaScript
                    </TabsTrigger>
                    <TabsTrigger value="python" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Python
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="js">
                    <Textarea
                      value={formData.quick_start}
                      onChange={(e) => setFormData({ ...formData, quick_start: e.target.value })}
                      rows={6}
                      placeholder="Enter JavaScript/Node.js code example..."
                    />
                  </TabsContent>
                  <TabsContent value="python">
                    <Textarea
                      value={formData.quick_start_python}
                      onChange={(e) => setFormData({ ...formData, quick_start_python: e.target.value })}
                      rows={6}
                      placeholder="Enter Python code example..."
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Endpoint Configuration */}
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
                      <SelectItem value="PATCH">PATCH</SelectItem>
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

              <div>
                <Label htmlFor="endpoint_response">Response Structure (JSON)</Label>
                <Textarea
                  id="endpoint_response"
                  value={typeof formData.endpoint_response === 'string' ? formData.endpoint_response : JSON.stringify(formData.endpoint_response, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setFormData({ ...formData, endpoint_response: parsed });
                    } catch {
                      setFormData({ ...formData, endpoint_response: e.target.value });
                    }
                  }}
                  rows={4}
                  placeholder='{"message": "Success", "data": {...}}'
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
            <CardTitle>Existing APIs ({apis.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading APIs...</p>
            ) : apis.length === 0 ? (
              <p className="text-gray-500">No APIs found. Create your first API above.</p>
            ) : (
              <div className="space-y-4">
                {apis.map((api: any) => (
                  <div key={api.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{api.name}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded">
                            {api.version}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            api.status === 'active' ? 'bg-green-100 text-green-800' :
                            api.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                            api.status === 'deprecated' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {api.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{api.description}</p>
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
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-500">
                      <span>Category: {api.category}</span>
                      <span>Users: {api.users}</span>
                      <span>Reliability: {api.reliability}</span>
                      <span>Response: {api.avg_response_time}</span>
                      <span>Credits: {api.credits_required || 1}</span>
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
