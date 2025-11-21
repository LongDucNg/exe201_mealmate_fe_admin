import { FiPlusCircle, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import PageWrapper from '../components/Layout/PageWrapper.jsx'
import CardStat from '../components/CardStat.jsx'
import DataTable from '../components/DataTable.jsx'
import { mealApi } from '../lib/mealApi.js'
import MealFormModal from '../components/modals/MealFormModal.jsx'
const PAGE_SIZE = 20

const getByPath = (source, path) => path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source)

const pickNumber = (obj, keys, fallback) => {
  if (!obj) return fallback
  const entries = Object.entries(obj)
  for (const key of keys) {
    if (typeof obj[key] === 'number') return obj[key]
    const match = entries.find(([existingKey]) => existingKey.toLowerCase() === key.toLowerCase())
    if (match && typeof match[1] === 'number') return match[1]
  }
  return fallback
}

const pickBoolean = (obj, keys, fallback) => {
  if (!obj) return fallback
  const entries = Object.entries(obj)
  for (const key of keys) {
    if (typeof obj[key] === 'boolean') return obj[key]
    const match = entries.find(([existingKey]) => existingKey.toLowerCase() === key.toLowerCase())
    if (match && typeof match[1] === 'boolean') return match[1]
  }
  return fallback
}

const getNumberFromPaths = (payload, paths) => {
  for (const path of paths) {
    const value = getByPath(payload, path)
    if (typeof value === 'number') return value
  }
  return undefined
}

const findNumberByPattern = (source, patterns) => {
  if (!source || typeof source !== 'object') return undefined
  const stack = [source]
  while (stack.length) {
    const current = stack.pop()
    if (current && typeof current === 'object') {
      for (const [key, value] of Object.entries(current)) {
        if (typeof value === 'number' && patterns.some((pattern) => pattern.test(key))) {
          return value
        }
        if (value && typeof value === 'object') {
          stack.push(value)
        }
      }
    }
  }
  return undefined
}

const normalizeMealsResponse = (payload) => {
  const arrayPaths = [
    ['data'],
    ['data', 'items'],
    ['data', 'data'],
    ['data', 'meals'],
    ['data', 'records'],
    ['data', 'result'],
    ['data', 'data', 'items'],
    ['data', 'data', 'data'],
    ['items'],
    ['meals'],
    ['records'],
    [],
  ]

  const paginationPaths = [
    ['pagination'],
    ['data', 'pagination'],
    ['data', 'data', 'pagination'],
    ['data', 'meta', 'pagination'],
    ['meta', 'pagination'],
  ]

  let meals = []
  for (const path of arrayPaths) {
    const value = path.length === 0 ? payload : getByPath(payload, path)
    if (Array.isArray(value)) {
      meals = value
      break
    }
  }

  let rawPagination = null
  for (const path of paginationPaths) {
    const value = getByPath(payload, path)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      rawPagination = value
      break
    }
  }

  if (!rawPagination) {
    const totalFallback = payload?.total ?? payload?.count ?? payload?.data?.total ?? payload?.data?.count
    if (typeof totalFallback === 'number') {
      rawPagination = { total: totalFallback }
    }
  }

  const normalizedPagination = rawPagination
    ? {
        page: pickNumber(rawPagination, ['page', 'currentPage', 'pageNumber', 'page_index'], 1),
        limit: pickNumber(rawPagination, ['limit', 'perPage', 'pageSize', 'page_size'], PAGE_SIZE),
        total: pickNumber(
          rawPagination,
          ['total', 'totalItems', 'totalItem', 'totalCount', 'totalDocs', 'totalRecords', 'count'],
          undefined,
        ),
        totalPages: pickNumber(
          rawPagination,
          ['totalPages', 'pages', 'pageCount', 'total_page', 'total_pages'],
          undefined,
        ),
        hasNextPage: pickBoolean(rawPagination, ['hasNextPage', 'has_next_page', 'hasNext'], undefined),
        hasPrevPage: pickBoolean(rawPagination, ['hasPrevPage', 'has_prev_page', 'hasPrev'], undefined),
      }
    : null

  if (normalizedPagination) {
    if (normalizedPagination.total === undefined) {
      const totalPaths = [
        ['data', 'pagination', 'total'],
        ['data', 'pagination', 'count'],
        ['data', 'data', 'pagination', 'total'],
        ['data', 'data', 'pagination', 'count'],
        ['data', 'data', 'total'],
        ['data', 'data', 'count'],
        ['data', 'meta', 'pagination', 'total'],
        ['data', 'meta', 'total'],
        ['data', 'total'],
        ['total'],
      ]
      const fallbackTotal =
        getNumberFromPaths(payload, totalPaths) ??
        findNumberByPattern(payload, [/total/i, /count/i])
      if (fallbackTotal !== undefined) normalizedPagination.total = fallbackTotal
    }

    if (normalizedPagination.totalPages === undefined && normalizedPagination.total !== undefined) {
      normalizedPagination.totalPages = Math.max(
        1,
        Math.ceil(normalizedPagination.total / (normalizedPagination.limit ?? PAGE_SIZE)),
      )
    }

    if (normalizedPagination.hasPrevPage === undefined && normalizedPagination.page !== undefined) {
      normalizedPagination.hasPrevPage = normalizedPagination.page > 1
    }

    if (
      normalizedPagination.hasNextPage === undefined &&
      normalizedPagination.totalPages !== undefined &&
      normalizedPagination.page !== undefined
    ) {
      normalizedPagination.hasNextPage = normalizedPagination.page < normalizedPagination.totalPages
    }
  }

  return { meals, pagination: normalizedPagination }
}

const ManagerMeals = () => {
  const queryClient = useQueryClient()
  const [inputValue, setInputValue] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState(null)
  const [searchError, setSearchError] = useState('')

  const trimmedSearch = searchKeyword.trim()
  const queryKey = useMemo(() => ['meals', { search: trimmedSearch, page }], [trimmedSearch, page])
  const isSearching = Boolean(trimmedSearch)

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        if (trimmedSearch) {
          const res = await mealApi.search(trimmedSearch, page, PAGE_SIZE)
          const responseData = res.data
          const { meals, pagination } = normalizeMealsResponse(responseData)
          return {
            message: responseData.message || 'Search meals successfully',
            success: responseData.success ?? true,
            data: meals,
            pagination:
              pagination ?? {
                page: page,
                limit: PAGE_SIZE,
                total: meals.length,
                totalPages: Math.max(1, Math.ceil(meals.length / PAGE_SIZE)),
                hasNextPage: meals.length === PAGE_SIZE,
                hasPrevPage: page > 1,
              },
          }
        }

        const res = await mealApi.getAll(page, PAGE_SIZE)
        const responseData = res.data
        const { meals, pagination } = normalizeMealsResponse(responseData)

        return {
          message: responseData.message || 'Get meals successfully',
          success: responseData.success ?? true,
          data: meals,
          pagination:
            pagination ?? {
              page,
              limit: PAGE_SIZE,
              total: meals.length,
              totalPages: Math.max(1, Math.ceil(meals.length / PAGE_SIZE)),
              hasNextPage: meals.length === PAGE_SIZE,
              hasPrevPage: page > 1,
            },
        }
      } catch (err) {
        // Log chi tiết lỗi để debug
        console.error('Error fetching meals:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        })
        throw err
      }
    },
    keepPreviousData: true,
    // Disable cache để tránh vấn đề với 304 Not Modified
    staleTime: 0,
    cacheTime: 0,
    // Thêm retry logic để xử lý network errors
    retry: 3, // Retry 3 lần nếu fail
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    // Chỉ retry với network errors, không retry với 4xx errors
    retryOnMount: true,
  })

  const createMutation = useMutation({
    mutationFn: (payload) => mealApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      setFormModalOpen(false)
      setEditingMeal(null)
      alert('Tạo món ăn thành công')
    },
    onError: (mutationError) => {
      alert(`Không thể tạo món ăn: ${mutationError.response?.data?.message ?? mutationError.message}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => mealApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      setFormModalOpen(false)
      setEditingMeal(null)
      alert('Cập nhật món ăn thành công')
    },
    onError: (mutationError) => {
      alert(`Không thể cập nhật món ăn: ${mutationError.response?.data?.message ?? mutationError.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => mealApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      alert('Đã xoá món ăn')
    },
    onError: (mutationError) => {
      alert(`Không thể xoá món ăn: ${mutationError.response?.data?.message ?? mutationError.message}`)
    },
  })

  // Response structure: data đã được xử lý trong queryFn, nên data.data là array trực tiếp
  const rows = useMemo(() => {
    if (!Array.isArray(data?.data)) return []
    return data.data.map((item) => ({
      ...item,
      categoryName: item.category?.name ?? (typeof item.category === 'string' ? item.category : '—'),
      subCategoryName: item.subCategory?.name ?? (typeof item.subCategory === 'string' ? item.subCategory : '—'),
    }))
  }, [data])
  const paginationInfo = data?.pagination ?? null
  const effectiveLimit = paginationInfo?.limit ?? PAGE_SIZE
  const totalItems =
    paginationInfo?.total ??
    paginationInfo?.count ??
    paginationInfo?.totalItems ??
    paginationInfo?.totalItem ??
    paginationInfo?.totalDocs ??
    (isSearching ? rows.length : rows.length)
  const currentPage = paginationInfo?.page ?? paginationInfo?.currentPage ?? page
  const totalPages =
    paginationInfo?.totalPages ??
    paginationInfo?.pages ??
    paginationInfo?.pageCount ??
    (paginationInfo?.total ? Math.ceil(paginationInfo.total / effectiveLimit) : undefined)
  const hasPrevPage =
    paginationInfo?.hasPrevPage ??
    paginationInfo?.hasPrev ??
    paginationInfo?.has_previous ??
    (currentPage > 1 ? true : false)
  const hasNextPage =
    paginationInfo?.hasNextPage ??
    paginationInfo?.hasNext ??
    paginationInfo?.has_next ??
    (totalPages ? currentPage < totalPages : rows.length === effectiveLimit)

  const displayedTotalText = isSearching
    ? `Kết quả: ${totalItems ?? rows.length} món`
    : `All meals: ${isLoading ? '...' : totalItems ?? rows.length}`

  const columns = [
    {
      key: 'name',
      label: 'Tên món',
      render: (value, row) => (
        <div className="space-y-1">
          <p className="font-semibold text-lg">{value}</p>
          <p className="text-sm text-gray-500">{row.dietType ?? '—'}</p>
        </div>
      ),
    },
    { key: 'totalKcal', label: 'Kcal' },
    {
      key: 'mealTime',
      label: 'Bữa',
      render: (value) => (Array.isArray(value) ? value.join(', ') : '—'),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value) => value ?? '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-4 text-brand">
          <FiEdit2 className="cursor-pointer" onClick={() => handleEdit(row)} />
          <FiTrash2
            className={`cursor-pointer text-danger ${deleteMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => {
              if (deleteMutation.isPending) return
              if (window.confirm('Bạn chắc chắn muốn xoá món ăn này?')) {
                deleteMutation.mutate(row._id)
              }
            }}
          />
        </div>
      ),
    },
  ]

  const handleEdit = (meal) => {
    setEditingMeal(meal)
    setFormModalOpen(true)
  }

  const handleCreate = () => {
    setEditingMeal(null)
    setFormModalOpen(true)
  }

  const handleSubmitForm = (payload) => {
    if (editingMeal) {
      updateMutation.mutate({ id: editingMeal._id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleSearchCommit = () => {
    const next = inputValue.trim()
    setPage(1)
    if (!next) {
      setSearchKeyword('')
      setSearchError('Vui lòng nhập tên món ăn trước khi tìm kiếm.')
      return
    }
    setSearchKeyword(next)
    setSearchError('')
  }

  return (
    <PageWrapper title="Manager" subtitle="Quản lý bữa ăn">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardStat label="Tổng số món ăn" value={isLoading ? '...' : totalItems ?? rows.length} accent="brand" />
          <div className="bg-white rounded-[32px] shadow-card p-6 flex items-center justify-between border border-gray-100">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[.3em] text-gray-400">Tạo món ăn mới</p>
              <p className="text-2xl font-semibold text-charcoal">Thêm món ăn</p>
              <p className="text-sm text-gray-500">Cập nhật thực đơn ngay lập tức</p>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-3 bg-brand text-charcoal rounded-2xl font-semibold shadow-card hover:bg-brandDark transition"
              onClick={handleCreate}
            >
              <FiPlusCircle />
              Add meal
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-card p-6 space-y-6 border border-gray-100">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-charcoal">Quản lý bữa ăn</p>
              <p className="text-base text-gray-500">{displayedTotalText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm món ăn"
                    className="pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/60"
                    value={inputValue}
                    onChange={(e) => {
                      const nextValue = e.target.value
                      setInputValue(nextValue)
                      if (nextValue === '') {
                        setSearchKeyword('')
                        setSearchError('')
                        setPage(1)
                      } else if (searchError) {
                        setSearchError('')
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        handleSearchCommit()
                      }
                    }}
                  />
                </div>
                <button
                  className="px-5 py-3 rounded-full border border-brand text-brand font-semibold hover:bg-brand/10 transition"
                  onClick={handleSearchCommit}
                >
                  Search
                </button>
              </div>
            </div>
            {searchError && <p className="text-sm text-danger">{searchError}</p>}
          </div>
          {isLoading && <p className="text-gray-500 text-center">Đang tải dữ liệu...</p>}
          {isError && (
            <div className="text-danger text-center space-y-2">
              <p>Không thể tải dữ liệu: {error.message ?? 'Lỗi không xác định'}</p>
              {error.code === 'ERR_NETWORK' && (
                <p className="text-sm text-gray-500">
                  Vui lòng kiểm tra kết nối mạng hoặc thử lại sau. Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ admin.
                </p>
              )}
            </div>
          )}
          {!isLoading && !isError && <DataTable columns={columns} rows={rows} />}
          {!isLoading && !isError && rows.length === 0 && isSearching && (
            <p className="text-center text-gray-500">Không tìm thấy món ăn nào phù hợp với từ khóa.</p>
          )}
          {!isLoading && !isError && (
            <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
              <button
                className="px-4 py-2 rounded-full border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
                disabled={currentPage <= 1 || hasPrevPage === false}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Trang trước
              </button>
              <span className="text-sm">
                Trang {currentPage} / {totalPages ?? '--'}
                {totalItems ? ` · Tổng: ${totalItems} món` : ` · Hiển thị: ${rows.length} món`}
              </span>
              <button
                className="px-4 py-2 rounded-full border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
                disabled={hasNextPage === false}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </div>

      <MealFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        initialData={editingMeal}
        onSubmit={handleSubmitForm}
        loading={createMutation.isLoading || updateMutation.isLoading}
      />
    </PageWrapper>
  )
}

export default ManagerMeals

