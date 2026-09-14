import { useState } from 'react';
import { Plus, Trash2, Tags } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import { adminInput, adminPanel } from '../components/adminUi';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<string[]>(() =>
    adminStore.getCategories(),
  );

  const [newCategory, setNewCategory] = useState('');

  const handleAdd = () => {
    try {
      const next = adminStore.addCategory(newCategory);

      setCategories(next);
      setNewCategory('');
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Unable to add category.',
      );
    }
  };

  const handleDelete = (category: string) => {
    if (
      !window.confirm(
        `Remove "${category}" from vehicle categories?`,
      )
    ) {
      return;
    }

    try {
      const next = adminStore.deleteCategory(category);
      setCategories(next);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Unable to remove category.',
      );
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Fleet Settings"
        title="Vehicle Categories"
        description="Add or remove the categories available when creating vehicles."
      />

      <div className={`${adminPanel} p-6`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleAdd();
              }
            }}
            placeholder="e.g. Sedan"
            className={`${adminInput} flex-1`}
          />

          <button
            type="button"
            onClick={handleAdd}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      <div className={`${adminPanel} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Tags className="w-4 h-4 text-brand-red" />
            <h2 className="text-gray-900 font-semibold">
              Available Categories
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {categories.map(category => (
            <div
              key={category}
              className="px-6 py-4 flex items-center justify-between gap-4"
            >
              <span className="text-gray-900">{category}</span>

              <button
                type="button"
                onClick={() => handleDelete(category)}
                className="inline-flex items-center gap-2 text-sm text-brand-gray hover:text-brand-red transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}