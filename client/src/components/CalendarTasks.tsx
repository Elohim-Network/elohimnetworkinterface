
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Clock, CalendarIcon, Plus, X, Check, Calendar as CalendarIcon2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  relatedTo?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string[];
}

type TaskFormValues = {
  taskTitle: string;
  taskDescription: string;
  taskPriority: 'low' | 'medium' | 'high';
  taskRelatedTo: string;
  taskTime: string;
};

type EventFormValues = {
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  eventStartTime: string;
  eventEndTime: string;
  eventParticipants: string;
};

const CalendarTasks: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [activeView, setActiveView] = useState<'calendar' | 'tasks'>('tasks');
  const [taskFilter, setTaskFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TaskFormValues & EventFormValues>({
    defaultValues: {
      taskTitle: "",
      taskDescription: "",
      taskPriority: "medium" as const,
      taskRelatedTo: "",
      taskTime: "",
      eventTitle: "",
      eventDescription: "",
      eventLocation: "",
      eventStartTime: "",
      eventEndTime: "",
      eventParticipants: ""
    }
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem('elohim-tasks');
    const savedEvents = localStorage.getItem('elohim-events');
    
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error('Error parsing tasks:', error);
      }
    }
    
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        if (Array.isArray(parsedEvents)) {
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error('Error parsing events:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('elohim-tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('elohim-events', JSON.stringify(events));
  }, [events]);
  
  const handleAddTask = (data: TaskFormValues) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: data.taskTitle,
      description: data.taskDescription,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: data.taskTime,
      priority: data.taskPriority,
      completed: false,
      relatedTo: data.taskRelatedTo || undefined
    };
    
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
    reset({
      taskTitle: "",
      taskDescription: "",
      taskPriority: "medium",
      taskRelatedTo: "",
      taskTime: ""
    });
    toast.success('Task added successfully');
  };
  
  const handleAddEvent = (data: EventFormValues) => {
    const newEvent: Event = {
      id: `event_${Date.now()}`,
      title: data.eventTitle,
      description: data.eventDescription,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: data.eventStartTime,
      endTime: data.eventEndTime,
      location: data.eventLocation,
      participants: data.eventParticipants.split(',').map(p => p.trim()).filter(Boolean)
    };
    
    setEvents([...events, newEvent]);
    setShowAddEvent(false);
    reset({
      eventTitle: "",
      eventDescription: "",
      eventLocation: "",
      eventStartTime: "",
      eventEndTime: "",
      eventParticipants: ""
    });
    toast.success('Event added successfully');
  };
  
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
  };
  
  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully');
  };

  const filteredTasks = tasks.filter(task => {
    const isMatchingDate = task.date === format(selectedDate, 'yyyy-MM-dd');
    
    if (taskFilter === 'all') return isMatchingDate;
    if (taskFilter === 'completed') return isMatchingDate && task.completed;
    if (taskFilter === 'pending') return isMatchingDate && !task.completed;
    return false;
  });
  
  const getEventsForSelectedDate = () => {
    return events.filter(event => event.date === format(selectedDate, 'yyyy-MM-dd'));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Calendar</h2>
              <p className="text-muted-foreground text-sm">
                {format(selectedDate, 'MMMM yyyy')}
              </p>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
              
              <div className="flex space-x-2 mt-4">
                <Button onClick={() => setShowAddTask(true)} variant="outline" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
                <Button onClick={() => setShowAddEvent(true)} variant="outline" className="flex-1">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Selected: {format(selectedDate, 'EEEE, MMMM do, yyyy')}</p>
                <p className="text-sm">
                  {filteredTasks.length} tasks, {getEventsForSelectedDate().length} events
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'calendar' | 'tasks')}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="calendar">Events</TabsTrigger>
              </TabsList>
              
              {activeView === 'tasks' && (
                <Select 
                  value={taskFilter}
                  onValueChange={(value) => setTaskFilter(value as 'all' | 'completed' | 'pending')}
                >
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Filter tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="pending">Pending Tasks</SelectItem>
                    <SelectItem value="completed">Completed Tasks</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <TabsContent value="tasks" className="mt-0">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">
                    Tasks for {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                </CardHeader>
                <CardContent>
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No tasks for this day. Add a new task to get started.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
                        <div 
                          key={task.id} 
                          className={`flex items-start gap-3 p-3 rounded-lg border ${task.completed ? 'bg-muted/50' : 'bg-background'}`}
                        >
                          <Checkbox 
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                              </h4>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 rounded-full"
                                onClick={() => deleteTask(task.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className={`text-sm ${task.completed ? 'text-muted-foreground line-through' : ''}`}>
                              {task.description}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                </span>
                                {task.time && (
                                  <span className="text-xs text-muted-foreground flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {task.time}
                                  </span>
                                )}
                              </div>
                              {task.relatedTo && (
                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                  {task.relatedTo}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">
                    Events for {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                </CardHeader>
                <CardContent>
                  {getEventsForSelectedDate().length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No events scheduled for this day. Add a new event to get started.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getEventsForSelectedDate().map((event) => (
                        <div key={event.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.title}</h4>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-full"
                              onClick={() => deleteEvent(event.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm">{event.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="bg-muted text-xs px-2 py-0.5 rounded-full flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.startTime} - {event.endTime}
                            </div>
                            {event.location && (
                              <div className="bg-muted text-xs px-2 py-0.5 rounded-full">
                                {event.location}
                              </div>
                            )}
                          </div>
                          {event.participants.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">Participants:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.participants.map((person, idx) => (
                                  <span key={idx} className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                                    {person}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Add New Task</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowAddTask(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSubmit(handleAddTask)} className="p-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="taskTitle" className="text-sm font-medium">
                  Task Title
                </label>
                <Input 
                  id="taskTitle"
                  {...register("taskTitle", { required: "Task title is required" })}
                  placeholder="Enter task title"
                />
                {errors.taskTitle && (
                  <p className="text-red-500 text-xs mt-1">{errors.taskTitle.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="taskDescription" className="text-sm font-medium">
                  Description
                </label>
                <Textarea 
                  id="taskDescription"
                  {...register("taskDescription")}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="taskPriority" className="text-sm font-medium">
                    Priority
                  </label>
                  <Select 
                    onValueChange={(value: 'low' | 'medium' | 'high') => {
                      setValue('taskPriority', value);
                    }}
                    defaultValue="medium"
                  >
                    <SelectTrigger id="taskPriority">
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
                  <label htmlFor="taskTime" className="text-sm font-medium">
                    Time (Optional)
                  </label>
                  <Input 
                    id="taskTime"
                    type="time"
                    {...register("taskTime")}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="taskRelatedTo" className="text-sm font-medium">
                  Related To (Optional)
                </label>
                <Input 
                  id="taskRelatedTo"
                  {...register("taskRelatedTo")}
                  placeholder="Project, client, or category"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Add New Event</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowAddEvent(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSubmit(handleAddEvent)} className="p-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="eventTitle" className="text-sm font-medium">
                  Event Title
                </label>
                <Input 
                  id="eventTitle"
                  {...register("eventTitle", { required: "Event title is required" })}
                  placeholder="Enter event title"
                />
                {errors.eventTitle && (
                  <p className="text-red-500 text-xs mt-1">{errors.eventTitle.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="eventDescription" className="text-sm font-medium">
                  Description
                </label>
                <Textarea 
                  id="eventDescription"
                  {...register("eventDescription")}
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="eventStartTime" className="text-sm font-medium">
                    Start Time
                  </label>
                  <Input 
                    id="eventStartTime"
                    type="time"
                    {...register("eventStartTime", { required: "Start time is required" })}
                  />
                  {errors.eventStartTime && (
                    <p className="text-red-500 text-xs mt-1">{errors.eventStartTime.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="eventEndTime" className="text-sm font-medium">
                    End Time
                  </label>
                  <Input 
                    id="eventEndTime"
                    type="time"
                    {...register("eventEndTime", { required: "End time is required" })}
                  />
                  {errors.eventEndTime && (
                    <p className="text-red-500 text-xs mt-1">{errors.eventEndTime.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="eventLocation" className="text-sm font-medium">
                  Location
                </label>
                <Input 
                  id="eventLocation"
                  {...register("eventLocation")}
                  placeholder="Meeting room, address, or virtual link"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="eventParticipants" className="text-sm font-medium">
                  Participants (comma separated)
                </label>
                <Input 
                  id="eventParticipants"
                  {...register("eventParticipants")}
                  placeholder="John Doe, Jane Smith"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddEvent(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" />
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
