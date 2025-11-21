const MealDetailPanel = ({ meal }) => {
  if (!meal) {
    return (
      <div className="bg-white rounded-[32px] shadow-card p-6 border border-gray-100">
        <p className="text-gray-500">Chọn một món ăn để xem chi tiết.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[32px] shadow-card p-6 border border-gray-100 space-y-4">
      <div className="flex flex-wrap gap-4 items-start">
        {meal.image && (
          <img src={meal.image} alt={meal.name} className="rounded-2xl w-56 h-40 object-cover shadow-card" />
        )}
        <div className="space-y-2 flex-1">
          <h3 className="text-2xl font-semibold text-charcoal">{meal.name}</h3>
          <p className="text-gray-500">{meal.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            <p>
              <strong>Diet:</strong> {meal.dietType ?? '—'}
            </p>
            <p>
              <strong>Total kcal:</strong> {meal.totalKcal ?? '—'}
            </p>
            <p>
              <strong>Meal time:</strong> {meal.mealTime?.join(', ') ?? '—'}
            </p>
            <p>
              <strong>Rating:</strong> {meal.rating ?? '—'}
            </p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-charcoal mb-2">Nguyên liệu</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 max-h-48 overflow-y-auto pr-2">
          {meal.ingredients?.map((ingredient) => (
            <div key={ingredient._id ?? ingredient.name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand"></span>
              <p>{ingredient.name}</p>
            </div>
          )) ?? <p>Không có dữ liệu</p>}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-charcoal mb-2">Hướng dẫn</h4>
        <ol className="list-decimal list-inside text-gray-600 space-y-1 max-h-48 overflow-y-auto pr-2">
          {meal.instructions?.map((step, index) => (
            <li key={index}>{step}</li>
          )) ?? <li>Không có dữ liệu</li>}
        </ol>
      </div>
    </div>
  )
}

export default MealDetailPanel

