import { useState } from 'react';
import { X } from 'lucide-react';

const galleryImages = [
  'https://images.pexels.com/photos/265937/pexels-photo-265937.jpeg',
  'https://images.pexels.com/photos/2072454/pexels-photo-2072454.jpeg',
  'https://images.pexels.com/photos/1910236/pexels-photo-1910236.jpeg',
  'https://images.pexels.com/photos/2072160/pexels-photo-2072160.jpeg',
  'https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg',
  'https://images.pexels.com/photos/2072453/pexels-photo-2072453.jpeg',
  'https://images.pexels.com/photos/1238988/pexels-photo-1238988.jpeg',
  'https://images.pexels.com/photos/1910234/pexels-photo-1910234.jpeg',
  'https://images.pexels.com/photos/4207883/pexels-photo-4207883.jpeg',
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
          <p className="text-gray-600">
            Browse through our collection and see our happy customers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </div>
          ))}
        </div>

        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <img
              src={galleryImages[selectedImage]}
              alt={`Gallery ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedImage ? 'bg-white w-8' : 'bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
