
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Users, Shield, Zap, Copy, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";

const ApiDetail = () => {
  const { id } = useParams();

  // Mock API data
  const apiData = {
    name: "Weather Pro API",
    description: "Get real-time weather data, 7-day forecasts, and historical weather information for any location worldwide.",
    category: "Weather",
    rating: 4.8,
    users: "12.3k",
    version: "v2.1.0",
    lastUpdated: "2 days ago",
    pricing: "Free tier available",
    provider: "WeatherTech Solutions",
    reliability: "99.9%",
    avgResponse: "85ms"
  };

  const codeExample = `import axios from 'axios';

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.apity.dev/weather-pro/v2';

// Get current weather
const getCurrentWeather = async (city) => {
  try {
    const response = await axios.get(\`\${BASE_URL}/current\`, {
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      },
      params: {
        location: city,
        units: 'metric'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
};

// Usage
getCurrentWeather('New York').then(data => {
  console.log(\`Temperature: \${data.temperature}°C\`);
});`;

  const endpoints = [
    {
      method: "GET",
      path: "/current",
      description: "Get current weather conditions",
      params: "location, units"
    },
    {
      method: "GET", 
      path: "/forecast",
      description: "Get 7-day weather forecast",
      params: "location, days, units"
    },
    {
      method: "GET",
      path: "/history",
      description: "Get historical weather data",
      params: "location, date_from, date_to"
    }
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      requests: "1,000/month",
      features: ["Basic weather data", "Email support", "Rate limiting: 10/min"]
    },
    {
      name: "Pro",
      price: "$29",
      requests: "100,000/month", 
      features: ["All weather data", "Priority support", "Rate limiting: 1000/min", "Historical data"]
    },
    {
      name: "Enterprise",
      price: "Custom",
      requests: "Unlimited",
      features: ["Custom SLA", "Dedicated support", "Custom rate limits", "White-label option"]
    }
  ];

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
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {apiData.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  {apiData.rating} rating
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {apiData.users} users
                </div>
                <span>Updated {apiData.lastUpdated}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="font-medium">Reliability</span>
                </div>
                <div className="text-2xl font-bold">{apiData.reliability}</div>
              </div>
              <div className="bg-gray-50 p-4">
                <div className="flex items-center mb-2">
                  <Zap className="h-5 w-5 mr-2" />
                  <span className="font-medium">Avg Response</span>
                </div>
                <div className="text-2xl font-bold">{apiData.avgResponse}</div>
              </div>
              <div className="bg-gray-50 p-4">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-medium">Active Users</span>
                </div>
                <div className="text-2xl font-bold">{apiData.users}</div>
              </div>
            </div>

            {/* Code Example */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Quick Start</h2>
                <button className="flex items-center text-sm text-gray-600 hover:text-black transition-colors">
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </button>
              </div>
              <div className="bg-gray-900 text-gray-300 p-6 font-mono text-sm overflow-x-auto">
                <pre>{codeExample}</pre>
              </div>
            </div>

            {/* Endpoints */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">API Endpoints</h2>
              <div className="space-y-3">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="border border-gray-200 p-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-gray-900 text-white px-2 py-1 text-xs font-mono mr-3">
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{endpoint.description}</p>
                    <p className="text-xs text-gray-500">
                      Parameters: <code>{endpoint.params}</code>
                    </p>
                  </div>
                ))}
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
              <button className="w-full border border-gray-300 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                View Documentation
              </button>
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
              <h3 className="font-bold mb-4">Provider</h3>
              <p className="text-sm text-gray-700 mb-3">{apiData.provider}</p>
              <button className="flex items-center text-sm text-gray-600 hover:text-black transition-colors">
                <ExternalLink className="h-4 w-4 mr-1" />
                View profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDetail;
