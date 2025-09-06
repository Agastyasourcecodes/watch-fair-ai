import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Volume2, AlertTriangle, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioEvent {
  id: string;
  type: 'normal' | 'suspicious' | 'violation';
  description: string;
  timestamp: Date;
  confidence: number;
}

interface AudioMonitorProps {
  onAudioLevelChange: (level: number) => void;
  onAudioStatusChange: (isActive: boolean) => void;
}

export function AudioMonitor({ onAudioLevelChange, onAudioStatusChange }: AudioMonitorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [events, setEvents] = useState<AudioEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      // Set up audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Set up recording
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Simulate audio analysis
          analyzeAudioChunk(event.data);
        }
      };

      mediaRecorder.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      onAudioStatusChange(true);
      
      // Start real-time audio level monitoring
      monitorAudioLevel();
      
      addEvent('normal', 'Audio monitoring started', 100);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      addEvent('violation', 'Microphone access denied', 95);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsRecording(false);
    onAudioStatusChange(false);
    setAudioLevel(0);
    onAudioLevelChange(0);
    
    addEvent('normal', 'Audio monitoring stopped', 100);
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current || !isRecording) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate RMS (Root Mean Square) for audio level
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const level = Math.min(100, (rms / 128) * 100);
      
      setAudioLevel(level);
      onAudioLevelChange(level);
      
      // Detect suspicious audio levels
      if (level > 70) {
        if (Math.random() > 0.7) { // Don't trigger too often
          addEvent('suspicious', 'High audio level detected', 75);
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  const analyzeAudioChunk = async (audioData: Blob) => {
    setIsProcessing(true);
    
    // Simulate audio analysis with random events
    setTimeout(() => {
      const eventTypes = [
        { type: 'normal', desc: 'Background noise detected', prob: 0.7 },
        { type: 'suspicious', desc: 'Multiple voices detected', prob: 0.15 },
        { type: 'suspicious', desc: 'Keyboard typing sounds', prob: 0.08 },
        { type: 'violation', desc: 'Communication device detected', prob: 0.05 },
        { type: 'violation', desc: 'Phone ringing detected', prob: 0.02 },
      ];
      
      const rand = Math.random();
      let cumulative = 0;
      
      for (const eventType of eventTypes) {
        cumulative += eventType.prob;
        if (rand <= cumulative) {
          if (eventType.type !== 'normal' || Math.random() > 0.8) {
            addEvent(
              eventType.type as 'normal' | 'suspicious' | 'violation',
              eventType.desc,
              Math.floor(Math.random() * 30) + 70
            );
          }
          break;
        }
      }
      
      setIsProcessing(false);
    }, 500);
  };

  const addEvent = (type: 'normal' | 'suspicious' | 'violation', description: string, confidence: number) => {
    const newEvent: AudioEvent = {
      id: Date.now().toString(),
      type,
      description,
      timestamp: new Date(),
      confidence,
    };
    
    setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'violation': return 'monitor-danger';
      case 'suspicious': return 'monitor-warning';
      case 'normal': return 'monitor-good';
      default: return 'monitor-neutral';
    }
  };

  const getAudioLevelColor = () => {
    if (audioLevel > 80) return 'monitor-danger';
    if (audioLevel > 60) return 'monitor-warning';
    return 'monitor-good';
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <Card className="h-full bg-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Audio Monitor
          </CardTitle>
          <Button
            variant={isRecording ? "destructive" : "default"}
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Audio Level Visualization */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span className="text-muted-foreground">Audio Level</span>
            </div>
            <span className={cn(
              "font-medium",
              `text-${getAudioLevelColor()}`
            )}>
              {Math.round(audioLevel)}%
            </span>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className={cn(
                "h-3 rounded-full transition-all duration-100",
                `bg-${getAudioLevelColor()}`
              )}
              style={{ width: `${audioLevel}%` }}
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Recording</span>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isRecording ? "bg-monitor-good animate-pulse" : "bg-monitor-neutral"
            )} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Processing</span>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isProcessing ? "bg-primary animate-pulse" : "bg-monitor-neutral"
            )} />
          </div>
        </div>

        {/* AI Analysis Results */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Headphones className="h-4 w-4" />
            AI Analysis Results
          </div>
          
          <ScrollArea className="h-40">
            <div className="space-y-2">
              {events.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No events detected</p>
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-3 rounded-lg border text-sm",
                      `border-${getEventColor(event.type)}/30 bg-${getEventColor(event.type)}/5`
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge 
                        variant="outline"
                        className={cn(
                          "text-xs border-current",
                          `text-${getEventColor(event.type)} border-${getEventColor(event.type)}/30`
                        )}
                      >
                        {event.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {event.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Violation Alert */}
        {events.some(e => e.type === 'violation') && (
          <div className="p-3 bg-monitor-danger/10 border border-monitor-danger/30 rounded-lg">
            <div className="flex items-center gap-2 text-monitor-danger text-sm font-medium mb-1">
              <AlertTriangle className="h-4 w-4" />
              Audio Violation Detected
            </div>
            <p className="text-xs text-muted-foreground">
              Suspicious audio activity detected. Exam integrity may be compromised.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}