import React, { useState, useEffect } from 'react'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const AdminMenu = () => {

  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', price: '', category: 'food', image: '' })
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const res = await fetch('http://localhost:3000/api/menu')
    const data = await res.json()
    setItems(data)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', UPLOAD_PRESET)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data
    })

    const uploaded = await res.json()
    setFormData(prev => ({ ...prev, image: uploaded.secure_url }))
    setUploading(false)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const res = await fetch('http://localhost:3000/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, price: Number(formData.price) })
    })
    const newItem = await res.json()
    setItems([...items, newItem])
    setFormData({ name: '', price: '', category: 'food', image: '' })
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/menu/${id}`, { method: 'DELETE' })
    setItems(items.filter(item => item._id !== id))
  }

  const handleToggle = async (id) => {
    const res = await fetch(`http://localhost:3000/api/menu/${id}/toggle`, { method: 'PATCH' })
    const updated = await res.json()
    setItems(items.map(item => item._id === id ? updated : item))
  }

  return (
    <div className="p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Menu Management</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 text-white placeholder-gray-400 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#d9e8a0]"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm hover:bg-slate-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Item'}
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <div className="bg-slate-900 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Add New Item</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-slate-800 text-white placeholder-gray-400 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d9e8a0]"
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
              className="bg-slate-800 text-white placeholder-gray-400 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d9e8a0]"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="bg-slate-800 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d9e8a0]"
            >
              <option value="food">Food</option>
              <option value="drinks">Drinks</option>
              <option value="snacks">Snacks</option>
            </select>

            {/* Image Upload */}
            <label className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
              uploading
                ? 'border-slate-600 bg-slate-800 cursor-not-allowed'
                : formData.image
                  ? 'border-green-600 bg-slate-800'
                  : 'border-slate-600 bg-slate-800 hover:border-[#d9e8a0]'
            }`}>
              {formData.image && !uploading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-3">
                  <img src={formData.image} alt="preview" className="w-14 h-14 object-cover rounded-xl" />
                  <span className="text-xs text-green-400">✓ Image uploaded</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 py-4">
                  <span className="text-2xl">{uploading ? '⏳' : '📷'}</span>
                  <span className="text-xs text-gray-400">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={uploading}
              className="col-span-2 bg-[#d9e8a0] text-slate-900 font-semibold py-2 rounded-xl hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Item
            </button>
          </form>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-slate-900 rounded-2xl p-5">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-slate-700">
              <th className="text-left pb-3">Item</th>
              <th className="text-left pb-3">Category</th>
              <th className="text-left pb-3">Price</th>
              <th className="text-left pb-3">Status</th>
              <th className="text-left pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-8">
                  {search ? `No items found for "${search}"` : 'No items yet. Add your first menu item.'}
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item._id} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                        : <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-gray-400">N/A</div>
                      }
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-400 capitalize">{item.category}</td>
                  <td className="py-3">₹{item.price}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleToggle(item._id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        item.isAvailable
                          ? 'bg-green-900 text-green-400 hover:bg-green-800'
                          : 'bg-red-900 text-red-400 hover:bg-red-800'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default AdminMenu
