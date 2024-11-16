'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { createSupabaseClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type TaskFormData = {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
}

export function TaskForm({ onSuccess }: { onSuccess: () => void }) {
  const [date, setDate] = useState<Date>()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>()
  const supabase = createSupabaseClient()

  const onSubmit = async (data: TaskFormData) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('User not found')

      const { error } = await supabase.from('tasks').insert({
        title: data.title,
        description: data.description,
        priority: data.priority,
        due_date: date?.toISOString(),
        user_id: user.id,
      })

      if (error) throw error

      toast.success('Task created successfully')
      reset()
      setDate(undefined)
      onSuccess()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-card rounded-lg border shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          {...register('description')}
          placeholder="Enter task description"
        />
      </div>

      <div className="space-y-2">
        <Label>Priority</Label>
        <Select defaultValue="medium" {...register('priority')}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Due Date (optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full">
        Add Task
      </Button>
    </form>
  )
}