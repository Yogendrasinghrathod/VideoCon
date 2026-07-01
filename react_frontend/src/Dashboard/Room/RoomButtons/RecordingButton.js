import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  IconButton, 
  Tooltip, 
  CircularProgress,
  Snackbar,
  Alert,
  Badge
} from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';

const RecordingIndicator = styled('div')(({ theme, recording }) => ({
  position: 'absolute',
  top: 4,
  right: 4,
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: recording ? theme.palette.error.main : 'transparent',
  animation: recording ? 'pulse 1.5s infinite' : 'none',
  '@keyframes pulse': {
    '0%': { transform: 'scale(0.95)', opacity: 0.8 },
    '50%': { transform: 'scale(1.1)', opacity: 1 },
    '100%': { transform: 'scale(0.95)', opacity: 0.8 }
  }
}));

const RecordingButton = () => {
  const theme = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingStartDateRef = useRef(null);
  const timerRef = useRef(null);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden' && isRecording) {
      stopRecording();
    }
  }, [isRecording]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { displaySurface: 'monitor' },
        audio: true 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        downloadRecording();
        setIsRecording(false);
        chunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error('Recording error:', event.error);
        setErrorMessage('Recording failed. Please try again.');
        setShowError(true);
        cleanupRecording();
      };

      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
        }
      };

      recordingStartDateRef.current = new Date();
      mediaRecorder.start(1000); // Request data every second
      setIsRecording(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error accessing screen:', error);
      setErrorMessage('Screen sharing permission denied');
      setShowError(true);
      setIsLoading(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setShowSuccess(true);
    }
  };

  const cleanupRecording = () => {
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setIsLoading(false);
    setRecordingTime(0);
    chunksRef.current = [];
  };

  const downloadRecording = () => {
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const dateString = format(recordingStartDateRef.current, 'yyyyMMdd_HHmmss');
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = `recording_${dateString}.webm`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <Tooltip 
        title={isRecording ? `Stop recording (${formatTime(recordingTime)})` : 'Start screen recording'} 
        arrow
      >
        <div>
          <IconButton
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            sx={{
              backgroundColor: isRecording ? theme.palette.error.dark : theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: isRecording ? theme.palette.error.main : theme.palette.primary.dark,
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
            size="large"
          >
            {isLoading ? (
              <CircularProgress size={28} color="inherit" />
            ) : isRecording ? (
              <StopCircleIcon fontSize="large" />
            ) : (
              <PlayCircleFilledIcon fontSize="large" />
            )}
            <RecordingIndicator recording={isRecording} />
          </IconButton>
        </div>
      </Tooltip>

      {isRecording && (
        <Badge
          badgeContent={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" />
              <span style={{ marginLeft: 4 }}>{formatTime(recordingTime)}</span>
            </div>
          }
          color="default"
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            '& .MuiBadge-badge': {
              backgroundColor: theme.palette.grey[800],
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px'
            }
          }}
        />
      )}

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Recording saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RecordingButton;