import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/city/index.css';
import { videoService, VideoProgress, VideoSubtitle, VideoNote } from '@/services/client/video.service';
import './VideoPlayer.css';

interface VideoPlayerProps {
    lessonId: string;
    videoUrl: string;
    duration?: number;
    onProgressUpdate?: (progress: number) => void;
    onTimeUpdate?: (currentTime: number) => void;
    onComplete?: () => void;
    subtitles?: VideoSubtitle[];
    notes?: VideoNote[];
    onNoteClick?: (timestamp: number) => void;
    autoResume?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    lessonId,
    videoUrl,
    duration,
    onProgressUpdate,
    onTimeUpdate,
    onComplete,
    subtitles = [],
    notes = [],
    onNoteClick,
    autoResume = true,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressSaveIntervalRef = useRef<number | null>(null);
    const analyticsIntervalRef = useRef<number | null>(null);

    const [isReady, setIsReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [actualDuration, setActualDuration] = useState<number | undefined>(duration); // Duration from props or video element
    // const [volume, setVolume] = useState(1); // Reserved for future use
    // const [playbackRate, setPlaybackRate] = useState(1); // Reserved for future use
    const [selectedSubtitle, setSelectedSubtitle] = useState<VideoSubtitle | null>(null);
    const [savedProgress, setSavedProgress] = useState<VideoProgress | null>(null);
    const [watchTime, setWatchTime] = useState(0);
    const [lastEventTime, setLastEventTime] = useState(0);
    const [videoError, setVideoError] = useState<string | null>(null);
    const [useFallback, setUseFallback] = useState(false);
    const [playStartTime, setPlayStartTime] = useState<number | null>(null);
    const [previousTime, setPreviousTime] = useState(0);

    // Get video MIME type from URL
    const getVideoMimeType = (url: string): string => {
        if (!url) return 'video/mp4';

        const extension = url.toLowerCase().split('.').pop()?.split('?')[0];

        switch (extension) {
            case 'mp4':
                return 'video/mp4';
            case 'webm':
                return 'video/webm';
            case 'mov':
                return 'video/quicktime';
            case 'avi':
                return 'video/x-msvideo';
            case 'm3u8':
                return 'application/x-mpegURL';
            default:
                return 'video/mp4'; // Default to mp4
        }
    };

    // Record analytics event
    const recordAnalyticsEvent = useCallback(async (action: 'play' | 'pause' | 'seek' | 'complete' | 'exit', timeSpent?: number) => {
        if (!videoRef.current) return;

        try {
            const timestamp = Math.floor(videoRef.current.currentTime);
            await videoService.recordEvent(lessonId, {
                timestamp,
                action,
                timeSpent: timeSpent || 0,
            });
        } catch (error) {
            // Silently fail - don't interrupt video playback
            console.warn('Failed to record analytics event:', error);
        }
    }, [lessonId]);

    // Simple HTML5 video - no need for complex video.js initialization
    // Just use the video element directly with the Cloudinary URL

    // Load saved progress when video is ready
    useEffect(() => {
        if (!videoRef.current || !autoResume) return;

        const loadProgress = async () => {
            try {
                const response = await videoService.getProgress(lessonId);
                if (response.success && response.data && videoRef.current) {
                    const progressData: VideoProgress = response.data;
                    setSavedProgress(progressData);
                    if (progressData.currentTime > 0) {
                        videoRef.current.currentTime = progressData.currentTime;
                        setProgress(progressData.progress);
                        setWatchTime(progressData.watchTime);
                    }
                }
            } catch (error) {
                console.error('Failed to load progress:', error);
            }
        };

        if (videoRef.current.readyState >= 2) {
            // Video metadata loaded
            loadProgress();
        } else {
            videoRef.current.addEventListener('loadedmetadata', loadProgress, { once: true });
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadedmetadata', loadProgress);
            }
        };
    }, [lessonId, autoResume]);

    // Record exit event when component unmounts
    useEffect(() => {
        return () => {
            if (videoRef.current && playStartTime !== null) {
                const timeSpent = Date.now() - playStartTime;
                recordAnalyticsEvent('exit', Math.floor(timeSpent / 1000));
            }
        };
    }, [lessonId, playStartTime, recordAnalyticsEvent]);

    // Auto-save progress when playing
    useEffect(() => {
        if (!videoRef.current || !isPlaying) return;

        const interval = setInterval(async () => {
            if (!videoRef.current) return;
            const videoDuration = actualDuration || duration;
            if (!videoDuration || videoDuration <= 0) return;

            try {
                const currentTime = videoRef.current.currentTime;
                const progressValue = Math.round((currentTime / videoDuration) * 100);

                await videoService.saveProgress(lessonId, {
                    currentTime,
                    progress: progressValue,
                    watchTime,
                });

                // Mark as completed if >= 80%
                if (progressValue >= 80 && !savedProgress?.completed) {
                    await videoService.markCompleted(lessonId);
                    if (onComplete) {
                        onComplete();
                    }
                }
            } catch (error) {
                console.error('Failed to save progress:', error);
            }
        }, 10000); // Every 10 seconds

        return () => clearInterval(interval);
    }, [isPlaying, lessonId, actualDuration, duration, watchTime, savedProgress, onComplete]);

    /* Video.js initialization - DISABLED - using simple HTML5 video instead
    useEffect(() => {
        // Dispose existing player if any
        if (playerRef.current && !playerRef.current.isDisposed()) {
            try {
                console.log('🔄 Disposing existing player before creating new one');
                playerRef.current.dispose();
            } catch (error) {
                console.warn('⚠️ Error disposing player:', error);
            }
            playerRef.current = null;
        }

        // Wait for next tick to ensure DOM is ready
        const initTimer = setTimeout(() => {
            if (!containerRef.current) {
                console.warn('⚠️ VideoPlayer: containerRef.current is null');
                return;
            }

            // Check if element is actually in DOM
            if (!document.body.contains(containerRef.current)) {
                console.warn('⚠️ VideoPlayer: containerRef.current is not in DOM');
                return;
            }

            if (!videoUrl) {
                console.warn('⚠️ VideoPlayer: videoUrl is empty', { lessonId, videoUrl });
                return;
            }

            console.log('🎬 Initializing Video.js player:', { lessonId, videoUrl });

            // Detect mobile device
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
                (window.innerWidth <= 768);

            // Check if URL is from Cloudinary (needs crossOrigin)
            const isCloudinary = videoUrl.includes('cloudinary.com');
            const isExternal = videoUrl.startsWith('http://') || videoUrl.startsWith('https://');

            // Initialize player with mobile optimizations
            // Set sources directly in config for better reliability
            const playerOptions: any = {
                controls: true,
                responsive: true,
                fluid: true,
                playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
                preload: isMobile ? 'metadata' : 'auto',
                playsinline: true,
                html5: {
                    vhs: {
                        overrideNative: true,
                    },
                    nativeVideoTracks: false,
                    nativeAudioTracks: false,
                    nativeTextTracks: false,
                },
                sources: [{
                    src: videoUrl,
                    type: getVideoMimeType(videoUrl),
                }],
                // Mobile-specific settings
                ...(isMobile && {
                    controlBar: {
                        volumePanel: {
                            inline: false,
                        },
                    },
                }),
            };

            // Add crossOrigin for external videos (Cloudinary, etc.)
            if (isCloudinary || isExternal) {
                playerOptions.html5 = {
                    ...playerOptions.html5,
                    nativeVideoTracks: false,
                    nativeAudioTracks: false,
                    nativeTextTracks: false,
                };
            }

            const player = videojs(containerRef.current, playerOptions, () => {
                // This callback runs after player is initialized
                console.log('🎬 Video.js player initialized');
            });

            playerRef.current = player;

            // Set crossOrigin attribute on video element for Cloudinary/external videos
            // Do this immediately after player creation, not in ready callback
            if (isCloudinary || isExternal) {
                // Try to set crossOrigin immediately
                const trySetCrossOrigin = () => {
                    const videoEl = player.el()?.querySelector('video') as HTMLVideoElement;
                    if (videoEl) {
                        videoEl.setAttribute('crossorigin', 'anonymous');
                        videoEl.crossOrigin = 'anonymous';
                        console.log('✅ Set crossOrigin="anonymous" for external video');
                        return true;
                    }
                    return false;
                };

                // Try immediately
                if (!trySetCrossOrigin()) {
                    // If video element not ready, try in ready callback
                    player.ready(() => {
                        trySetCrossOrigin();
                    });
                }
            }

            // Helper function to handle video ready
            const handleVideoReady = (playerInstance: any, videoEl: HTMLVideoElement) => {
                if (!videoUrl) return;

                try {
                    // Check current source
                    let currentSrc: string | undefined;
                    try {
                        const playerSrc = (playerInstance as any).src();
                        currentSrc = typeof playerSrc === 'string' ? playerSrc : playerSrc?.src || undefined;
                    } catch (e) {
                        currentSrc = videoEl.src || videoEl.currentSrc || undefined;
                    }

                    // Normalize URLs for comparison
                    const normalizeUrl = (url: string) => {
                        try {
                            const urlObj = new URL(url);
                            return urlObj.origin + urlObj.pathname;
                        } catch {
                            return url.split('?')[0].split('#')[0];
                        }
                    };

                    const normalizedCurrent = currentSrc ? normalizeUrl(currentSrc) : '';
                    const normalizedExpected = normalizeUrl(videoUrl);

                    console.log('🔍 Source verification:', {
                        currentSrc,
                        expectedUrl: videoUrl,
                        normalizedCurrent,
                        normalizedExpected,
                        matches: normalizedCurrent === normalizedExpected,
                        videoElementSrc: videoEl.src,
                        videoElementCurrentSrc: videoEl.currentSrc,
                        readyState: videoEl.readyState,
                        networkState: videoEl.networkState
                    });

                    // If source doesn't match, update it (shouldn't happen if set in config, but just in case)
                    if (!currentSrc || normalizedCurrent !== normalizedExpected) {
                        console.warn('⚠️ Source mismatch detected, updating...');

                        const sourceObj = {
                            src: videoUrl,
                            type: getVideoMimeType(videoUrl)
                        };

                        try {
                            playerInstance.src(sourceObj);
                            console.log('✅ Video source updated via player.src()');
                        } catch (srcError) {
                            console.error('❌ Error updating source:', srcError);
                        }
                    } else {
                        console.log('✅ Source is correctly set');
                    }

                    // Ensure video loads (sometimes needed even with sources in config)
                    setTimeout(() => {
                        try {
                            if (playerInstance && !playerInstance.isDisposed()) {
                                const currentVideoEl = playerInstance.el()?.querySelector('video') as HTMLVideoElement;
                                if (currentVideoEl && currentVideoEl.tagName === 'VIDEO') {
                                    // Only trigger load if video hasn't started loading
                                    if (currentVideoEl.readyState === 0 || currentVideoEl.networkState === 0) {
                                        // Check if load method exists and is callable
                                        if (typeof playerInstance.load === 'function') {
                                            try {
                                                playerInstance.load();
                                                console.log('✅ Video load() called');
                                            } catch (loadErr) {
                                                // If player.load() fails, try video element load directly
                                                if (typeof currentVideoEl.load === 'function') {
                                                    try {
                                                        currentVideoEl.load();
                                                        console.log('✅ Video element load() called directly');
                                                    } catch (elLoadErr) {
                                                        console.warn('⚠️ Both player.load() and videoEl.load() failed:', elLoadErr);
                                                    }
                                                }
                                            }
                                        } else if (typeof currentVideoEl.load === 'function') {
                                            // Fallback to video element load
                                            try {
                                                currentVideoEl.load();
                                                console.log('✅ Video element load() called (fallback)');
                                            } catch (elLoadErr) {
                                                console.warn('⚠️ Video element load() failed:', elLoadErr);
                                            }
                                        }
                                    } else {
                                        console.log('✅ Video already loading/loaded, no need to call load()');
                                    }
                                } else {
                                    console.warn('⚠️ Video element not available for load()');
                                }
                            }
                        } catch (loadError) {
                            console.error('❌ Error triggering video load:', loadError);
                        }
                    }, 200);
                } catch (error) {
                    console.error('❌ Error in handleVideoReady:', error);
                }
            };

            // Player ready event
            player.ready(() => {
                console.log('✅ Video.js player ready');

                // Get video element - should exist now since we added it to JSX
                const videoEl = player.el()?.querySelector('video') as HTMLVideoElement;

                if (videoEl && videoEl.tagName === 'VIDEO') {
                    console.log('✅ Video element found');
                    setIsReady(true);

                    // Set crossOrigin if needed
                    if ((isCloudinary || isExternal) && !videoEl.crossOrigin) {
                        videoEl.setAttribute('crossorigin', 'anonymous');
                        videoEl.crossOrigin = 'anonymous';
                        console.log('✅ Set crossOrigin="anonymous" for external video');
                    }

                    handleVideoReady(player, videoEl);

                    // Load saved progress
                    if (autoResume) {
                        loadProgress();
                    }

                    // Load subtitles
                    if (subtitles.length > 0 && !selectedSubtitle) {
                        setSelectedSubtitle(subtitles[0]);
                    }

                    // Setup keyboard shortcuts
                    setupKeyboardShortcuts();
                } else {
                    console.error('❌ Video element not found in player container');
                    // Try to find it with a small delay
                    setTimeout(() => {
                        const retryVideoEl = player.el()?.querySelector('video') as HTMLVideoElement;
                        if (retryVideoEl && retryVideoEl.tagName === 'VIDEO') {
                            console.log('✅ Video element found on retry');
                            setIsReady(true);
                            handleVideoReady(player, retryVideoEl);

                            if (autoResume) {
                                loadProgress();
                            }
                            if (subtitles.length > 0 && !selectedSubtitle) {
                                setSelectedSubtitle(subtitles[0]);
                            }
                            setupKeyboardShortcuts();
                        } else {
                            console.error('❌ Video element still not found after retry');
                            setIsReady(true); // Set ready anyway to prevent blocking
                        }
                    }, 200);
                }
            });

            // Time update event
            player.on('timeupdate', () => {
                const time = player.currentTime();
                if (time !== undefined && !isNaN(time)) {
                    setCurrentTime(time);

                    if (duration && duration > 0) {
                        const newProgress = Math.round((time / duration) * 100);
                        setProgress(newProgress);
                        if (onProgressUpdate) {
                            onProgressUpdate(newProgress);
                        }
                    }
                }
            });

            // Play event
            player.on('play', () => {
                setIsPlaying(true);
                recordAnalyticsEvent('play');
                setLastEventTime(Date.now());
            });

            // Pause event
            player.on('pause', () => {
                setIsPlaying(false);
                if (lastEventTime > 0) {
                    const timeSpent = (Date.now() - lastEventTime) / 1000;
                    recordAnalyticsEvent('pause', timeSpent);
                    setWatchTime(prev => prev + timeSpent);
                }
                saveProgress();
            });

            // Seek event
            player.on('seeked', () => {
                recordAnalyticsEvent('seek');
                saveProgress();
            });

            // Volume change (reserved for future use)
            // player.on('volumechange', () => {
            //   setVolume(player.volume());
            // });

            // Rate change (reserved for future use)
            // player.on('ratechange', () => {
            //   setPlaybackRate(player.playbackRate());
            // });

            // Ended event
            player.on('ended', () => {
                setIsPlaying(false);
                recordAnalyticsEvent('complete');
                if (onComplete) {
                    onComplete();
                }
            });

            // Error handling
            player.on('error', () => {
                const error = player.error();
                if (error) {
                    const videoEl = player.el()?.querySelector('video') as HTMLVideoElement;
                    const currentSrc = videoEl?.src || videoEl?.currentSrc || 'unknown';

                    console.error('❌ Video.js error:', {
                        code: error.code,
                        message: error.message,
                        videoUrl,
                        currentSrc,
                        lessonId,
                        videoElement: {
                            src: videoEl?.src,
                            currentSrc: videoEl?.currentSrc,
                            networkState: videoEl?.networkState,
                            readyState: videoEl?.readyState,
                            error: videoEl?.error
                        },
                        errorDetails: error
                    });

                    // Provide more helpful error messages
                    let errorMessage = 'Lỗi video: ';
                    switch (error.code) {
                        case 1: // MEDIA_ERR_ABORTED
                            errorMessage += 'Video bị hủy khi đang tải';
                            break;
                        case 2: // MEDIA_ERR_NETWORK
                            errorMessage += 'Lỗi mạng. Vui lòng kiểm tra kết nối internet.';
                            break;
                        case 3: // MEDIA_ERR_DECODE
                            errorMessage += 'Lỗi giải mã video. Định dạng video có thể không được hỗ trợ.';
                            break;
                        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
                            errorMessage += 'Định dạng video không được hỗ trợ. Vui lòng thử video khác.';
                            // For Cloudinary videos, suggest checking CORS
                            if (videoUrl.includes('cloudinary.com')) {
                                errorMessage += ' (Có thể do vấn đề CORS với Cloudinary)';
                            }
                            break;
                        default:
                            errorMessage += error.message || 'Lỗi không xác định';
                    }

                    setVideoError(errorMessage);
                    toast.error(errorMessage);
                }
            });

            // Loadstart event - when video starts loading
            player.on('loadstart', () => {
                console.log('🔄 Video loading started:', videoUrl);
            });

            // Loadedmetadata event - when video metadata is loaded
            player.on('loadedmetadata', () => {
                const videoEl = player.el()?.querySelector('video') as HTMLVideoElement;
                console.log('✅ Video metadata loaded:', {
                    duration: player.duration(),
                    videoUrl,
                    currentSrc: videoEl?.currentSrc || videoEl?.src,
                    videoWidth: player.videoWidth(),
                    videoHeight: player.videoHeight(),
                    readyState: videoEl?.readyState,
                    networkState: videoEl?.networkState
                });
                setVideoError(null); // Clear any previous errors
            });

            // Canplay event - when video can start playing
            player.on('canplay', () => {
                const videoEl = player.el()?.querySelector('video') as HTMLVideoElement;
                console.log('▶️ Video can play:', {
                    videoUrl,
                    currentSrc: videoEl?.currentSrc || videoEl?.src,
                    readyState: videoEl?.readyState
                });
            });

            // Loadeddata event - when first frame is loaded
            player.on('loadeddata', () => {
                console.log('✅ Video data loaded - first frame ready');
            });

            // Waiting event - when video is waiting for data
            player.on('waiting', () => {
                console.log('⏳ Video waiting for data...');
            });

            // Stalled event - when video loading is stalled
            player.on('stalled', () => {
                console.warn('⚠️ Video loading stalled');
            });

            // Suspend event - when video loading is suspended
            player.on('suspend', () => {
                console.warn('⚠️ Video loading suspended');
            });
        }, 100); // Wait 100ms for DOM to be ready

        // Cleanup
        return () => {
            clearTimeout(initTimer);
            setIsReady(false);

            if (playerRef.current) {
                try {
                    const player = playerRef.current;
                    // Check if player exists and is not disposed
                    if (player && typeof player.dispose === 'function') {
                        // Check if player element exists
                        const playerEl = player.el();
                        if (playerEl) {
                            // Remove all event listeners before dispose
                            try {
                                player.off(); // Remove all event listeners
                            } catch (e) {
                                console.warn('Error removing event listeners:', e);
                            }

                            // Dispose player
                            if (!player.isDisposed()) {
                                player.dispose();
                                console.log('✅ Video.js player disposed');
                            }
                        } else {
                            // Player element already removed, just clear reference
                            console.log('⚠️ Player element already removed from DOM');
                        }
                    }
                } catch (error) {
                    console.warn('Error disposing Video.js player:', error);
                } finally {
                    playerRef.current = null;
                }
            }

            if (progressSaveIntervalRef.current) {
                clearInterval(progressSaveIntervalRef.current);
                progressSaveIntervalRef.current = null;
            }
            if (analyticsIntervalRef.current) {
                clearInterval(analyticsIntervalRef.current);
                analyticsIntervalRef.current = null;
            }
        };
    }, [videoUrl, lessonId]);
    */

    // Handle note clicks
    const handleNoteClick = useCallback((timestamp: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = timestamp;
            videoRef.current.play();
        }
        if (onNoteClick) {
            onNoteClick(timestamp);
        }
    }, [onNoteClick]);

    // Format time helper
    const formatTime = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };


    return (
        <div className="video-player-container">
            <video
                ref={videoRef}
                src={videoUrl}
                controls
                playsInline
                preload="auto"
                crossOrigin={videoUrl?.includes('cloudinary.com') ? 'anonymous' : undefined}
                onLoadedMetadata={(e) => {
                    // Priority: For Cloudinary videos, use video element duration (most accurate)
                    // For YouTube/external videos without video element, use duration prop
                    const video = e.currentTarget;
                    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
                        // Video element exists (Cloudinary video) - use its duration (most accurate)
                        setActualDuration(video.duration);
                        console.log('✅ Video duration loaded from video element:', video.duration, 'seconds');
                    } else if (duration && duration > 0) {
                        // No video element (YouTube/external) - use duration from props
                        setActualDuration(duration);
                        console.log('✅ Video duration from props (YouTube/external):', duration, 'seconds');
                    }
                }}
                onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    const time = video.currentTime;
                    setCurrentTime(time);

                    // Detect seek event (time jump > 2 seconds)
                    if (Math.abs(time - previousTime) > 2 && previousTime > 0) {
                        recordAnalyticsEvent('seek');
                    }
                    setPreviousTime(time);

                    // Pass currentTime to parent component (for VideoNotes)
                    if (onTimeUpdate) {
                        onTimeUpdate(time);
                    }

                    // Calculate progress using actualDuration (from video element) or duration prop
                    const videoDuration = actualDuration || duration;
                    if (videoDuration && videoDuration > 0) {
                        const newProgress = Math.round((time / videoDuration) * 100);
                        setProgress(newProgress);
                        if (onProgressUpdate) {
                            onProgressUpdate(newProgress);
                        }
                    }
                }}
                onEnded={() => {
                    setIsPlaying(false);
                    // Record complete event
                    if (playStartTime !== null) {
                        const timeSpent = Date.now() - playStartTime;
                        recordAnalyticsEvent('complete', Math.floor(timeSpent / 1000));
                        setPlayStartTime(null);
                    } else {
                        recordAnalyticsEvent('complete');
                    }
                    if (onComplete) {
                        onComplete();
                    }
                }}
                onPlay={() => {
                    setIsPlaying(true);
                    setPlayStartTime(Date.now());
                    recordAnalyticsEvent('play');
                }}
                onPause={() => {
                    setIsPlaying(false);
                    // Record pause event with time spent
                    if (playStartTime !== null) {
                        const timeSpent = Date.now() - playStartTime;
                        recordAnalyticsEvent('pause', Math.floor(timeSpent / 1000));
                        setPlayStartTime(null);
                    } else {
                        recordAnalyticsEvent('pause');
                    }
                }}
                onError={(e) => {
                    console.error('Video error:', e);
                    setVideoError('Không thể phát video');
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
            />

            {/* Subtitle selector */}
            {subtitles.length > 0 && (
                <div className="video-player-subtitle-controls">
                    <label htmlFor="subtitle-select" className="sr-only">
                        Select subtitle language
                    </label>
                    <select
                        id="subtitle-select"
                        value={selectedSubtitle?._id || ''}
                        onChange={(e) => {
                            const subtitle = subtitles.find(s => s._id === e.target.value);
                            setSelectedSubtitle(subtitle || null);
                        }}
                        aria-label="Subtitle language selector"
                    >
                        <option value="">No subtitles</option>
                        {subtitles.map((subtitle) => (
                            <option key={subtitle._id} value={subtitle._id}>
                                {subtitle.language.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Notes timeline markers */}
            {notes.length > 0 && (actualDuration || duration) && (
                <div className="video-player-notes-timeline" role="list" aria-label="Video notes timeline">
                    {notes.map((note) => {
                        const videoDuration = actualDuration || duration || 0;
                        return (
                            <button
                                key={note._id}
                                className="video-player-note-marker"
                                style={{
                                    left: `${(note.timestamp / videoDuration) * 100}%`,
                                }}
                                onClick={() => handleNoteClick(note.timestamp)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleNoteClick(note.timestamp);
                                    }
                                }}
                                aria-label={`Note at ${formatTime(note.timestamp)}: ${note.content.substring(0, 50)}`}
                                title={note.content.substring(0, 50)}
                                type="button"
                            />
                        );
                    })}
                </div>
            )}

            {/* Progress info */}
            <div className="video-player-progress-info" role="status" aria-live="polite" aria-atomic="true">
                <span aria-label={`Current time: ${formatTime(currentTime)}`}>
                    {formatTime(currentTime)} / {(actualDuration || duration) ? formatTime(actualDuration || duration || 0) : '--:--'}
                </span>
                <span aria-label={`Progress: ${progress} percent watched`}>
                    {progress}% watched
                </span>
            </div>
        </div>
    );
};

export default VideoPlayer;
