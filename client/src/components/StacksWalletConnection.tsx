import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  Network, 
  Coins, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Download
} from "lucide-react";
import { useStacksWallet } from "@/hooks/useStacksWallet";
import { useToast } from "@/hooks/use-toast";

export default function StacksWalletConnection() {
  const {
    isConnected,
    account,
    balance,
    network,
    isLoading,
    error,
    isLeatherAvailable,
    isStacksWalletAvailable,
    connectLeather,
    connectStacksWallet,
    disconnect,
    switchNetwork,
    requestTestnetSTX,
    refreshBalance,
  } = useStacksWallet();

  const { toast } = useToast();
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const handleConnectLeather = async () => {
    try {
      await connectLeather();
    } catch (error) {
      console.error("Leather connection failed:", error);
    }
  };

  const handleConnectStacks = async () => {
    try {
      await connectStacksWallet();
    } catch (error) {
      console.error("Stacks wallet connection failed:", error);
    }
  };

  const handleNetworkSwitch = async () => {
    const newNetwork = network === "testnet" ? "mainnet" : "testnet";
    await switchNetwork(newNetwork);
  };

  const handleFaucetRequest = async () => {
    await requestTestnetSTX();
  };

  if (!isLeatherAvailable() && !isStacksWalletAvailable()) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Connect Stacks Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Download className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              No Stacks wallet detected. Please install a compatible wallet to continue.
            </p>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowInstallGuide(!showInstallGuide)}
              >
                <Download className="w-4 h-4 mr-2" />
                Show Installation Guide
              </Button>
            </div>

            {showInstallGuide && (
              <div className="mt-4 p-4 bg-muted rounded-lg text-left">
                <h4 className="font-medium mb-2">Install Leather Wallet:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://leather.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">leather.io</a></li>
                  <li>Click "Install Extension"</li>
                  <li>Add to your browser</li>
                  <li>Create or import a wallet</li>
                  <li>Switch to Testnet in settings</li>
                </ol>
                
                <div className="mt-3 pt-3 border-t">
                  <h4 className="font-medium mb-2">Alternative: Stacks Wallet</h4>
                  <p className="text-xs text-muted-foreground">
                    You can also use the official Stacks wallet extension from the browser store.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Wallet Connected</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Account Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Address:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </code>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Balance:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono">{balance || "0"} STX</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshBalance}
                  disabled={isLoading}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Network:</span>
              <Badge variant={network === "testnet" ? "secondary" : "default"}>
                <Network className="w-3 h-3 mr-1" />
                {network.charAt(0).toUpperCase() + network.slice(1)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Network Controls */}
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={handleNetworkSwitch}
              disabled={isLoading}
              className="w-full"
            >
              <Network className="w-4 h-4 mr-2" />
              Switch to {network === "testnet" ? "Mainnet" : "Testnet"}
            </Button>

            {network === "testnet" && (
              <Button
                variant="outline"
                onClick={handleFaucetRequest}
                disabled={isLoading}
                className="w-full"
              >
                <Coins className="w-4 h-4 mr-2" />
                Get Testnet STX
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          <Separator />

          {/* Disconnect */}
          <Button
            variant="destructive"
            onClick={disconnect}
            className="w-full"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="w-5 h-5" />
          <span>Connect Stacks Wallet</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {isLeatherAvailable() && (
            <Button
              onClick={handleConnectLeather}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              {isLoading ? "Connecting..." : "Connect Leather Wallet"}
            </Button>
          )}

          {isStacksWalletAvailable() && (
            <Button
              variant="outline"
              onClick={handleConnectStacks}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              {isLoading ? "Connecting..." : "Connect Stacks Wallet"}
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By connecting, you agree to our terms of service and privacy policy.
          </p>
        </div>

        {/* Network Info */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Default Network:</span>
            <Badge variant="secondary">Testnet</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Testnet is recommended for development and testing. You can switch to mainnet after connecting.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
