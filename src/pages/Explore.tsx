
import { Link } from "react-router-dom";
import { Search, Filter, Star, Users, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";

const Explore = () => {
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

  const apiCards = [
    {
      id: "weather-pro",
      name: "Weather Pro API",
      description: "Real-time weather data with 7-day forecasts and historical data.",
      category: "Weather",
      rating: 4.8,
      users: "12.3k",
      pricing: "Free tier available",
      featured: true
    },
    {
      id: "ai-sentiment",
      name: "AI Sentiment Analysis",
      description: "Advanced sentiment analysis powered by machine learning.",
      category: "AI & ML",
      rating: 4.9,
      users: "8.7k",
      pricing: "$0.01/request",
      featured: false
    },
    {
      id: "crypto-rates",
      name: "Crypto Exchange Rates",
      description: "Live cryptocurrency prices and historical exchange rates.",
      category: "Finance",
      rating: 4.7,
      users: "15.2k",
      pricing: "Free tier available",
      featured: false
    },
    {
      id: "email-validator",
      name: "Email Validator",
      description: "Validate email addresses with deliverability checking.",
      category: "Communication",
      rating: 4.6,
      users: "9.1k",
      pricing: "$0.005/validation",
      featured: false
    },
    {
      id: "image-recognition",
      name: "Image Recognition API",
      description: "Object detection and image classification with high accuracy.",
      category: "AI & ML",
      rating: 4.8,
      users: "6.4k",
      pricing: "$0.02/image",
      featured: true
    },
    {
      id: "geolocation",
      name: "Geolocation Services",
      description: "IP-based location detection with city-level accuracy.",
      category: "Maps & Location",
      rating: 4.5,
      users: "11.8k",
      pricing: "Free tier available",
      featured: false
    }
  ];

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
              <p className="text-gray-600">{apiCards.length} APIs found</p>
              <select className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black">
                <option>Sort by popularity</option>
                <option>Sort by rating</option>
                <option>Sort by newest</option>
                <option>Sort by price</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {apiCards.map((api) => (
                <Link
                  key={api.id}
                  to={`/api/${api.id}`}
                  className="group border border-gray-200 p-6 hover:border-black transition-colors block"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-black group-hover:underline mb-1">
                        {api.name}
                        {api.featured && (
                          <span className="ml-2 inline-block w-2 h-2 bg-black rounded-full"></span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-500 font-mono">{api.category}</span>
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
                        {api.users}
                      </div>
                    </div>
                    <div className="text-black font-medium">
                      {api.pricing}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                Load more APIs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
