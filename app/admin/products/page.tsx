'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  slug: string;
  is_active: boolean;
  variants?: Array<{
    size: string;
    price: number;
    stock: number;
  }>;
}

export default function ProductsAdmin() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    slug: '',
    is_active: true,
    variants: [
      { size: '250gm', price: '', stock: '' },
      { size: '500gm', price: '', stock: '' },
    ],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty variants
    const validVariants = formData.variants.filter(v => 
      v.size && v.price && v.stock
    ).map(v => ({
      size: v.size,
      price: parseFloat(v.price),
      stock: parseInt(v.stock),
    }));

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      is_active: formData.is_active,
      image_url: imagePreview || (editingProduct?.image_url || ''),
      variants: validVariants,
    };

    try {
      const url = editingProduct
        ? `/api/admin/products?id=${editingProduct.id}`
        : '/api/admin/products';
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert(editingProduct ? 'Product updated!' : 'Product added!');
        setShowForm(false);
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to save product'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Product deleted!');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    
    // Convert variants to form format
    const formVariants = product.variants && product.variants.length > 0
      ? product.variants.map(v => ({
          size: v.size,
          price: v.price.toString(),
          stock: v.stock.toString(),
        }))
      : [
          { size: '250gm', price: '', stock: '' },
          { size: '500gm', price: '', stock: '' },
        ];
    
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      slug: product.slug,
      is_active: product.is_active,
      variants: formVariants,
    });
    setImagePreview(product.image_url);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      slug: '',
      is_active: true,
      variants: [
        { size: '250gm', price: '', stock: '' },
        { size: '500gm', price: '', stock: '' },
      ],
    });
    setImageFile(null);
    setImagePreview('');
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-honey-600 text-white px-6 py-3 rounded-lg hover:bg-honey-700 transition-colors font-semibold"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-honey-500 focus:border-transparent"
                    placeholder="e.g., Wildflower Honey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-honey-500 focus:border-transparent"
                    placeholder="wildflower-honey"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-honey-500 focus:border-transparent"
                  placeholder="Product description..."
                />
              </div>

              {/* Base Price & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-honey-500 focus:border-transparent"
                    placeholder="189"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-honey-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Variants */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Product Variants (Optional)</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        variants: [...formData.variants, { size: '', price: '', stock: '' }],
                      });
                    }}
                    className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                  >
                    + Add Variant
                  </button>
                </div>
                {formData.variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size
                      </label>
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[index].size = e.target.value;
                          setFormData({ ...formData, variants: newVariants });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="250gm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[index].price = e.target.value;
                          setFormData({ ...formData, variants: newVariants });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="189"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].stock = e.target.value;
                            setFormData({ ...formData, variants: newVariants });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="100"
                        />
                      </div>
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newVariants = formData.variants.filter((_, i) => i !== index);
                            setFormData({ ...formData, variants: newVariants });
                          }}
                          className="mt-8 text-red-600 hover:text-red-800"
                          title="Remove variant"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="flex items-start gap-4">
                  {imagePreview && (
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload to /public folder first, then select or paste URL
                    </p>
                    <input
                      type="text"
                      value={imagePreview}
                      onChange={(e) => setImagePreview(e.target.value)}
                      placeholder="/product-image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-honey-600 border-gray-300 rounded focus:ring-honey-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Product is active (visible to customers)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-honey-600 text-white px-6 py-3 rounded-lg hover:bg-honey-700 transition-colors font-semibold"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 bg-gray-100 rounded">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            🍯
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">₹{product.price}</div>
                      {product.variants && product.variants.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {product.variants.map(v => `${v.size}: ₹${v.price}`).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{product.stock}</div>
                      {product.variants && product.variants.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {product.variants.map(v => `${v.size}: ${v.stock}`).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Product Button at Bottom */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-honey-600 text-white px-8 py-4 rounded-lg hover:bg-honey-700 transition-colors font-semibold text-lg shadow-lg"
          >
            + Add New Product
          </button>
        </div>
      </div>
    </div>
  );
}
