import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Linkedin, Twitter, ChevronRight } from "lucide-react";
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScheduleTest } from '@/components/content/ScheduleTest';
import { contentService } from '@/services/content';
import { getErrorMessage } from '@/utils/error';
import type { GeneratedContent } from '@/types/content';

export default function Dashboard() {
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setError(null);
        const response = await contentService.getContents();
        setContents(response.data || []);
      } catch (err) {
        setError(getErrorMessage(err));
        console.error('Error fetching contents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your content</p>
          </div>
          <Button onClick={() => navigate('/dashboard/create')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Content
          </Button>
        </div>

        {error && (
          <Card className="mb-6 bg-destructive/10 text-destructive">
            <CardContent className="py-4">
              {error}
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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