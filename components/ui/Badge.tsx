import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./Button"

const badgeVariants = cva(
    // Layout: Flex, centralizado, font-medium, 6px radius fixo
    "inline-flex items-center justify-center rounded-[6px] px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 gap-1.5 border",
    {
        variants: {
            variant: {
                // Roxo/Azul padrão
                default:
                    "bg-primary/10 text-primary border-primary/25 hover:bg-primary/20",

                // Azul Claro (Novo/Lead inicial)
                secondary:
                    "bg-secondary/50 text-secondary-foreground border-secondary-foreground/20 hover:bg-secondary/60",

                // Vermelho (Perdido)
                destructive:
                    "bg-destructive/10 text-destructive border-destructive/25 hover:bg-destructive/20",

                // Outline neutro
                outline:
                    "text-foreground border-border hover:bg-accent hover:text-accent-foreground",

                // Verde (Ganho)
                success:
                    "bg-success/10 text-success border-success/25 hover:bg-success/20",

                // Amarelo/Laranja (Em Negociação)
                warning:
                    "bg-warning/10 text-warning border-warning/25 hover:bg-warning/20",

                // Azul/Violeta (Info)
                info:
                    "bg-info/10 text-info border-info/25 hover:bg-info/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)


export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
