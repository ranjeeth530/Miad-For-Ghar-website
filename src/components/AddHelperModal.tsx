import React, { useState } from 'react';
import { X, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { DomesticHelper, ServiceCategory, ShiftType } from '../types';
import { CITIES_LIST, SERVICE_CATEGORIES } from '../constants/appData';
import { TwoColumnCityDropdown } from './TwoColumnCityDropdown';

interface AddHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHelper: (helper: Omit<DomesticHelper, 'id' | 'rating' | 'reviewsCount' | 'completedJobs' | 'verifiedAt'>) => Promise<any>;
}

export const AddHelperModal: React.FC<AddHelperModalProps> = ({ isOpen, onClose, onAddHelper }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('house_cleaning');
  const [experienceYears, setExperienceYears] = useState(5);
  const [city, setCity] = useState('Mumbai');
  const [localitiesStr, setLocalitiesStr] = useState('Bandra, Andheri, Juhu');
  const [languagesStr, setLanguagesStr] = useState('Hindi, Marathi, English');
  const [specialtiesStr, setSpecialtiesStr] = useState('Utensil Cleaning, Deep Dusting, Ironing');
  const [availability, setAvailability] = useState<'Immediate' | 'Within 2 Days' | 'Next Week'>('Immediate');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bio.trim()) return;

    setLoading(true);
    setFormError(null);
    try {
      const catObj = SERVICE_CATEGORIES.find(s => s.id === category);
      await onAddHelper({
        name,
        photoUrl,
        category,
        categoryTitle: catObj ? catObj.title : 'Domestic Helper',
        experienceYears: Number(experienceYears),
        city,
        localities: localitiesStr.split(',').map(s => s.trim()).filter(Boolean),
        languages: languagesStr.split(',').map(s => s.trim()).filter(Boolean),
        shiftTypes: ['part_time', 'full_time_8h', 'live_in_24h'],
        badges: ['police_verified', 'id_verified', 'health_certified', 'covid_vaccinated'],
        specialties: specialtiesStr.split(',').map(s => s.trim()).filter(Boolean),
        availability,
        bio,
        age: Number(age),
        gender
      });

      onClose();
    } catch (err) {
      console.error(err);
      setFormError('Failed to add helper profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-2 sm:p-4 pb-24 sm:pb-6 flex justify-center items-start sm:items-center text-left">
      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#2A5A43]/15 my-auto max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="bg-[#2A5A43] text-white p-5 sm:p-6 relative shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-serif text-xl sm:text-2xl font-bold">Add Verified Helper Profile</h3>
          <p className="text-emerald-100 text-xs mt-1">Register a candidate after 100% verified screening.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#4A5A53] uppercase">Full Name:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4A5A53] uppercase">Service Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                {SERVICE_CATEGORIES.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#4A5A53] uppercase">Exp (Years):</label>
              <input
                type="number"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4A5A53] uppercase">Age:</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4A5A53] uppercase">Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#4A5A53] uppercase">City:</label>
              <TwoColumnCityDropdown
                id="add-helper-city"
                value={city}
                onChange={(c) => setCity(c)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4A5A53] uppercase">Availability:</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="Immediate">Immediate</option>
                <option value="Within 2 Days">Within 2 Days</option>
                <option value="Next Week">Next Week</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A5A53] uppercase">Localities Covered (Comma Separated):</label>
            <input
              type="text"
              value={localitiesStr}
              onChange={(e) => setLocalitiesStr(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A5A53] uppercase">Languages Spoken:</label>
            <input
              type="text"
              value={languagesStr}
              onChange={(e) => setLanguagesStr(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A5A53] uppercase">Specialties:</label>
            <input
              type="text"
              value={specialtiesStr}
              onChange={(e) => setSpecialtiesStr(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A5A53] uppercase">Bio & Background Notes:</label>
            <textarea
              rows={2}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl p-3 text-xs"
            />
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {formError}
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl bg-[#2A5A43] text-white text-xs font-semibold">
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
