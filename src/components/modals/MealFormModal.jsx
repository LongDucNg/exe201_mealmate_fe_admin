import { useState, useEffect } from 'react' // Hook quản lý form

const defaultMeal = {
  name: '',
  description: '',
  dietType: '',
  totalKcal: '',
  mealTime: [],
  image: '',
  category: '',
  subCategory: '',
  ingredients: [''],
  instructions: [''],
  tag: [''],
}

const dietTypes = ['Giảm cân', 'Eat clean', 'Tăng cơ', 'Dinh dưỡng'] // Tuỳ chọn mẫu
const mealTimeOptions = ['breakfast', 'lunch', 'dinner', 'dessert'] // Tuỳ chọn bữa

const MealFormModal = ({ open, onClose, initialData, onSubmit, loading }) => {
  const [form, setForm] = useState(defaultMeal)

  useEffect(() => {
    if (initialData) {
      // Extract category name from object
      const categoryName =
        typeof initialData.category === 'string'
          ? initialData.category
          : initialData.category?.name ?? ''
      // Extract subCategory name from object
      const subCategoryName =
        typeof initialData.subCategory === 'string'
          ? initialData.subCategory
          : initialData.subCategory?.name ?? ''
      // Extract ingredients names from objects
      const ingredientsList = Array.isArray(initialData.ingredients)
        ? initialData.ingredients.length > 0
          ? initialData.ingredients.map((item) =>
              typeof item === 'string' ? item : item?.name ?? '',
            )
          : ['']
        : ['']
      setForm({
        name: initialData.name ?? '',
        description: initialData.description ?? '',
        dietType: initialData.dietType ?? '',
        totalKcal: initialData.totalKcal ?? '',
        mealTime: initialData.mealTime ?? [],
        image: initialData.image ?? '',
        category: categoryName,
        subCategory: subCategoryName,
        ingredients: ingredientsList,
        instructions:
          Array.isArray(initialData.instructions) && initialData.instructions.length > 0 ? initialData.instructions : [''],
        tag: Array.isArray(initialData.tag) && initialData.tag.length > 0 ? initialData.tag : [''],
      })
    } else {
      setForm(defaultMeal)
    }
  }, [initialData, open])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const toggleMealTime = (value) => {
    setForm((prev) => {
      const exists = prev.mealTime.includes(value)
      return {
        ...prev,
        mealTime: exists ? prev.mealTime.filter((item) => item !== value) : [...prev.mealTime, value],
      }
    })
  }

  const handleArrayChange = (field, index, value) => {
    setForm((prev) => {
      const list = [...prev[field]]
      list[index] = value
      return { ...prev, [field]: list }
    })
  }

  const handleAddItem = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const handleRemoveItem = (field, index) => {
    setForm((prev) => {
      const list = prev[field].length > 1 ? prev[field].filter((_, idx) => idx !== index) : prev[field]
      return { ...prev, [field]: list }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Đảm bảo category và subCategory là string (name)
    const categoryValue =
      typeof form.category === 'string'
        ? form.category
        : form.category?.name ?? ''
    const subCategoryValue =
      typeof form.subCategory === 'string'
        ? form.subCategory
        : form.subCategory?.name ?? ''
    onSubmit({
      ...form,
      category: categoryValue,
      subCategory: subCategoryValue,
      totalKcal: Number(form.totalKcal) || 0,
      ingredients: form.ingredients.map((item) => {
        // Nếu item là object, lấy name; nếu là string, giữ nguyên
        const itemValue = typeof item === 'string' ? item : item?.name ?? ''
        return itemValue.trim()
      }).filter(Boolean),
      instructions: form.instructions.map((item) => item.trim()).filter(Boolean),
      tag: form.tag.map((item) => item.trim()).filter(Boolean),
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[32px] p-8 w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-charcoal">
            {initialData ? 'Chỉnh sửa món ăn' : 'Thêm món ăn'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-charcoal">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-2 mt-6 custom-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-600">Tên món</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-brand/60 outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-600">Loại chế độ</span>
              <select
                name="dietType"
                value={form.dietType}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-brand/60 outline-none"
              >
                <option value="">Chọn...</option>
                {dietTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-600">Danh mục</span>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-brand/60 outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-600">Danh mục con</span>
              <input
                name="subCategory"
                value={form.subCategory}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-brand/60 outline-none"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-600">Tổng kcal</span>
              <input
                type="number"
                name="totalKcal"
                value={form.totalKcal}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-brand/60 outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-600">Ảnh (URL)</span>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-brand/60 outline-none"
              />
            </label>
          </div>
          <label className="space-y-2 block">
            <span className="text-sm font-semibold text-gray-600">Mô tả</span>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-brand/60 outline-none"
            />
          </label>
          <div className="space-y-2">
            <span className="text-sm font-semibold text-gray-600">Thời điểm ăn</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mealTimeOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border cursor-pointer ${
                      form.mealTime.includes(option)
                        ? 'bg-brand text-charcoal border-brand'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.mealTime.includes(option)}
                      onChange={() => toggleMealTime(option)}
                      className="accent-brand"
                    />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">Nguyên liệu</span>
              <button type="button" onClick={() => handleAddItem('ingredients')} className="text-brand text-sm font-semibold">
                + Thêm
              </button>
            </div>
            <div className="space-y-3">
              {form.ingredients.map((value, index) => (
                <div key={`ingredient-${index}`} className="flex gap-3 items-center">
                  <input
                    value={value}
                    onChange={(event) => handleArrayChange('ingredients', index, event.target.value)}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-brand/60 outline-none"
                  />
                  {form.ingredients.length > 1 && (
                    <button type="button" className="text-danger text-sm" onClick={() => handleRemoveItem('ingredients', index)}>
                      Xóa
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">Hướng dẫn</span>
              <button type="button" onClick={() => handleAddItem('instructions')} className="text-brand text-sm font-semibold">
                + Thêm
              </button>
            </div>
            <div className="space-y-3">
              {form.instructions.map((value, index) => (
                <div key={`instruction-${index}`} className="flex gap-3 items-center">
                  <input
                    value={value}
                    onChange={(event) => handleArrayChange('instructions', index, event.target.value)}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-brand/60 outline-none"
                  />
                  {form.instructions.length > 1 && (
                    <button type="button" className="text-danger text-sm" onClick={() => handleRemoveItem('instructions', index)}>
                      Xóa
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">Tag</span>
              <button type="button" onClick={() => handleAddItem('tag')} className="text-brand text-sm font-semibold">
                + Thêm
              </button>
            </div>
            <div className="space-y-3">
              {form.tag.map((value, index) => (
                <div key={`tag-${index}`} className="flex gap-3 items-center">
                  <input
                    value={value}
                    onChange={(event) => handleArrayChange('tag', index, event.target.value)}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-brand/60 outline-none"
                  />
                  {form.tag.length > 1 && (
                    <button type="button" className="text-danger text-sm" onClick={() => handleRemoveItem('tag', index)}>
                      Xóa
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 hover:text-charcoal"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-brand text-charcoal font-semibold shadow-card disabled:opacity-70"
            >
              {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MealFormModal

