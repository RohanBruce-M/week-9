import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddTaskFormProps {
  onAddTask: (title: string) => Promise<void>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsLoading(true);
    
    // Bounce animation on button
    if (buttonRef.current) {
      gsap.timeline()
        .to(buttonRef.current, { scale: 0.95, duration: 0.1 })
        .to(buttonRef.current, { scale: 1.05, duration: 0.1 })
        .to(buttonRef.current, { scale: 1, duration: 0.1 });
    }
    
    try {
      await onAddTask(title.trim());
      setTitle('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonHover = (isEntering: boolean) => {
    if (buttonRef.current && !isLoading) {
      gsap.to(buttonRef.current, {
        scale: isEntering ? 1.05 : 1,
        duration: 0.2,
        ease: 'back.out(1.7)',
      });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-12 input-glass text-base"
          disabled={isLoading}
        />
      </div>
      <Button
        ref={buttonRef}
        type="submit"
        disabled={isLoading || !title.trim()}
        onMouseEnter={() => handleButtonHover(true)}
        onMouseLeave={() => handleButtonHover(false)}
        className="h-12 px-6 btn-gradient font-semibold shadow-glow hover:shadow-elevated transition-shadow duration-300"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Plus className="h-5 w-5 mr-2" />
            Add Task
          </>
        )}
      </Button>
    </form>
  );
};

export default AddTaskForm;
