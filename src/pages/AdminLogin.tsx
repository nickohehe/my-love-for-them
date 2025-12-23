import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const AdminLogin = () => {
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminKey.trim()) {
      setError("Please enter an admin key");
      return;
    }

    // Store admin key in sessionStorage (not localStorage for security)
    // Trim whitespace to avoid issues
    sessionStorage.setItem('adminKey', adminKey.trim());
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your admin key to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminKey">Admin Key</Label>
              <Input
                id="adminKey"
                type="password"
                value={adminKey}
                onChange={(e) => {
                  setAdminKey(e.target.value);
                  setError("");
                }}
                placeholder="Enter admin key"
                autoFocus
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Access Admin Panel
            </Button>
          </form>

          <div className="mt-4 text-sm text-muted-foreground space-y-2">
            <div>
              <p className="font-semibold mb-1">Default admin key:</p>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-xs font-mono flex-1">
                  admin-secret-key-change-me
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText('admin-secret-key-change-me');
                    setError('');
                    // Show temporary success
                    const originalError = error;
                    setError('Copied to clipboard!');
                    setTimeout(() => setError(originalError), 2000);
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              💡 Make sure there are no extra spaces. The server expects exactly: <code>admin-secret-key-change-me</code>
            </p>
            <p className="text-xs">
              Change it by setting the ADMIN_KEY environment variable when starting the server
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

