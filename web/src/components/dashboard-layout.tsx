import { useState } from "react"
import { Film } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full bg-muted/40">
                <Sidebar>
                    <SidebarHeader className="border-b px-6 py-3">
                        <div className="flex items-center gap-2">
                            <Film className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">FilmAdmin</span>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        {/* <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive>
                                    <a href="#">
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#">
                                        <Film className="h-4 w-4" />
                                        <span>Films</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#">
                                        <ListFilter className="h-4 w-4" />
                                        <span>Categories</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#">
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu> */}
                    </SidebarContent>

                    <SidebarFooter className="border-t p-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/placeholder.svg" alt="User" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Admin User</span>
                                <span className="text-xs text-muted-foreground">admin@example.com</span>
                            </div>
                        </div>
                    </SidebarFooter>
                </Sidebar>

                <div className="flex-1">
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
