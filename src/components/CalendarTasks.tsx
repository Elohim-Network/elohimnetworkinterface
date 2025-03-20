
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Circle, Trash2, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  relatedTo?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
}

const CalendarTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<'calendar' | 'tasks'>('calendar');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const form = useForm({
    defaultValues: {
      taskTitle: "",
      taskDescription: "",
      taskPriority: "medium" as const,
      taskRelatedTo: "",
      eventTitle: "",
      eventDescription: "",
      eventLocation: "",
      eventStartTime: "",
      eventEndTime: "",
      eventAttendees: ""
    }
  });

  useEffect(() => {
    // Load tasks and events from localStorage
    const savedTasks = localStorage.getItem('elohim-tasks');
    const savedEvents = localStorage.getItem('elohim-events');
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Error loading tasks:', e);
      }
    }
    
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error('Error loading events:', e);
      }
    }
  }, []);

  // Save to localStorage whenever tasks or events change
  useEffect(() => {
    localStorage.setItem('elohim-tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('elohim-events', JSON.stringify(events));
  }, [events]);

  const addTask = (data: any) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.taskTitle,
      description: data.taskDescription,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: data.taskTime || '09:00',
      completed: false,
      priority: data.taskPriority,
      relatedTo: data.taskRelatedTo || undefined
    };
    
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
    form.reset({
      taskTitle: "",
      taskDescription: "",
      taskPriority: "medium",
      taskRelatedTo: ""
    });
    toast.success('Task added successfully');
  };

  const addEvent = (data: any) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: data.eventTitle,
      description: data.eventDescription,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: data.eventStartTime || '09:00',
      endTime: data.eventEndTime || '10:00',
      location: data.eventLocation || undefined,
      attendees: data.eventAttendees ? data.eventAttendees.split(',').map((a: string) => a.trim()) : undefined
    };
    
    setEvents([...events, newEvent]);
    setShowAddEvent(false);
    form.reset({
      eventTitle: "",
      eventDescription: "",
      eventLocation: "",
      eventStartTime: "",
      eventEndTime: "",
      eventAttendees: ""
    });
    toast.success('Event added successfully');
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    toast.success('Task deleted');
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    toast.success('Event deleted');
  };

  const filteredTasks = tasks.filter(task => {
    // Filter by selected date
    const isMatchingDate = task.date === format(selectedDate, 'yyyy-MM-dd');
    
    // Apply status filter if needed
    if (taskFilter === 'all') return isMatchingDate;
    if (taskFilter === 'completed') return isMatchingDate && task.completed;
    if (taskFilter === 'pending') return isMatchingDate && !task.completed;
    
    return isMatchingDate;
  });

  const getEventsForSelectedDate = () => {
    return events.filter(event => event.date === format(selectedDate, 'yyyy-MM-dd'));
  };

  // Priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar Column */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>
                {format(selectedDate, 'MMMM yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border pointer-events-auto"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setShowAddEvent(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Event
                </Button>
                <Button onClick={() => setShowAddTask(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Task
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Tasks & Events Column */}
        <div className="md:w-2/3">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'calendar' | 'tasks')}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="calendar">Events</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>
              
              {activeView === 'tasks' && (
                <Select value={taskFilter} onValueChange={(value) => setTaskFilter(value as 'all' | 'completed' | 'pending')}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <TabsContent value="calendar">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Events for {format(selectedDate, 'PP')}
                </h3>
                
                {getEventsForSelectedDate().length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No events scheduled for this day.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getEventsForSelectedDate().sort((a, b) => a.startTime.localeCompare(b.startTime)).map((event) => (
                      <Card key={event.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{event.title}</CardTitle>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-muted-foreground" 
                              onClick={() => deleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardDescription className="text-xs flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.startTime} - {event.endTime}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm py-2">
                          <p className="mb-1">{event.description}</p>
                          {event.location && (
                            <p className="text-xs text-muted-foreground">Location: {event.location}</p>
                          )}
                          {event.attendees && event.attendees.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Attendees: {event.attendees.join(', ')}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tasks">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Tasks for {format(selectedDate, 'PP')}
                </h3>
                
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No tasks for this day.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "flex items-start p-3 border rounded-lg hover:bg-muted/50 transition-colors",
                          task.completed ? "bg-muted/20" : ""
                        )}
                      >
                        <button 
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="mt-0.5 mr-3 flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className={cn(
                              "text-base font-medium",
                              task.completed ? "line-through text-muted-foreground" : ""
                            )}>
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className={cn("text-xs font-medium", getPriorityColor(task.priority))}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-muted-foreground" 
                                onClick={() => deleteTask(task.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className={cn(
                            "text-sm",
                            task.completed ? "text-muted-foreground" : ""
                          )}>
                            {task.description}
                          </p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{task.time}</span>
                          </div>
                          {task.relatedTo && (
                            <span className="mt-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full inline-block">
                              Related to: {task.relatedTo}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Task Form Dialog */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Add New Task</h3>
              <p className="text-sm text-muted-foreground">
                Create a task for {format(selectedDate, 'PP')}
              </p>
            </div>
            
            <form onSubmit={form.handleSubmit(addTask)} className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input 
                  id="taskTitle"
                  {...form.register("taskTitle", { required: true })}
                  placeholder="Enter task title"
                  className="w-full"
                />
                {form.formState.errors.taskTitle && (
                  <p className="text-sm text-destructive">Title is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskDescription">Description</Label>
                <Input 
                  id="taskDescription"
                  {...form.register("taskDescription")}
                  placeholder="Enter details"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taskTime">Time</Label>
                  <Input 
                    id="taskTime"
                    type="time" 
                    {...form.register("taskTime")}
                    defaultValue="09:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskPriority">Priority</Label>
                  <Select 
                    defaultValue="medium"
                    onValueChange={(value) => form.setValue("taskPriority", value as "low" | "medium" | "high")}
                  >
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskRelatedTo">Related To</Label>
                <Input 
                  id="taskRelatedTo"
                  {...form.register("taskRelatedTo")}
                  placeholder="Client, project or lead name (optional)"
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Form Dialog */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Add New Event</h3>
              <p className="text-sm text-muted-foreground">
                Create an event for {format(selectedDate, 'PP')}
              </p>
            </div>
            
            <form onSubmit={form.handleSubmit(addEvent)} className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventTitle">Event Title</Label>
                <Input 
                  id="eventTitle"
                  {...form.register("eventTitle", { required: true })}
                  placeholder="Enter event title"
                  className="w-full"
                />
                {form.formState.errors.eventTitle && (
                  <p className="text-sm text-destructive">Title is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDescription">Description</Label>
                <Input 
                  id="eventDescription"
                  {...form.register("eventDescription")}
                  placeholder="Enter details"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventStartTime">Start Time</Label>
                  <Input 
                    id="eventStartTime"
                    type="time" 
                    {...form.register("eventStartTime")}
                    defaultValue="09:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventEndTime">End Time</Label>
                  <Input 
                    id="eventEndTime"
                    type="time" 
                    {...form.register("eventEndTime")}
                    defaultValue="10:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventLocation">Location (optional)</Label>
                <Input 
                  id="eventLocation"
                  {...form.register("eventLocation")}
                  placeholder="Enter location"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventAttendees">Attendees (optional)</Label>
                <Input 
                  id="eventAttendees"
                  {...form.register("eventAttendees")}
                  placeholder="Enter email addresses separated by commas"
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddEvent(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarTasks;
