import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoMonitorProps {
  onAttentionScoreChange: (score: number) => void;
  onVideoStatusChange: (isActive: boolean) => void;
}

export function VideoMonitor({ onAttentionScoreChange, onVideoStatusChange }: VideoMonitorProps) {
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [attentionScore, setAttentionScore] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isLookingAtScreen, setIsLookingAtScreen] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setIsVideoActive(true);
      onVideoStatusChange(true);
      
      // Start monitoring simulation
      startFaceDetection();
    } catch (error) {
      console.error('Error accessing camera:', error);
      addViolation('Camera access denied');
    }
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsVideoActive(false);
    onVideoStatusChange(false);
    setFaceDetected(false);
    setIsLookingAtScreen(false);
    setAttentionScore(0);
    onAttentionScoreChange(0);
  };

  const startFaceDetection = () => {
    // Simulate face detection and attention monitoring
    const interval = setInterval(() => {
      if (!isVideoActive) {
        clearInterval(interval);
        return;
      }

      // Simulate face detection
      const faceDetected = Math.random() > 0.1; // 90% chance of face detection
      setFaceDetected(faceDetected);

      if (!faceDetected) {
        addViolation('No face detected');
        setIsLookingAtScreen(false);
        setAttentionScore(0);
        onAttentionScoreChange(0);
        return;
      }

      // Simulate eye tracking / attention detection
      const lookingAtScreen = Math.random() > 0.3; // 70% chance looking at screen
      setIsLookingAtScreen(lookingAtScreen);

      if (!lookingAtScreen) {
        addViolation('Student looking away from screen');
      }

      // Calculate attention score
      const currentScore = lookingAtScreen ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 50);
      setAttentionScore(currentScore);
      onAttentionScoreChange(currentScore);

      // Additional violation checks
      if (Math.random() > 0.95) { // 5% chance of detecting multiple faces
        addViolation('Multiple faces detected');
      }
      
      if (Math.random() > 0.98) { // 2% chance of detecting suspicious movement
        addViolation('Suspicious movement detected');
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  const addViolation = (violation: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setViolations(prev => [`[${timestamp}] ${violation}`, ...prev.slice(0, 4)]);
  };

  const getAttentionStatus = () => {
    if (!faceDetected) return { status: 'danger', text: 'No Face' };
    if (!isLookingAtScreen) return { status: 'warning', text: 'Looking Away' };
    if (attentionScore >= 80) return { status: 'good', text: 'Focused' };
    if (attentionScore >= 60) return { status: 'warning', text: 'Distracted' };
    return { status: 'danger', text: 'Not Focused' };
  };

  const attentionStatus = getAttentionStatus();

  useEffect(() => {
    return () => {
      stopVideo();
    };
  }, []);

  return (
    <Card className="h-full bg-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Video Monitor
          </CardTitle>
          <Button
            variant={isVideoActive ? "destructive" : "default"}
            size="sm"
            onClick={isVideoActive ? stopVideo : startVideo}
          >
            {isVideoActive ? (
              <>
                <CameraOff className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Video Feed */}
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={cn(
              "w-full h-48 bg-secondary rounded-lg object-cover",
              !isVideoActive && "hidden"
            )}
          />
          
          {!isVideoActive && (
            <div className="w-full h-48 bg-secondary rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Camera not active</p>
              </div>
            </div>
          )}

          {/* Status Overlay */}
          {isVideoActive && (
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge 
                variant="outline"
                className={cn(
                  "bg-background/80 backdrop-blur-sm",
                  faceDetected ? "text-monitor-good border-monitor-good/30" : "text-monitor-danger border-monitor-danger/30"
                )}
              >
                {faceDetected ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                {faceDetected ? 'Face Detected' : 'No Face'}
              </Badge>
            </div>
          )}

          {/* Attention Score */}
          {isVideoActive && (
            <div className="absolute top-2 right-2">
              <Badge 
                variant="outline"
                className={cn(
                  "bg-background/80 backdrop-blur-sm border-current",
                  `text-monitor-${attentionStatus.status} border-monitor-${attentionStatus.status}/30`
                )}
              >
                {attentionScore}% - {attentionStatus.text}
              </Badge>
            </div>
          )}
        </div>

        {/* Attention Metrics */}
        {isVideoActive && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Attention Level</span>
              <span className={cn(
                "font-medium",
                `text-monitor-${attentionStatus.status}`
              )}>
                {attentionScore}%
              </span>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  `bg-monitor-${attentionStatus.status}`
                )}
                style={{ width: `${attentionScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Recent Violations */}
        {violations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-monitor-danger mb-2">
              <AlertTriangle className="h-4 w-4" />
              Recent Violations
            </div>
            <div className="space-y-1">
              {violations.map((violation, index) => (
                <div
                  key={index}
                  className="text-xs text-muted-foreground bg-monitor-danger/10 border border-monitor-danger/20 rounded p-2"
                >
                  {violation}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Face Detection</span>
            <div className={cn(
              "w-2 h-2 rounded-full",
              faceDetected ? "bg-monitor-good" : "bg-monitor-danger"
            )} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Eye Tracking</span>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isLookingAtScreen ? "bg-monitor-good" : "bg-monitor-warning"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}