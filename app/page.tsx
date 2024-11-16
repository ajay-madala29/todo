import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { TaskForm } from '@/components/tasks/task-form'
import { TaskList } from '@/components/tasks/task-list'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const supabase = createSupabaseServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-[350px_1fr]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Add New Task</h2>
            <TaskForm onSuccess={() => {}} />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your Tasks</h2>
            <TaskList onUpdate={() => {}} />
          </div>
        </div>
      </main>
    </div>
  )
}