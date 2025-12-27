import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ClipboardList, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import AddTaskForm from '@/components/AddTaskForm';
import { useAuth } from '@/contexts/AuthContext';
import { tasksApi, Task } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const welcomeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(welcomeRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
      .fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && taskListRef.current) {
      const cards = taskListRef.current.querySelectorAll('.task-card-wrapper');
      gsap.fromTo(cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [tasks.length]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tasksApi.getAll();
      setTasks(response.data);
    } catch (err: any) {
      setError('Failed to load tasks. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please check your connection.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (title: string) => {
    try {
      const response = await tasksApi.create(title);
      setTasks(prev => [response.data, ...prev]);
      
      toast({
        title: 'Task created',
        description: 'Your new task has been added successfully.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await tasksApi.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      
      toast({
        title: 'Task deleted',
        description: 'The task has been removed.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div ref={welcomeRef} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {isAdmin 
              ? 'You have access to all tasks across the platform.'
              : 'Here are your tasks for today. Stay productive!'
            }
          </p>
        </div>

        {/* Add Task Form */}
        <div ref={contentRef} className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Create New Task</h2>
          <AddTaskForm onAddTask={handleAddTask} />
        </div>

        {/* Task List */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              {isAdmin ? 'All Tasks' : 'Your Tasks'}
            </h2>
            <span className="text-sm text-muted-foreground px-3 py-1 bg-secondary/50 rounded-full">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-10 w-10 text-destructive mb-4" />
              <p className="text-foreground font-medium mb-2">Something went wrong</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-2">No tasks yet</p>
              <p className="text-muted-foreground text-sm">Create your first task above to get started!</p>
            </div>
          ) : (
            <div ref={taskListRef} className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="task-card-wrapper">
                  <TaskCard
                    task={task}
                    onDelete={handleDeleteTask}
                    showUser={isAdmin}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
