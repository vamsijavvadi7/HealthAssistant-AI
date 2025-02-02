'use client';
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth, db } from '../firebase';

export default function RegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    medicalConditions: '',
    allergies: '',
    medications: '',
    familyHistory: '',
    dietaryPreferences: '',
    exerciseRoutine: '',
    smokingStatus: false,
    alcoholConsumption: '',
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'smokingStatus' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      // Create user authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        healthProfile: {
          age: formData.age,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          medicalConditions: formData.medicalConditions,
          allergies: formData.allergies,
          medications: formData.medications,
          familyHistory: formData.familyHistory,
          dietaryPreferences: formData.dietaryPreferences,
          exerciseRoutine: formData.exerciseRoutine,
          smokingStatus: formData.smokingStatus,
          alcoholConsumption: formData.alcoholConsumption,
        },
        createdAt: new Date().toISOString(),
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
      alert(error.message);
      console.log("Error during registration:");
    }
  };

  return (
    <Container sx={{mt:20}} maxWidth="md">
      <Box 
        sx={{ 
          mt: 8,
          mb: 6,
          p: 4,
          borderRadius: 2,
          boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
          backgroundColor: 'white'
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{
            mb: 4,
            fontWeight: 600,
            color: '#1a1a1a'
          }}
        >
          Health Profile Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Basic Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>

            {/* Physical Information */}
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                type="number"
                name="age"
                label="Age"
                value={formData.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={handleChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="weight"
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange}
              />
            </Grid>

            {/* Medical History */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="medicalConditions"
                label="Current Medical Conditions"
                value={formData.medicalConditions}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="familyHistory"
                label="Family Medical History"
                value={formData.familyHistory}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="medications"
                label="Current Medications"
                value={formData.medications}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="allergies"
                label="Allergies"
                value={formData.allergies}
                onChange={handleChange}
              />
            </Grid>

            {/* Lifestyle Information */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="dietaryPreferences"
                label="Dietary Preferences and Restrictions"
                value={formData.dietaryPreferences}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="exerciseRoutine"
                label="Exercise/Fitness Routine"
                value={formData.exerciseRoutine}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="smokingStatus"
                    checked={formData.smokingStatus}
                    onChange={handleChange}
                  />
                }
                label="Do you smoke?"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Alcohol Consumption</InputLabel>
                <Select
                  name="alcoholConsumption"
                  value={formData.alcoholConsumption}
                  label="Alcohol Consumption"
                  onChange={handleChange}
                >
                  <MenuItem value="never">Never</MenuItem>
                  <MenuItem value="occasional">Occasional</MenuItem>
                  <MenuItem value="regular">Regular</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #0066cc 30%, #0099ff 90%)',
                  color: 'white',
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #005cb8 30%, #008ae6 90%)',
                  },
                }}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
