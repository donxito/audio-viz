import React, { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { useAudio } from "../../hooks/useAudio";

const Dashboard = () => {
  const {
    audioFiles,
    currentAudio,
    isPlaying,
    setIsPlaying,
    duration,
    setDuration,
    currentTime,
    setCurrentTime,
    audioData,
    //loading,
    error,
    analyzingAudio,
    analyzeAudio,
    uploadAudio,
    deleteAudio,
    selectAudio,
  } = useAudio();

  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [customName, setCustomName] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  // * Initialize WaveSurfer
  useEffect(() => {
    if (waveformRef.current && currentAudio) {
      // Destroy previous instance
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }

      // Create new instance
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4f46e5",
        progressColor: "#818cf8",
        cursorColor: "#c7d2fe",
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 150,
        barGap: 2,
        responsive: true,
      });

      // Load audio file
      wavesurferRef.current.load(currentAudio.url);

      // Event listeners
      wavesurferRef.current.on("ready", () => {
        setDuration(wavesurferRef.current.getDuration());
        analyzeAudio(currentAudio.url);
      });

      wavesurferRef.current.on("audioprocess", () => {
        setCurrentTime(wavesurferRef.current.getCurrentTime());
      });

      wavesurferRef.current.on("play", () => {
        setIsPlaying(true);
      });

      wavesurferRef.current.on("pause", () => {
        setIsPlaying(false);
      });

      wavesurferRef.current.on("finish", () => {
        setIsPlaying(false);
      });

      // Clean up
      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
      };
    }
  }, [currentAudio]);

  // * Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setFileName(file.name);
      setCustomName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
    } else {
      alert("Please select an audio file");
    }
  };

  // * Handle drag
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // * Handle drop
  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      setFileName(file.name);
      setCustomName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      fileInputRef.current.files = e.dataTransfer.files;
    } else {
      alert("Please drop an audio file");
    }
  };

  // * Handle upload
  const handleUpload = (e) => {
    e.preventDefault();

    if (!fileInputRef.current.files[0]) {
      alert("Please select a file");
      return;
    }

    const file = fileInputRef.current.files[0];
    setUploadingFile(true);

    try {
      uploadAudio(file, customName);

      // Reset form
      setFileName("");
      setCustomName("");
      fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error uploading audio:", err);
    } finally {
      setUploadingFile(false);
    }
  };

  // * Toggle play/pause
  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  // * Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // * Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // * Handle delete
  const handleDelete = (audioId) => {
    if (window.confirm("Are you sure you want to delete this audio file?")) {
      deleteAudio(audioId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Audio Visualization Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload, visualize, and analyze your audio files
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6">
          {/* Audio uploader */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleUpload}>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-4 ${
                    fileName
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300 hover:border-primary-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="audio/*"
                    onChange={handleFileChange}
                  />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>

                  <p className="mt-2 text-sm text-gray-600">
                    {fileName ? (
                      <span className="font-medium text-primary-600">
                        {fileName}
                      </span>
                    ) : (
                      <>
                        <span className="font-medium text-primary-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP3, WAV, OGG, FLAC up to 10MB
                  </p>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="customName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Custom Name (optional)
                  </label>
                  <input
                    type="text"
                    id="customName"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter a name for your audio file"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!fileName || uploadingFile}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !fileName || uploadingFile
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  }`}
                >
                  {uploadingFile ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    "Upload Audio"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Audio visualizer */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {currentAudio?.name || "Select an audio file"}
                </h2>
                <div className="text-gray-500 text-sm">
                  {duration > 0 ? formatTime(duration) : "--:--"}
                </div>
              </div>

              <div ref={waveformRef} className="mb-4"></div>

              <div className="flex items-center justify-between">
                <div className="text-gray-500 text-sm">
                  {formatTime(currentTime)}
                </div>

                <button
                  onClick={togglePlayPause}
                  disabled={!currentAudio}
                  className={`flex items-center justify-center h-10 w-10 rounded-full ${
                    !currentAudio
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  }`}
                >
                  {isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                <div className="text-gray-500 text-sm">
                  {duration > 0 ? formatTime(duration - currentTime) : "--:--"}
                </div>
              </div>
            </div>
          </div>

          {/* Audio metrics */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Audio Metrics</h2>

              {analyzingAudio ? (
                <div className="flex items-center justify-center py-6">
                  <svg
                    className="animate-spin h-8 w-8 text-primary-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : !currentAudio ? (
                <p className="text-gray-500">
                  Select an audio file to view metrics
                </p>
              ) : !audioData ? (
                <p className="text-gray-500">No metrics available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Duration
                    </h3>
                    <p className="text-lg font-semibold">
                      {audioData.duration.toFixed(2)} seconds
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Estimated BPM
                    </h3>
                    <p className="text-lg font-semibold">
                      {audioData.estimatedBPM || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Channels
                    </h3>
                    <p className="text-lg font-semibold">
                      {audioData.channels}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Sample Rate
                    </h3>
                    <p className="text-lg font-semibold">
                      {audioData.sampleRate} Hz
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Avg. Amplitude
                    </h3>
                    <p className="text-lg font-semibold">
                      {audioData.averageAmplitude}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Peak Count
                    </h3>
                    <p className="text-lg font-semibold">
                      {audioData.peakCount}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audio list */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Your Audio Files</h2>

              {audioFiles.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <p className="mt-2 text-gray-600">
                    No audio files uploaded yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Upload your first audio file above
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date Added
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {audioFiles.map((audio) => (
                        <tr
                          key={audio.id}
                          onClick={() => selectAudio(audio)}
                          className={`cursor-pointer hover:bg-gray-50 transition duration-150 ${
                            currentAudio && currentAudio.id === audio.id
                              ? "bg-primary-50"
                              : ""
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-primary-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                  />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {audio.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {audio.filename || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(audio.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(audio.id);
                              }}
                              className="text-red-600 hover:text-red-900 focus:outline-none"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
