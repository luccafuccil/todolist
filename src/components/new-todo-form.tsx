import React, { useState, useEffect } from "react";

interface NewTodoFormProps {
  onSubmit: (data: { name: string; description: string }) => void;
  initialData?: { name: string; description: string };
  submitText?: string;
}

const NewTodoForm: React.FC<NewTodoFormProps> = ({
  onSubmit,
  initialData,
  submitText,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });

    if (!initialData) {
      setName("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-2 text-lg font-medium text-black">
          Task name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={50}
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-lg font-medium text-black">
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" className="main-btn" disabled={isSubmitting}>
        {submitText || "Add Task"}
      </button>
    </form>
  );
};

export default NewTodoForm;
