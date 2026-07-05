import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import { adminCard } from '../components/adminUi';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState(() => adminStore.getVehicles());

  const refresh = () => setVehicles(adminStore.getVehicles());

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Remove ${name} from the fleet?`)) return;
    adminStore.deleteVehicle(id);
    refresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <DashboardHeader
          eyebrow="Fleet"
          title="Vehicles"
          description="Fleet inventory with Accra fixed pricing and optional regional rates."
        />
        <Link to="/admin/vehicles/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add vehicle
        </Link>
      </div>

      <div className={`${adminCard} overflow-hidden`}>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-brand-gray text-left">
            <tr>
              <th className="px-4 py-3 font-medium uppercase tracking-wider text-[10px]">Vehicle</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell uppercase tracking-wider text-[10px]">Category</th>
              <th className="px-4 py-3 font-medium uppercase tracking-wider text-[10px]">Accra/day</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell uppercase tracking-wider text-[10px]">Regions</th>
              <th className="px-4 py-3 font-medium text-right uppercase tracking-wider text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, i) => {
              const regions = Object.keys(vehicle.pricePerDay).filter(k => k !== 'accra').length;
              return (
                <motion.tr
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src={vehicle.image} alt={vehicle.name} className="w-16 h-12 object-cover" />
                      <div>
                        <p className="text-white font-heading font-semibold">{vehicle.name}</p>
                        <p className="text-brand-gray text-xs">{vehicle.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-brand-gray hidden md:table-cell">{vehicle.category}</td>
                  <td className="px-4 py-4 text-brand-red font-bold font-heading">GHS {vehicle.pricePerDay.accra}</td>
                  <td className="px-4 py-4 text-brand-gray hidden lg:table-cell">
                    {regions > 0 ? `${regions} regional` : 'Accra only'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/vehicles/${vehicle.id}/edit`}
                        className="p-2 text-brand-gray hover:text-white hover:bg-brand-red/10 transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(vehicle.id, vehicle.name)}
                        className="p-2 text-brand-gray hover:text-brand-red hover:bg-brand-red/10 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
