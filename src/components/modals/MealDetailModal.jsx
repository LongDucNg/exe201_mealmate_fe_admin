const MealDetailModal = ({ open, onClose, meal }) => {
  if (!open || !meal) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[32px] p-8 w-full max-w-3xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-charcoal">{meal.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-charcoal">
            ✕
          </button>
        </div>
        {meal.image && <img src={meal.image} alt={meal.name} className="rounded-2xl w-full object-cover max-h-64" />}
        <p className="text-gray-600">{meal.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <p>
            <strong>Diet type:</strong> {meal.dietType}
          </p>
          <p>
            <strong>Total kcal:</strong> {meal.totalKcal}
          </p>
          <p>
            <strong>Meal time:</strong> {meal.mealTime?.join(', ') || '—'}
          </p>
          <p>
            <strong>Rating:</strong> {meal.rating ?? '—'}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-charcoal mb-2">Nguyên liệu</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {meal.ingredients?.map((ingredient) => (
              <li key={ingredient._id ?? ingredient.name}>{ingredient.name}</li>
            )) ?? <li>Không có dữ liệu</li>}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-charcoal mb-2">Hướng dẫn</h4>
          <ol className="list-decimal list-inside text-gray-600 space-y-1">
            {meal.instructions?.map((step, index) => (
              <li key={index}>{step}</li>
            )) ?? <li>Không có dữ liệu</li>}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default MealDetailModal

