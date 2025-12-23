import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_URL = import.meta.env.VITE_API_URL || '';

interface AdminProps {
  adminKey: string;
}

const Admin = ({ adminKey }: AdminProps) => {
  const [openedLetters, setOpenedLetters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const fetchOpenedLetters = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const url = `${API_URL}/api/admin/opened-letters?adminKey=${encodeURIComponent(adminKey)}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setOpenedLetters(data.openedLetters || []);
      } else {
        const error = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
        
        if (response.status === 401) {
          setMessage({ 
            type: 'error', 
            text: 'Invalid admin key. Please log out and try again with the correct key. Default key: admin-secret-key-change-me' 
          });
        } else {
          setMessage({ 
            type: 'error', 
            text: error.error || `Failed to fetch opened letters (${response.status})` 
          });
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage({ 
        type: 'error', 
        text: `Error connecting to server. Make sure the backend server is running on port 3001. ${error instanceof Error ? error.message : ''}` 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Test server connection first
    const testConnection = async () => {
      try {
        const testUrl = `${API_URL}/api/opened-letters`;
        const response = await fetch(testUrl);
        // If we get any response (even 401), server is running
        if (response.status !== 0) {
          // Server is reachable, now fetch admin data
          fetchOpenedLetters();
        } else {
          setMessage({ 
            type: 'error', 
            text: 'Cannot connect to backend server. Please make sure the server is running with: npm run dev:server' 
          });
          setLoading(false);
        }
      } catch (error) {
        setMessage({ 
          type: 'error', 
          text: 'Cannot connect to backend server. Please make sure the server is running with: npm run dev:server' 
        });
        setLoading(false);
      }
    };
    
    testConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restoreLetter = async (name: string) => {
    try {
      setRestoring(name);
      setMessage(null);
      
      const url = `${API_URL}/api/admin/opened-letters/${encodeURIComponent(name)}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: data.message || `Letter "${name}" restored successfully!` });
        // Refresh the list
        await fetchOpenedLetters();
      } else {
        const error = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
        
        if (response.status === 401) {
          setMessage({ 
            type: 'error', 
            text: 'Invalid admin key. Please log out and try again with the correct key.' 
          });
        } else {
          setMessage({ type: 'error', text: error.error || `Failed to restore letter (${response.status})` });
        }
      }
    } catch (error) {
      console.error('Restore error:', error);
      setMessage({ 
        type: 'error', 
        text: `Error connecting to server. Make sure the backend server is running. ${error instanceof Error ? error.message : ''}` 
      });
    } finally {
      setRestoring(null);
    }
  };

  const resetAll = async () => {
    if (!confirm('Are you sure you want to restore ALL letters? This will make all letters available again.')) {
      return;
    }

    try {
      setResetLoading(true);
      setMessage(null);
      
      const url = `${API_URL}/api/admin/reset`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: data.message || 'All letters restored successfully!' });
        await fetchOpenedLetters();
      } else {
        const error = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
        
        if (response.status === 401) {
          setMessage({ 
            type: 'error', 
            text: 'Invalid admin key. Please log out and try again with the correct key.' 
          });
        } else {
          setMessage({ type: 'error', text: error.error || `Failed to reset letters (${response.status})` });
        }
      }
    } catch (error) {
      console.error('Reset error:', error);
      setMessage({ 
        type: 'error', 
        text: `Error connecting to server. Make sure the backend server is running. ${error instanceof Error ? error.message : ''}` 
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel - Restore Letters</CardTitle>
            <CardDescription>
              Manage opened letters. Restore letters to make them available again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>
                  {message.text}
                  {message.type === 'error' && message.text.includes('connecting to server') && (
                    <div className="mt-2 text-sm">
                      <p className="font-semibold">Troubleshooting:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Make sure the backend server is running: <code className="bg-muted px-1 py-0.5 rounded">npm run dev:server</code></li>
                        <li>Check that the server is running on port 3001</li>
                        <li>Verify your admin key is correct</li>
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  Opened Letters ({openedLetters.length})
                </h3>
                <p className="text-sm text-muted-foreground">
                  Letters that have been opened and are currently hidden
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    sessionStorage.removeItem('adminKey');
                    window.location.href = '/admin/login';
                  }}
                  variant="outline"
                >
                  Log Out
                </Button>
                <Button
                  onClick={fetchOpenedLetters}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
                {openedLetters.length > 0 && (
                  <Button
                    onClick={resetAll}
                    disabled={resetLoading}
                    variant="destructive"
                  >
                    {resetLoading ? 'Resetting...' : 'Reset All'}
                  </Button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading opened letters...
              </div>
            ) : openedLetters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No letters have been opened yet. All letters are available.
              </div>
            ) : (
              <div className="space-y-2">
                {openedLetters.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">{name}</div>
                      <div className="text-sm text-muted-foreground">
                        Currently hidden from the website
                      </div>
                    </div>
                    <Button
                      onClick={() => restoreLetter(name)}
                      disabled={restoring === name}
                      variant="outline"
                    >
                      {restoring === name ? 'Restoring...' : 'Restore Letter'}
                    </Button>
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

