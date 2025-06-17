
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Filter, Star, Users, Zap, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const { data: apis = [], isLoading, error } = useQuery({
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

  const filteredAPIs = apis
    .filter(api => 
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (api.description && api.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "users":
          return (b.users || 0) - (a.users || 0);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading APIs</h1>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Explore APIs</h1>
          <p className="text-xl text-gray-600">Discover and integrate powerful APIs for your projects</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search APIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="rating">Sort by Rating</SelectItem>
              <SelectItem value="users">Sort by Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{apis.length}</p>
                <p className="text-gray-600 text-sm">Total APIs</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">
                  {apis.filter(api => parseFloat(api.reliability?.replace('%', '') || '0') >= 99).length}
                </p>
                <p className="text-gray-600 text-sm">High Reliability</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">
                  {apis.reduce((sum, api) => sum + (api.users || 0), 0).toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">Total Users</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* APIs Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading APIs...</p>
          </div>
        ) : filteredAPIs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm ? `No APIs found matching "${searchTerm}"` : "No APIs available yet."}
            </p>
            {!searchTerm && (
              <p className="text-gray-500 mt-2">
                Visit the admin panel to add your first API.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAPIs.map((api) => (
              <Card key={api.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{api.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {api.description || "No description available"}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{api.version}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{api.rating || 0}/5</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{(api.users || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Reliability:</span>
                        <p className="font-medium">{api.reliability || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Response:</span>
                        <p className="font-medium">{api.avg_response_time || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <Link to={`/api/${api.id}`} className="block">
                      <Button className="w-full mt-4">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
