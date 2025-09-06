import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chrome, Shield, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Extension {
  id: string;
  name: string;
  enabled: boolean;
  version?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ExtensionDetectorProps {
  onExtensionCountChange: (count: number) => void;
}

export function ExtensionDetector({ onExtensionCountChange }: ExtensionDetectorProps) {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const detectExtensions = async () => {
    setIsScanning(true);
    
    // Simulate extension detection (in real implementation, would use browser APIs)
    setTimeout(() => {
      const mockExtensions: Extension[] = [
        { id: '1', name: 'AdBlock Plus', enabled: true, version: '3.15.1', riskLevel: 'low' },
        { id: '2', name: 'LastPass', enabled: true, version: '4.95.0', riskLevel: 'medium' },
        { id: '3', name: 'Grammarly', enabled: true, version: '14.924.0', riskLevel: 'medium' },
        { id: '4', name: 'Screen Recorder', enabled: true, version: '2.1.0', riskLevel: 'high' },
        { id: '5', name: 'Mouse Recorder', enabled: false, version: '1.3.0', riskLevel: 'high' },
        { id: '6', name: 'Chrome DevTools', enabled: true, riskLevel: 'high' },
      ];
      
      setExtensions(mockExtensions);
      onExtensionCountChange(mockExtensions.filter(ext => ext.enabled).length);
      setLastScan(new Date());
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => {
    detectExtensions();
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'monitor-danger';
      case 'medium': return 'monitor-warning';
      case 'low': return 'monitor-good';
      default: return 'monitor-neutral';
    }
  };

  const enabledExtensions = extensions.filter(ext => ext.enabled);
  const highRiskExtensions = enabledExtensions.filter(ext => ext.riskLevel === 'high');

  return (
    <Card className="h-full bg-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Chrome className="h-5 w-5 text-primary" />
            Extension Monitor
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={detectExtensions}
            disabled={isScanning}
          >
            {isScanning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isScanning ? 'Scanning...' : 'Refresh'}
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Total: {enabledExtensions.length}</span>
          {highRiskExtensions.length > 0 && (
            <div className="flex items-center gap-1 text-monitor-danger">
              <AlertTriangle className="h-4 w-4" />
              <span>{highRiskExtensions.length} High Risk</span>
            </div>
          )}
          {lastScan && (
            <span>Last scan: {lastScan.toLocaleTimeString()}</span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {extensions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Chrome className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No extensions detected</p>
              </div>
            ) : (
              extensions.map((extension) => (
                <div
                  key={extension.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all",
                    extension.enabled 
                      ? "bg-card border-border" 
                      : "bg-muted/50 border-muted opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      extension.enabled ? "bg-monitor-good" : "bg-monitor-neutral"
                    )} />
                    <div>
                      <div className="font-medium text-sm">{extension.name}</div>
                      {extension.version && (
                        <div className="text-xs text-muted-foreground">
                          v{extension.version}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={cn(
                        "text-xs border-current",
                        `text-${getRiskColor(extension.riskLevel)} border-${getRiskColor(extension.riskLevel)}/30`
                      )}
                    >
                      {extension.riskLevel.toUpperCase()}
                    </Badge>
                    
                    {!extension.enabled && (
                      <Badge variant="secondary" className="text-xs">
                        DISABLED
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {highRiskExtensions.length > 0 && (
          <div className="mt-4 p-3 bg-monitor-danger/10 border border-monitor-danger/30 rounded-lg">
            <div className="flex items-center gap-2 text-monitor-danger text-sm font-medium mb-1">
              <Shield className="h-4 w-4" />
              Security Alert
            </div>
            <p className="text-sm text-muted-foreground">
              {highRiskExtensions.length} high-risk extension(s) detected that could interfere with exam integrity.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}