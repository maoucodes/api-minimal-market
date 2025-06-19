
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy, CreditCard, Activity, Key, User } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Dashboard - Auth state:', { user: user?.id, profile: profile?.id, authLoading });
  }, [user, profile, authLoading]);

  const { data: apiCalls = [], isLoading: apiCallsLoading, error: apiCallsError } = useQuery({
    queryKey: ['api-calls', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID for API calls query');
        return [];
      }
      
      console.log('Fetching API calls for user:', user.id);
      const { data, error } = await supabase
        .from('api_calls')
        .select(`
          *,
          apis (name, version)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching API calls:', error);
        throw error;
      }
      
      console.log('API calls fetched:', data?.length || 0);
      return data || [];
    },
    enabled: !!user?.id && !authLoading
  });

  const copyApiKey = () => {
    if (profile?.api_key) {
      navigator.clipboard.writeText(profile.api_key);
      toast({
        title: "API Key Copied",
        description: "Your API key has been copied to clipboard"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show sign in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
            <p className="text-gray-600">You need to sign in to access your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show profile loading state
  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <p className="text-gray-600">Loading your profile...</p>
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
          <h1 className="text-4xl font-bold text-black mb-4">Dashboard</h1>
          <p className="text-gray-600">Manage your API usage and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback>
                    {profile.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{profile.full_name || 'User'}</h3>
                  <p className="text-sm text-gray-600">{profile.email || user.email}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Member since {profile.created_at ? formatDate(profile.created_at) : 'Recently'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">
                  {profile.credits || 0}
                </div>
                <p className="text-sm text-gray-600 mb-4">Available Credits</p>
                <Button variant="outline" className="w-full">
                  Buy More Credits
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Key Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
                  {profile.api_key || 'No API key available'}
                </div>
                <Button onClick={copyApiKey} variant="outline" className="w-full" disabled={!profile.api_key}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Calls History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent API Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apiCallsLoading ? (
              <p className="text-gray-600">Loading API call history...</p>
            ) : apiCallsError ? (
              <p className="text-red-600">Error loading API calls. Please try again.</p>
            ) : apiCalls.length === 0 ? (
              <p className="text-gray-600">No API calls yet. Start using APIs to see your activity here.</p>
            ) : (
              <div className="space-y-3">
                {apiCalls.map((call: any) => (
                  <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{call.apis?.name || 'Unknown API'}</span>
                        <Badge variant="outline">{call.method || 'GET'}</Badge>
                        <Badge variant={call.status_code >= 200 && call.status_code < 300 ? "default" : "destructive"}>
                          {call.status_code || 'N/A'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {call.endpoint || 'Unknown endpoint'} • {formatDate(call.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{call.credits_used || 0} credits</p>
                      {call.response_time && (
                        <p className="text-xs text-gray-600">{call.response_time}ms</p>
                      )}
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

export default Dashboard;
