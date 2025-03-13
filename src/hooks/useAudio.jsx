import { useState, useEffect, useCallback } from "react";
import * as Tone from "tone";

// Demo audio files
const demoAudios = [
  {
    id: "1",
    name: "Guitar Acoustic",
    url: "./demos/sample1.mp3",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Electronic Beat",
    url: "./demos/sample2.mp3",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
  },
  {
    id: "3",
    name: "Ambient Sounds",
    url: "./demos/sample3.mp3",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
];

export const useAudio = () => {
  const [audioFiles, setAudioFiles] = useState([...demoAudios]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioData, setAudioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyzingAudio, setAnalyzingAudio] = useState(false);

  // * Initialize with the first demo audio
  useEffect(() => {
    if (audioFiles.length > 0 && !currentAudio) {
      selectAudio(audioFiles[0]);
    }
  }, [audioFiles, currentAudio]);

  // * Analyze audio with Tone.js
  const analyzeAudio = useCallback(async (audioUrl) => {
    if (!audioUrl) return;

    setAnalyzingAudio(true);
    setAudioData(null);

    try {
      // Load the audio file
      const audioBuffer = await Tone.ToneAudioBuffer.load(audioUrl);

      // Basic metrics
      const duration = audioBuffer.duration;
      const channels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;

      // Calculate average amplitude (rough volume estimate)
      const channelData = audioBuffer.getChannelData(0); // First channel
      let sum = 0;
      for (let i = 0; i < channelData.length; i++) {
        sum += Math.abs(channelData[i]);
      }
      const averageAmplitude = sum / channelData.length;

      // Simple peak detection (rough BPM estimate)
      const peaks = [];
      const threshold = averageAmplitude * 1.5; // Threshold above average
      let prevPeak = 0;

      for (let i = 0; i < channelData.length; i++) {
        if (Math.abs(channelData[i]) > threshold) {
          if (i - prevPeak > sampleRate * 0.2) {
            // Minimum 200ms between peaks
            peaks.push(i);
            prevPeak = i;
          }
        }
      }

      // Rough BPM calculation from peaks (just an estimate)
      let estimatedBPM = 0;
      if (peaks.length > 1) {
        const avgPeakDistance = channelData.length / peaks.length / sampleRate;
        estimatedBPM = Math.round(60 / avgPeakDistance);

        // Clamp BPM to reasonable range
        estimatedBPM = Math.max(60, Math.min(180, estimatedBPM));
      }

      // Set audio data
      setAudioData({
        duration,
        channels,
        sampleRate,
        estimatedBPM,
        averageAmplitude: averageAmplitude.toFixed(3),
        peakCount: peaks.length,
      });
    } catch (err) {
      console.error("Error analyzing audio:", err);
      setError("Failed to analyze audio");
    } finally {
      setAnalyzingAudio(false);
    }
  }, []);

  // * Upload audio file
  const uploadAudio = (file, customName = "") => {
    setLoading(true);
    try {
      // Create URL from file
      const url = URL.createObjectURL(file);

      // Create new audio object
      const newAudio = {
        id: `local-${Date.now()}`,
        name: customName || file.name,
        filename: file.name,
        url,
        createdAt: new Date().toISOString(),
      };

      // Add to audio files
      setAudioFiles((prev) => [newAudio, ...prev]);

      selectAudio(newAudio);

      return newAudio;
    } catch (err) {
      setError("Failed to upload audio");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // * Delete audio
  const deleteAudio = (audioId) => {
    try {
      // Find audio to delete
      const audioToDelete = audioFiles.find((audio) => audio.id === audioId);

      // Revoke object URL if it's a local file
      if (audioToDelete && audioToDelete.url.startsWith("blob:")) {
        URL.revokeObjectURL(audioToDelete.url);
      }

      // Remove from state
      setAudioFiles((prev) => prev.filter((audio) => audio.id !== audioId));

      // If current audio is deleted, select a new one
      if (currentAudio && currentAudio.id === audioId) {
        const remainingAudios = audioFiles.filter(
          (audio) => audio.id !== audioId
        );
        setCurrentAudio(remainingAudios.length > 0 ? remainingAudios[0] : null);
      }
    } catch (err) {
      setError("Failed to delete audio");
      throw err;
    }
  };

  // Select audio
  const selectAudio = (audio) => {
    setCurrentAudio(audio);
  };

  // Clear error
  const clearError = () => setError(null);

  return {
    audioFiles,
    currentAudio,
    isPlaying,
    setIsPlaying,
    duration,
    setDuration,
    currentTime,
    setCurrentTime,
    audioData,
    loading,
    error,
    analyzingAudio,
    analyzeAudio,
    uploadAudio,
    deleteAudio,
    selectAudio,
    clearError,
  };
};
