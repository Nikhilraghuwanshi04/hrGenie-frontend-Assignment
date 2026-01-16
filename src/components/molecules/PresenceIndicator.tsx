'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/redux/hooks';

export const PresenceIndicator = () => {
    const { activeUsers } = useAppSelector((state) => state.document);
    const { user } = useAppSelector((state) => state.auth);

    // Limit displayed users to avoid overcrowding
    const MAX_VISIBLE_USERS = 4;
    const visibleUsers = activeUsers.slice(0, MAX_VISIBLE_USERS);
    const remainingCount = Math.max(0, activeUsers.length - MAX_VISIBLE_USERS);

    return (
        <div className="flex items-center -space-x-2">
            <TooltipProvider>
                {visibleUsers.map((userId) => (
                    <Tooltip key={userId}>
                        <TooltipTrigger asChild>
                            <Avatar className={cn(
                                "h-8 w-8 border-2 border-background ring-2 ring-transparent transition-transform hover:z-10 hover:scale-110",
                                userId === ((user as any)?._id || user?.id) ? "ring-green-500" : "ring-blue-400"
                            )}>
                                {/* Ideally we would fetch user details here. For now, use ID chars */}
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                    {userId.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{userId === ((user as any)?._id || user?.id) ? 'You' : `User ${userId.slice(0, 5)}...`}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>

            {remainingCount > 0 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground hover:bg-muted/80">
                    +{remainingCount}
                </div>
            )}
        </div>
    );
};
