// src/pages/Index.tsx
import { useState, useEffect } from "react";
import { ProctorDashboard } from "@/components/ProctorDashboard";
import { ExtensionDetector } from "@/components/ExtensionDetector";
import { VideoMonitor } from "@/components/VideoMonitor";
import { AudioMonitor } from "@/components/AudioMonitor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [extensionsCount, setExtensionsCount] = useState(0);
  const [attentionScore, setAttentionScore] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const { toast } = useToast();

  const calculateSystemStatus = (): 'safe' | 'warning' | 'danger' => {
    if (extensionsCount > 5 || attentionScore < 50 || audioLevel > 80) {
      return 'danger';
    }
    if (extensionsCount > 3 || attentionScore < 70 || audioLevel > 60) {
      return 'warning';
    }
    return 'safe';
  };

  const stats = {
    extensionsCount,
    attentionScore,
    audioLevel,
    alertsCount,
    isVideoActive,
    isAudioActive,
    status: calculateSystemStatus(),
  };

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    setAlertsCount(0);
    toast({
      title: "Monitoring Started",
      description: "Exam proctoring system is now active",
      duration: 3000,
    });
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    toast({
      title: "Monitoring Stopped",
      description: "Exam proctoring system has been deactivated",
      duration: 3000,
    });
  };

  // Alert system
  useEffect(() => {
    if (!isMonitoring) return;

    const status = calculateSystemStatus();
    if (status === 'danger') {
      setAlertsCount(prev => prev + 1);
      toast({
        title: "Security Alert!",
        description: "Potential exam violation detected",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [extensionsCount, attentionScore, audioLevel, isMonitoring]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Watch-fair-AI</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Exam Proctoring System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {stats.status === 'safe' && <CheckCircle className="h-5 w-5 text-monitor-good" />}
                {stats.status === 'warning' && <AlertTriangle className="h-5 w-5 text-monitor-warning" />}
                {stats.status === 'danger' && <AlertTriangle className="h-5 w-5 text-monitor-danger" />}
                <span className="text-sm font-medium">
                  System {stats.status.charAt(0).toUpperCase() + stats.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Dashboard Sidebar */}
        <ProctorDashboard
          stats={stats}
          onStartMonitoring={handleStartMonitoring}
          onStopMonitoring={handleStopMonitoring}
          isMonitoring={isMonitoring}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Card */}
          <Card className="bg-gradient-primary text-primary-foreground shadow-glow">
            <CardHeader>
              <CardTitle className="text-2xl">AI-Powered Exam Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-foreground/90">
                Advanced proctoring system with real-time extension detection, attention tracking, 
                and audio analysis to ensure exam integrity.
              </p>
            </CardContent>
          </Card>

          {/* Monitoring Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Extension Monitor */}
            <ExtensionDetector 
              onExtensionCountChange={setExtensionsCount}
            />

            {/* Video Monitor */}
            <VideoMonitor
              onAttentionScoreChange={setAttentionScore}
              onVideoStatusChange={setIsVideoActive}
              isMonitoring={isMonitoring}
            />

            {/* Audio Monitor */}
            <AudioMonitor
              onAudioLevelChange={setAudioLevel}
              onAudioStatusChange={setIsAudioActive}
              isMonitoring={isMonitoring}
            />
          </div>

          {/* System Information */}
          <Card className="bg-card/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Extension Detection</h4>
                  <p className="text-muted-foreground">
                    Monitors all browser extensions and identifies potential security risks 
                    that could compromise exam integrity.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Attention Tracking</h4>
                  <p className="text-muted-foreground">
                    Uses AI-powered computer vision to track student attention and detect 
                    when they look away from the screen.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Audio Analysis</h4>
                  <p className="text-muted-foreground">
                    Continuously analyzes audio for suspicious sounds like multiple voices, 
                    communication devices, or other violations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Index;
