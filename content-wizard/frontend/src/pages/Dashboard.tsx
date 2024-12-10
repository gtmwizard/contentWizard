import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

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
        return <ArticleIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'twitter':
        return <TwitterIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
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
      <Box sx={{ p: 4 }}>
        {/* Welcome Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                Welcome to Content Wizard
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Create engaging content for your audience with AI-powered assistance.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/dashboard/create')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Create New Content
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Recent Content */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          Recent Content
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : contents.length > 0 ? (
          <Grid container spacing={3}>
            {contents.map((content) => (
              <Grid item xs={12} md={6} lg={4} key={content.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getContentIcon(content.type)}
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                        {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Chip
                        label={content.status}
                        size="small"
                        color={getStatusColor(content.status) as any}
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {content.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {content.content.substring(0, 100)}...
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created on {formatDate(content.createdAt)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/dashboard/content/${content.id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              No content yet
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/dashboard/create')}
              sx={{ mt: 2 }}
            >
              Create Your First Content
            </Button>
          </Paper>
        )}
      </Box>
    </DashboardLayout>
  );
} 