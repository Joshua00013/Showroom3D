import AdminSidebar from '@/components/AdminSidebar'
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="flex h-14 shrink-0 items-center border-b px-4">
          <SidebarTrigger />
        </header>

        <div className="w-full min-w-0 p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}