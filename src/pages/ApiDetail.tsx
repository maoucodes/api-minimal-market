import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Users, Shield, Zap, Copy, ExternalLink, Code, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const ApiDetail = () => {
  const { id } = useParams();
  
  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['api', id],
    queryFn: async () => {
      if (!id) throw new Error('No API ID provided');
      
      const { data, error } = await supabase
        .from('apis')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('API not found');
      
      return data;
    },
    enabled: !!id,
  });

  const formatUsers = (users: number) => {
    if (users >= 1000) {
      return `${(users / 1000).toFixed(1)}k`;
    }
    return users.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-6 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-20 w-full mb-8" />
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !apiData) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/explore"
            className="inline-flex items-center text-gray-600 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to explore
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-black mb-4">API Not Found</h1>
            <p className="text-gray-600">The API you're looking for doesn't exist or couldn't be loaded.</p>
            <Link
              to="/explore"
              className="inline-block mt-4 px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Browse APIs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      requests: "1,000/month",
      features: ["Basic API access", "Email support", "Rate limiting: 10/min"]
    },
    {
      name: "Pro", 
      price: "$29",
      requests: "100,000/month",
      features: ["Full API access", "Priority support", "Rate limiting: 1000/min", "Analytics dashboard"]
    },
    {
      name: "Enterprise",
      price: "Custom",
      requests: "Unlimited",
      features: ["Custom SLA", "Dedicated support", "Custom rate limits", "White-label option"]
    }
  ];

  // Parse JSON fields safely
  const parseJsonField = (field: any, fallback: any) => {
    try {
      return typeof field === 'string' ? JSON.parse(field) : field || fallback;
    } catch {
      return fallback;
    }
  };

  const endpointParameters = parseJsonField(apiData.endpoint_parameters, []);
  const endpointResponse = parseJsonField(apiData.endpoint_response, {});

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          to="/explore"
          className="inline-flex items-center text-gray-600 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to explore
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* API Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-black">{apiData.name}</h1>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono">
                  {apiData.version}
                </span>
                {apiData.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {apiData.category}
                  </span>
                )}
                <span className={`px-2 py-1 text-xs rounded ${
                  apiData.status === 'active' ? 'bg-green-100 text-green-800' :
                  apiData.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                  apiData.status === 'deprecated' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {apiData.status}
                </span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {apiData.description || "No description available"}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  {apiData.rating || 0} rating
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {formatUsers(apiData.users || 0)} users
                </div>
                <span>Updated {formatDate(apiData.last_updated)}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="font-medium">Reliability</span>
                </div>
                <div className="text-2xl font-bold">{apiData.reliability || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-4">
                <div className="flex items-center mb-2">
                  <Zap className="h-5 w-5 mr-2" />
                  <span className="font-medium">Avg Response</span>
                </div>
                <div className="text-2xl font-bold">{apiData.avg_response_time || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-4">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-medium">Rate Limit</span>
                </div>
                <div className="text-2xl font-bold">{apiData.rate_limit || 'N/A'}/hr</div>
              </div>
            </div>

            {/* Code Examples */}
            {(apiData.quick_start || apiData.quick_start_python) && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Quick Start</h2>
                <Tabs defaultValue={apiData.quick_start ? "js" : "python"} className="w-full">
                  <TabsList>
                    {apiData.quick_start && (
                      <TabsTrigger value="js" className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        JavaScript
                      </TabsTrigger>
                    )}
                    {apiData.quick_start_python && (
                      <TabsTrigger value="python" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Python
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  {apiData.quick_start && (
                    <TabsContent value="js">
                      <div className="relative">
                        <button 
                          className="absolute top-4 right-4 flex items-center text-sm text-gray-400 hover:text-gray-200 transition-colors z-10"
                          onClick={() => navigator.clipboard.writeText(apiData.quick_start)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </button>
                        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                          <pre className="whitespace-pre-wrap">{apiData.quick_start}</pre>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                  
                  {apiData.quick_start_python && (
                    <TabsContent value="python">
                      <div className="relative">
                        <button 
                          className="absolute top-4 right-4 flex items-center text-sm text-gray-400 hover:text-gray-200 transition-colors z-10"
                          onClick={() => navigator.clipboard.writeText(apiData.quick_start_python)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </button>
                        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                          <pre className="whitespace-pre-wrap">{apiData.quick_start_python}</pre>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            )}

            {/* Endpoints */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">API Endpoint</h2>
              <div className="border border-gray-200 p-4">
                <div className="flex items-center mb-2">
                  <span className="bg-gray-900 text-white px-2 py-1 text-xs font-mono mr-3">
                    {apiData.endpoint_method || 'GET'}
                  </span>
                  <code className="text-sm font-mono">{apiData.endpoint_path || '/api/endpoint'}</code>
                </div>
                {apiData.endpoint_example && (
                  <p className="text-xs text-gray-500 mb-3">
                    Example: <code>{apiData.endpoint_example}</code>
                  </p>
                )}
                
                {endpointParameters.length > 0 && (
                  <>
                    <h4 className="font-medium mb-2">Parameters:</h4>
                    <div className="space-y-2">
                      {endpointParameters.map((param: any, index: number) => (
                        <div key={index} className="flex items-center text-sm">
                          <code className="bg-gray-100 px-2 py-1 mr-2 text-xs">{param.name || 'param'}</code>
                          <span className="text-gray-600">
                            {param.type || 'string'} • {param.location || 'query'} • {param.required === "true" ? "required" : "optional"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <h4 className="font-medium mt-4 mb-2">Response:</h4>
                <div className="bg-gray-50 p-3 text-sm">
                  <pre>{JSON.stringify(endpointResponse, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <div className="border border-gray-200 p-6">
              <h3 className="font-bold mb-4">Get Started</h3>
              <button className="w-full bg-black text-white py-2 mb-3 hover:bg-gray-800 transition-colors">
                Get API Key
              </button>
              {apiData.documentation_url && (
                <a 
                  href={apiData.documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-gray-300 py-2 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  View Documentation
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              )}
            </div>

            {/* Pricing */}
            <div className="border border-gray-200 p-6">
              <h3 className="font-bold mb-4">Pricing</h3>
              <div className="space-y-4">
                {pricingTiers.map((tier, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{tier.name}</span>
                      <span className="font-bold">{tier.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tier.requests}</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {tier.features.map((feature, i) => (
                        <li key={i}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Info */}
            <div className="border border-gray-200 p-6">
              <h3 className="font-bold mb-4">API Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span>{apiData.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span>{apiData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="capitalize">{apiData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pricing:</span>
                  <span className="capitalize">{apiData.pricing_model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate Limit:</span>
                  <span>{apiData.rate_limit}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reliability:</span>
                  <span>{apiData.reliability || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span>{apiData.avg_response_time || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span>{formatDate(apiData.last_updated)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDetail;
