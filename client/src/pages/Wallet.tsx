import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionHistory from "@/components/TransactionHistory";
import StacksWalletConnection from "@/components/StacksWalletConnection";
import StacksWorkflowGuide from "@/components/StacksWorkflowGuide";
import { Wallet as WalletIcon, TreePine, Waves, Mountain, Flame, Bitcoin, Network, Coins, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const projectTypeIcons = {
  mangrove: TreePine,
  seagrass: Waves,
  salt_marsh: Mountain,
};

export default function Wallet() {
  const { toast } = useToast();

  const { data: userCredits, isLoading } = useQuery({
    queryKey: ["/api/credits/owner", "user-2"], // Simulated user ID
  }) as { data: any[], isLoading: boolean };

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  }) as { data: any[] };

  const retireMutation = useMutation({
    mutationFn: async ({ creditId, retiredBy }: { creditId: string; retiredBy: string }) => {
      await apiRequest("PATCH", `/api/credits/${creditId}/retire`, {
        retiredBy
      });
      
      // Create retirement transaction
      await apiRequest("POST", "/api/transactions", {
        type: "retirement",
        creditId,
        fromUserId: retiredBy,
        toUserId: null,
        amount: 1,
        price: null
      });
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Credits Retired",
        description: "Your carbon credits have been permanently retired.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/credits/owner"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/user"] });
    },
    onError: () => {
      toast({
        title: "Retirement Failed",
        description: "There was an error retiring your credits.",
        variant: "destructive",
      });
    },
  });

  const handleRetire = (creditId: string) => {
    retireMutation.mutate({
      creditId,
      retiredBy: "user-2" // Simulated user ID
    });
  };

  // Calculate wallet stats
  const totalCredits = userCredits?.reduce((sum: number, credit: any) => 
    credit.status === "available" ? sum + credit.amount : sum, 0) || 0;
  
  const estimatedValue = userCredits?.reduce((sum: number, credit: any) => 
    credit.status === "available" ? sum + (parseFloat(credit.price) * credit.amount) : sum, 0) || 0;

  const getProjectName = (projectId: string) => {
    const project = projects?.find((p: any) => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  const getProjectType = (projectId: string) => {
    const project = projects?.find((p: any) => p.id === projectId);
    return project?.projectType || "mangrove";
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-40 bg-muted rounded"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-40 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Digital Wallet</h2>
        <p className="text-muted-foreground">Manage your carbon credits and blockchain transactions</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <WalletIcon className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="stacks" className="flex items-center space-x-2">
            <Bitcoin className="w-4 h-4" />
            <span>Stacks Wallet</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center space-x-2">
            <Network className="w-4 h-4" />
            <span>Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wallet Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Overview</CardTitle>
                <p className="text-sm text-muted-foreground">Your carbon credit portfolio</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg text-white mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-80">Total Credits Owned</p>
                      <p className="text-3xl font-bold" data-testid="text-total-credits-owned">
                        {totalCredits}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <WalletIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">
                      Estimated Value: <span data-testid="text-estimated-value">${estimatedValue.toFixed(2)}</span>
                    </span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/20">Active</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {userCredits?.filter((credit: any) => credit.status === "available").map((credit: any) => {
                    const IconComponent = projectTypeIcons[getProjectType(credit.projectId) as keyof typeof projectTypeIcons] || TreePine;
                    
                    return (
                      <div key={credit.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground" data-testid={`text-project-${credit.id}`}>
                              {getProjectName(credit.projectId)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {credit.amount} credits • ${credit.price} each
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetire(credit.id)}
                          disabled={retireMutation.isPending}
                          className="text-accent border-accent hover:bg-accent hover:text-accent-foreground"
                          data-testid={`button-retire-${credit.id}`}
                        >
                          <Flame className="w-4 h-4 mr-1" />
                          Retire
                        </Button>
                      </div>
                    );
                  })}

                  {(!userCredits || userCredits.filter((credit: any) => credit.status === "available").length === 0) && (
                    <div className="text-center py-8">
                      <WalletIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Credits Available</h3>
                      <p className="text-muted-foreground text-sm">
                        Visit the marketplace to purchase carbon credits.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your wallet and credits</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => window.location.href = '/marketplace'}
                  >
                    <TreePine className="w-6 h-6 mb-2" />
                    <span className="text-sm">Buy Credits</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => {
                      if (userCredits && userCredits.filter((credit: any) => credit.status === "available").length > 0) {
                        const firstCredit = userCredits.find((credit: any) => credit.status === "available");
                        if (firstCredit) handleRetire(firstCredit.id);
                      } else {
                        toast({
                          title: "No Credits Available",
                          description: "You need available credits to retire them.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Flame className="w-6 h-6 mb-2" />
                    <span className="text-sm">Retire Credits</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => toast({
                      title: "Transfer Feature",
                      description: "Credit transfer functionality coming soon!",
                    })}
                  >
                    <Network className="w-6 h-6 mb-2" />
                    <span className="text-sm">Transfer</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => {
                      const stacksTab = document.querySelector('[data-value="stacks"]');
                      if (stacksTab) {
                        (stacksTab as HTMLElement).click();
                      }
                    }}
                  >
                    <Bitcoin className="w-6 h-6 mb-2" />
                    <span className="text-sm">Stacks</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stacks" className="space-y-6">
          {/* Stacks Workflow Guide */}
          <StacksWorkflowGuide />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stacks Wallet Connection */}
            <div>
              <StacksWalletConnection />
            </div>

            {/* Stacks Network Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bitcoin className="w-5 h-5" />
                  <span>Stacks Network</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Bitcoin's layer for smart contracts</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Network:</span>
                    <Badge variant="secondary">Testnet</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chain ID:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">2147483648</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Block Time:</span>
                    <span className="text-sm">~10 minutes</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Testnet Faucet</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get free testnet STX tokens for development and testing.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open("https://faucet.learnweb3.io/", "_blank")}
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Get Testnet STX
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Blockchain Explorer</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    View transactions and smart contracts on the Stacks testnet.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open("https://explorer.hiro.so/?chain=testnet", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 ml-2" />
                    Open Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <p className="text-sm text-muted-foreground">Your blockchain transaction history</p>
            </CardHeader>
            <CardContent>
              <TransactionHistory userId="user-2" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
