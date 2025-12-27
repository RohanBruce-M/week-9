import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { Trash2, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/lib/api';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  showUser?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, showUser = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0,
        x: 50,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => onDelete(task.id),
      });
    }
  };

  const handleDeleteHover = (isEntering: boolean) => {
    if (deleteButtonRef.current) {
      gsap.to(deleteButtonRef.current, {
        scale: isEntering ? 1.1 : 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div
      ref={cardRef}
      className="group glass-card p-5 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg truncate">
            {task.title}
          </h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
            {showUser && task.userName && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{task.userName}</span>
              </div>
            )}
          </div>
        </div>
        
        <Button
          ref={deleteButtonRef}
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          onMouseEnter={() => handleDeleteHover(true)}
          onMouseLeave={() => handleDeleteHover(false)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
