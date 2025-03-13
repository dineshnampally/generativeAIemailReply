import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(100, 149, 237, 0.5)', // CornflowerBlue with opacity
      transition: 'border-color 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(100, 149, 237, 1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(100, 149, 237, 1)',
      boxShadow: '0 0 8px rgba(100, 149, 237, 0.7)',
    },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(100, 149, 237, 0.5)',
      transition: 'border-color 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(100, 149, 237, 1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(100, 149, 237, 1)',
      boxShadow: '0 0 8px rgba(100, 149, 237, 0.7)',
    },
  },
  '& .MuiSelect-select': {
    color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  padding: '14px 28px',
  fontWeight: 600,
  background: 'linear-gradient(135deg, rgba(100, 149, 237, 1), rgba(70, 130, 180, 1))', 
  color: 'white',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 12px rgba(100, 149, 237, 0.5)',
  },
}));

const App = () => {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedReply, setGenerartedReply] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGenerartedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed Generate Email reply. Please Try again !');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant='h4' component="h1" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 3, color: 'rgba(100, 149, 237, 1)' }}>
          AI Email Reply Generator
        </Typography>
        <Box sx={{ mx: 3 }}>
          <StyledTextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            label="Original Email Content"
            value={emailContent || ''}
            onChange={e => setEmailContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tone (optional)</InputLabel>
            <StyledSelect
              value={tone || ''}
              label={"Tone (optional)"}
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
            </StyledSelect>
          </FormControl>
          <StyledButton
            variant='contained'
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={!emailContent || loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Generate Reply"}
          </StyledButton>
        </Box>
        {error && <Typography color='error' sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>}

        {generatedReply &&
          <Box sx={{ mt: 3 }}>
            <Typography variant='h6' gutterBottom sx={{ fontWeight: 600, color: 'rgba(100, 149, 237, 1)' }}>Generated Reply</Typography>
            <StyledTextField
              fullWidth
              multiline
              rows={6}
              variant='outlined'
              value={generatedReply || ''}
              inputProps={{ readOnly: true }}
            />
            <StyledButton
              variant='outlined'
              sx={{ mt: 2, background: 'linear-gradient(135deg, rgba(70, 130, 180, 1), rgba(100, 149, 237, 1))', color: 'white' }}
              onClick={() => { navigator.clipboard.writeText(generatedReply) }}
            >
              Copy to Clipboard
            </StyledButton>
          </Box>
        }
      </Container>
    </motion.div>
  );
};

export default App;