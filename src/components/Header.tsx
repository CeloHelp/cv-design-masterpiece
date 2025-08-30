
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, FileText, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onShowProfile?: () => void;
}

const Header = ({ onShowProfile }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'Usuário';
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50 shadow-premium">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-lg shadow-md">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Gerador de CV
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 hover:bg-accent/50">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getInitials(getUserDisplayName())}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground hidden sm:block">
                    {getUserDisplayName()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 shadow-premium">
                <DropdownMenuItem 
                  onClick={onShowProfile}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  Editar Perfil
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={signOut}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
