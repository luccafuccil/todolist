import React, { useState, useEffect } from "react";

interface NewTodoFormProps {
  onSubmit: (data: { name: string; description: string }) => void;
  initialData?: { name: string; description: string };
}

const NewTodoForm: React.FC<NewTodoFormProps> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

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
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" className="main-btn">
        Add To-do
      </button>
    </form>
  );
};

export default NewTodoForm;
