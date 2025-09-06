import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Eye, 
  Mic, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Chrome,
  Volume2,
  Camera,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProctorStats {
  extensionsCount: number;
  attentionScore: number;
  audioLevel: number;
  alertsCount: number;
  isVideoActive: boolean;
  isAudioActive: boolean;
  status: 'safe' | 'warning' | 'danger';
}

interface ProctorDashboardProps {
  stats: ProctorStats;
  onStartMonitoring: () => void;
  onStopMonitoring: () => void;
  isMonitoring: boolean;
}

export function ProctorDashboard({ 
  stats, 
  onStartMonitoring, 
  onStopMonitoring, 
  isMonitoring 
}: ProctorDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'monitor-good';
      case 'warning': return 'monitor-warning';
      case 'danger': return 'monitor-danger';
      default: return 'monitor-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'danger': return XCircle;
      default: return Shield;
    }
  };

  const StatusIcon = getStatusIcon(stats.status);

  return (
    <div className="w-80 bg-card border-r border-border p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full",
            `bg-${getStatusColor(stats.status)}/20`
          )}>
            <Shield className={cn("h-6 w-6", `text-${getStatusColor(stats.status)}`)} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Exam Proctor</h2>
            <p className="text-sm text-muted-foreground">Real-time monitoring</p>
          </div>
        </div>

        {/* Control Button */}
        <Button
          onClick={isMonitoring ? onStopMonitoring : onStartMonitoring}
          className={cn(
            "w-full",
            isMonitoring 
              ? "bg-destructive hover:bg-destructive/90" 
              : "bg-gradient-primary hover:opacity-90"
          )}
        >
          {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
        </Button>
      </div>

      {/* Status Overview */}
      <Card className="bg-card/50 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <StatusIcon className={cn("h-4 w-4", `text-${getStatusColor(stats.status)}`)} />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall</span>
            <Badge 
              variant="outline" 
              className={cn(
                "border-current",
                `text-${getStatusColor(stats.status)} border-${getStatusColor(stats.status)}/30`
              )}
            >
              {stats.status.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Alerts</span>
            <span className={cn(
              "text-sm font-medium",
              stats.alertsCount > 0 ? "text-monitor-danger" : "text-monitor-good"
            )}>
              {stats.alertsCount}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Stats */}
      <div className="space-y-4">
        {/* Extensions */}
        <Card className="bg-card/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Chrome className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Extensions</span>
              </div>
              <span className={cn(
                "text-sm font-bold",
                stats.extensionsCount > 5 ? "text-monitor-warning" : "text-monitor-good"
              )}>
                {stats.extensionsCount}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Attention Score */}
        <Card className="bg-card/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Attention</span>
              </div>
              <span className={cn(
                "text-sm font-bold",
                stats.attentionScore < 50 ? "text-monitor-danger" : 
                stats.attentionScore < 80 ? "text-monitor-warning" : "text-monitor-good"
              )}>
                {stats.attentionScore}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  stats.attentionScore < 50 ? "bg-monitor-danger" : 
                  stats.attentionScore < 80 ? "bg-monitor-warning" : "bg-monitor-good"
                )}
                style={{ width: `${stats.attentionScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Audio Level */}
        <Card className="bg-card/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Audio Level</span>
              </div>
              <span className={cn(
                "text-sm font-bold",
                stats.audioLevel > 70 ? "text-monitor-warning" : "text-monitor-good"
              )}>
                {stats.audioLevel}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  stats.audioLevel > 70 ? "bg-monitor-warning" : "bg-monitor-good"
                )}
                style={{ width: `${stats.audioLevel}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Services */}
      <Card className="bg-card/50 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Active Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="text-sm">Video Monitor</span>
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full",
              stats.isVideoActive ? "bg-monitor-good animate-pulse-glow" : "bg-monitor-neutral"
            )} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="text-sm">Audio Monitor</span>
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full",
              stats.isAudioActive ? "bg-monitor-good animate-pulse-glow" : "bg-monitor-neutral"
            )} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}