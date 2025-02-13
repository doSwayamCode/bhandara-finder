import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, MapPin, Clock, Image, X, Github } from 'lucide-react';

interface Bhandara {
  id: string;
  title: string;
  description: string;
  location: string;
  image_url: string;
  date_time: string;
  owner_id: string;
}

function App() {
  const [bhandaras, setBhandaras] = useState<Bhandara[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [ownerId] = useState(() => {
    const stored = localStorage.getItem('ownerId');
    if (stored) return stored;
    const newId = uuidv4();
    localStorage.setItem('ownerId', newId);
    return newId;
  });

  useEffect(() => {
    const loadBhandaras = () => {
      const stored = localStorage.getItem('bhandaras');
      if (stored) {
        const data = JSON.parse(stored);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const validBhandaras = data.filter((b: Bhandara) => 
          new Date(b.date_time) >= today
        );
        setBhandaras(validBhandaras);
        if (validBhandaras.length !== data.length) {
          localStorage.setItem('bhandaras', JSON.stringify(validBhandaras));
        }
      }
    };

    loadBhandaras();
    const interval = setInterval(loadBhandaras, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!previewImage) {
      alert('Please add an image');
      return;
    }

    const newBhandara = {
      id: uuidv4(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      image_url: previewImage,
      date_time: new Date(formData.get('date_time') as string).toISOString(),
      owner_id: ownerId,
    };

    const updatedBhandaras = [...bhandaras, newBhandara];
    localStorage.setItem('bhandaras', JSON.stringify(updatedBhandaras));
    setBhandaras(updatedBhandaras);

    form.reset();
    setPreviewImage(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    const updatedBhandaras = bhandaras.filter(b => b.id !== id);
    localStorage.setItem('bhandaras', JSON.stringify(updatedBhandaras));
    setBhandaras(updatedBhandaras);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <div className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Bhandara Finder</h1>
            <p className="text-gray-600">Bhandare ki jaankari</p>
          </div>
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Add New Bhandara!
          </button>
        </div>

        {isAddingNew && (
          <div className="mb-12 bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">bhook lagi hai</h2>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setPreviewImage(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter bhandara name"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location batao
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="kya kya hai khaane me?"
                />
              </div>

              <div>
                <label htmlFor="date_time" className="block text-sm font-medium text-gray-700 mb-1">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  name="date_time"
                  id="date_time"
                  required
                  className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                  <div className="space-y-1 text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mx-auto h-64 w-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewImage(null)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            <span>Upload an image of bhandara</span>
                            <input
                              id="image-upload"
                              name="image"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">upto 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setPreviewImage(null);
                  }}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-full hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                >
                  Jaldi aao
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bhandaras.map((bhandara) => (
            <div
              key={bhandara.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={bhandara.image_url}
                  alt={bhandara.title}
                  className="w-full h-full object-cover"
                />
                {bhandara.owner_id === ownerId && (
                  <button
                    onClick={() => handleDelete(bhandara.id)}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{bhandara.title}</h2>
                <p className="text-gray-600 mb-4">{bhandara.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin size={16} className="text-indigo-500" />
                    <span>{bhandara.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={16} className="text-indigo-500" />
                    <span>{format(new Date(bhandara.date_time), 'PPp')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="w-full bg-white shadow-lg mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <span>Built with love
               by Swayam :)</span>
            <a
              href="https://github.com/doSwayamCode/bhandara-finder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;