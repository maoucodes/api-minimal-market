
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Filter, Star, Users, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface ApiData {
  name: string;
  version: string;
  description: string;
  reliability: string;
  avg_response_time: string;
  rating: number;
  users: number;
  last_updated: string;
  quick_start: string;
  endpoint: {
    method: string;
    path: string;
    parameters: Array<{
      name: string;
      type: string;
      location: string;
      required: string;
    }>;
    example: string;
    response: {
      status: string;
      error: string;
    };
  };
}

const fetchApis = async (): Promise<ApiData[]> => {
  const response = await fetch('http://127.0.0.1:8000/api/explore');
  if (!response.ok) {
    throw new Error('Failed to fetch APIs');
  }
  return response.json();
};

const Explore = () => {
  const { data: apis, isLoading, error } = useQuery({
    queryKey: ['apis'],
    queryFn: fetchApis,
  });

  const categories = [
    "All APIs",
    "AI & ML",
    "Finance",
    "Weather",
    "Social Media",
    "E-commerce",
    "Maps & Location",
    "Communication"
  ];

  const formatUsers = (users: number) => {
    if (users >= 1000) {
      return `${(users / 1000).toFixed(1)}k`;
    }
    return users.toString();
  };

  const getApiSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Explore APIs</h1>
          <p className="text-gray-600">Discover and integrate powerful APIs into your applications.</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search APIs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                      index === 0
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* API Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {isLoading ? "Loading..." : error ? "Error loading APIs" : `${apis?.length || 0} APIs found`}
              </p>
              <select className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black">
                <option>Sort by popularity</option>
                <option>Sort by rating</option>
                <option>Sort by newest</option>
                <option>Sort by price</option>
              </select>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-gray-200 p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex justify-between">
                      <div className="flex space-x-4">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Failed to load APIs. Please try again later.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {apis?.map((api) => (
                  <Link
                    key={getApiSlug(api.name)}
                    to={`/api/${getApiSlug(api.name)}`}
                    className="group border border-gray-200 p-6 hover:border-black transition-colors block"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-black group-hover:underline mb-1">
                          {api.name}
                        </h3>
                        <span className="text-xs text-gray-500 font-mono">{api.version}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                      {api.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {api.rating}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {formatUsers(api.users)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {api.avg_response_time}
                        </div>
                      </div>
                      <div className="text-black font-medium">
                        {api.reliability}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Load More */}
            {!isLoading && !error && (
              <div className="text-center mt-12">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                  Load more APIs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
