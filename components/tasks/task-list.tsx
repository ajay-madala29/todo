'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { format, isPast, isToday } from 'date-fns'
import {
  Calendar,
  Clock,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Circle,
} from 'lucide-react'

type Task = Database['public']['Tables']['tasks']['Row']

export function TaskList({ onUpdate }: { onUpdate: () => void }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTasks(data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [onUpdate])

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ))
      
      toast.success('Task status updated')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      setTasks(tasks.filter(task => task.id !== taskId))
      toast.success('Task deleted')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case 'medium':
        return <Circle className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No tasks yet. Add your first task above!
        </div>
      ) : (
        tasks.map((task) => {
          const dueDate = task.due_date ? new Date(task.due_date) : null
          const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed'

          return (
            <div
              key={task.id}
              className={cn(
                'flex items-start gap-4 p-4 rounded-lg border bg-card transition-colors',
                task.status === 'completed' && 'bg-muted/50',
                isOverdue && 'border-destructive'
              )}
            >
              <Checkbox
                checked={task.status === 'completed'}
                onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'font-medium',
                    task.status === 'completed' && 'line-through text-muted-foreground'
                  )}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-1">
                    {getPriorityIcon(task.priority)}
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>
                </div>
                {task.description && (
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}
                {dueDate && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(dueDate, 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{format(dueDate, 'p')}</span>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete task</span>
              </Button>
            </div>
          )
        })
      )}
    </div>
  )
}