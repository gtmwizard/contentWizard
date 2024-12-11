import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Linkedin, Twitter, ChevronRight } from "lucide-react";
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Content {
  id: string;
  type: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/content', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setContents(data.data || []);
      } catch (error) {
        console.error('Error fetching contents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, [token]);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'scheduled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Welcome Section */}
        <div className="rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 p-6 mb-6 text-white">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">
              Welcome to Content Wizard
            </h1>
            <p className="text-lg mb-4 text-gray-200">
              Create engaging content for your audience with AI-powered assistance.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard/create')}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Content
            </Button>
          </div>
        </div>

        {/* Recent Content */}
        <h2 className="text-2xl font-semibold mb-4">Recent Content</h2>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : contents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contents.map((content) => (
              <Card key={content.id} className="flex flex-col">
                <CardContent className="flex-grow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getContentIcon(content.type)}
                      <span className="text-sm font-medium capitalize">
                        {content.type}
                      </span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(content.status)}>
                      {content.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{content.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {content.content.substring(0, 100)}...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created on {formatDate(content.createdAt)}
                  </p>
                </CardContent>
                <Separator />
                <CardFooter className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/dashboard/content/${content.id}`)}
                    className="w-full"
                  >
                    View Details <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                No content yet
              </p>
              <Button
                variant="default"
                onClick={() => navigate('/dashboard/create')}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Content
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
} 