'use client';
import { HealthAndSafety, MonitorHeart, Psychology, Timeline } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: <HealthAndSafety sx={{ fontSize: 40, color: '#1E90FF' }} />,
      title: 'Personalized Healthcare',
      description: 'AI-driven wellness solutions tailored to your unique health profile and goals.'
    },
    {
      icon: <Timeline sx={{ fontSize: 40, color: '#ff4d4d' }} />,
      title: 'Chronic Disease Management',
      description: 'Continuous monitoring and personalized interventions for better health outcomes.'
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: '#2AF598' }} />,
      title: 'Smart Health Tracking',
      description: 'Integration with wearables and smart devices for comprehensive health monitoring.'
    },
    {
      icon: <MonitorHeart sx={{ fontSize: 40, color: '#9047FF' }} />,
      title: 'Preventive Medicine',
      description: 'Advanced analytics to prevent health issues before they become serious.'
    }
  ];

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e3eeff 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Medical-themed background patterns */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M60 30H0' stroke='%230066cc' stroke-width='3' fill='none'/%3E%3C/svg%3E")`,
          zIndex: 1,
        }}
      />

      {/* Hero Section - Updated styles */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4, position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            marginTop: '100px',
            fontWeight: 'bold',
            color: '#2c3e50',
            mb: 3,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Your AI Health Assistant
        </Typography>
        
        <Typography
          variant="h5"
          align="center"
          sx={{
            color: '#34495e',
            mb: 4
          }}
        >
          Personalized healthcare powered by AI for a longer, healthier life
        </Typography>

        <Box display="flex" justifyContent="center" mb={6}>
          <Button
            variant="contained"
            size="large"
            onClick={async () => {
              // await signInWithPopup(auth, provider);
              router.push('/registration');
            }}
            sx={{
              background: 'linear-gradient(45deg, #0066cc 30%, #0099ff 90%)',
              color: 'white',
              fontWeight: 600,
              padding: '12px 36px',
              borderRadius: '25px',
              boxShadow: '0 3px 15px rgba(0,102,204,0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #005cb8 30%, #008ae6 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 20px rgba(0,102,204,0.4)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Start Your Health Journey
          </Button>
        </Box>

        {/* Features Grid - Updated card styles */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '15px',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0,102,204,0.1)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,102,204,0.15)',
                    borderColor: 'rgba(0,102,204,0.2)',
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="center" mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h2" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Medical-themed floating elements */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            style={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              border: '2px solid rgba(0,102,204,0.1)',
              borderRadius: '50%',
              animation: `float${i} ${10 + i * 2}s linear infinite`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </Box>

      {/* Additional animations */}
      <style jsx>{`
        @keyframes float0 { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(100px, 100px) rotate(360deg); } }
        @keyframes float1 { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(-100px, 50px) rotate(-360deg); } }
        @keyframes float2 { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(50px, -100px) rotate(360deg); } }
        @keyframes float3 { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(-50px, -50px) rotate(-360deg); } }
        @keyframes float4 { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(100px, -100px) rotate(360deg); } }

        @media (max-width: 600px) {
          .MuiTypography-h2 {
            font-size: 2rem;
          }
          .MuiTypography-h5 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </Box>
  );
}
