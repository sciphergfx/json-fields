import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { getUIComponents, getUIClasses } from '../utils/uiAdapters'
import { getDisplayName } from '../utils/jsonUtils'

/**
 * Table Component - UI Library Agnostic
 * @param {Object} props - Component props
 * @param {string} props.uiLibrary - UI library to use ("chakra", "tailwind", "shadcn")
 * @param {Function} props.onSave - Callback when save is triggered (nestedData, flatData) => void
 * @param {Function} props.onCancel - Callback when cancel is triggered () => void
 * @param {Function} props.onFieldChange - Callback when field changes (key, value, fullData) => void
 * @param {string} props.saveButtonText - Text for save button
 * @param {string} props.cancelButtonText - Text for cancel button
 * @param {string} props.initialJson - Initial JSON string
 * @param {Object} props.customStyles - Custom styles object
 * @param {boolean} props.showControls - Whether to show save/cancel buttons
 */
const Table = ({
  uiLibrary = 'chakra',
  onSave,
  onCancel,
  onFieldChange,
  saveButtonText = 'Save Changes',
  cancelButtonText = 'Reset Form',
  initialJson = '',
  customStyles = {},
  showControls = true,
  // pagination & cache
  pagination = true,
  pageSize = 10,
  cacheSize = 3,
  initialPage = 1,
  onPageChange,
  // optional custom pagination override
  paginationComponent: PaginationComponent = null,
  paginationRenderer = null,
  ...props
}) => {
  const [jsonInput, setJsonInput] = useState(initialJson)
  const [tableData, setTableData] = useState(null)
  const [error, setError] = useState('')
  const [editableData, setEditableData] = useState(null)
  const [currentPage, setCurrentPage] = useState(initialPage > 0 ? initialPage : 1)
  // simple LRU cache for page slices
  const pageCacheRef = useRef(new Map()) // key: page number, value: rows slice
  const lruRef = useRef([]) // array of page numbers, most-recent at end

  const UI = getUIComponents(uiLibrary)

  const parseJson = useCallback(
    (jsonString = jsonInput) => {
      setError('')
      setTableData(null)

      if (!jsonString.trim()) {
        setError('Please enter some JSON data')
        return
      }

      try {
        const parsed = JSON.parse(jsonString)

        if (Array.isArray(parsed)) {
          if (parsed.length === 0) {
            setError('The JSON array is empty')
            return
          }
          setTableData(parsed)
          setEditableData([...parsed])
        } else if (typeof parsed === 'object' && parsed !== null) {
          const arrayData = [parsed]
          setTableData(arrayData)
          setEditableData([...arrayData])
        } else {
          setError('JSON must be an object or array of objects')
          return
        }
      } catch (err) {
        setError(`Invalid JSON: ${err.message}`)
      }
    },
    [jsonInput],
  )

  useEffect(() => {
    if (initialJson) {
      setJsonInput(initialJson)
      parseJson(initialJson)
    } else if (initialJson === '') {
      // Clear everything when initialJson is explicitly set to empty string
      setJsonInput('')
      setTableData(null)
      setEditableData(null)
      setError('')
    }
  }, [initialJson, parseJson])

  // Reset cache on mount and whenever editableData changes (e.g., new JSON parsed)
  useEffect(() => {
    // reset cache
    pageCacheRef.current.clear()
    lruRef.current = []
    // clamp and reset page
    setCurrentPage(initialPage > 0 ? initialPage : 1)
  }, [editableData, initialPage])

  

  const handleCellEdit = (rowIndex, key, value) => {
    const newData = [...editableData]
    newData[rowIndex][key] = value
    setEditableData(newData)

    if (onFieldChange) {
      onFieldChange(key, value, newData)
    }
  }

  const handleSave = () => {
    if (onSave && editableData) {
      const flatData = editableData.map((row) => ({ ...row }))
      onSave(editableData, flatData)
    }
  }

  const handleCancel = () => {
    if (tableData) {
      setEditableData([...tableData])
    }
    if (onCancel) {
      onCancel()
    }
  }

  const getColumns = () => {
    if (!tableData || tableData.length === 0) return []

    const allKeys = new Set()
    tableData.forEach((row) => {
      Object.keys(row).forEach((key) => allKeys.add(key))
    })

    return Array.from(allKeys)
  }

  const totalRows = useMemo(
    () => (Array.isArray(editableData) ? editableData.length : 0),
    [editableData],
  )
  const totalPages = useMemo(() => {
    if (!pagination) return 1
    return Math.max(1, Math.ceil((totalRows || 0) / Math.max(1, pageSize)))
  }, [pagination, totalRows, pageSize])

  const getPageSlice = (page) => {
    if (!pagination || !Array.isArray(editableData)) return editableData || []
    const safePage = Math.min(Math.max(1, page), totalPages)
    // cache lookup
    if (pageCacheRef.current.has(safePage)) {
      // update LRU
      const idx = lruRef.current.indexOf(safePage)
      if (idx !== -1) lruRef.current.splice(idx, 1)
      lruRef.current.push(safePage)
      return pageCacheRef.current.get(safePage)
    }
    const start = (safePage - 1) * pageSize
    const end = start + pageSize
    const slice = editableData.slice(start, end)
    // add to cache
    pageCacheRef.current.set(safePage, slice)
    lruRef.current.push(safePage)
    // evict if needed
    while (lruRef.current.length > Math.max(1, cacheSize)) {
      const evictPage = lruRef.current.shift()
      if (evictPage != null) pageCacheRef.current.delete(evictPage)
    }
    return slice
  }

  const goToPage = (nextPage) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages)
    if (clamped !== currentPage) {
      setCurrentPage(clamped)
      if (typeof onPageChange === 'function') onPageChange(clamped)
    }
  }

  const prevPage = () => goToPage(currentPage - 1)
  const nextPageFn = () => goToPage(currentPage + 1)

  const renderTable = () => {
    if (!editableData || editableData.length === 0) return null

    const columns = getColumns()
    const rows = pagination ? getPageSlice(currentPage) : editableData

    return (
      <UI.Box
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ overflowX: 'auto', ...customStyles.tableContainer }}
      >
        <UI.Table className={getUIClasses(uiLibrary, 'Table')} style={customStyles.table}>
          <UI.Thead className={getUIClasses(uiLibrary, 'Thead')}>
            <UI.Tr className={getUIClasses(uiLibrary, 'Tr')}>
              {columns.map((column) => (
                <UI.Th
                  key={column}
                  className={getUIClasses(uiLibrary, 'Th')}
                  style={{ textAlign: 'center', ...customStyles.th }}
                >
                  {getDisplayName(column)}
                </UI.Th>
              ))}
            </UI.Tr>
          </UI.Thead>
          <UI.Tbody className={getUIClasses(uiLibrary, 'Tbody')}>
            {rows.map((row, rowIndex) => (
              <UI.Tr key={rowIndex} className={getUIClasses(uiLibrary, 'Tr')}>
                {columns.map((column) => (
                  <UI.Td
                    key={column}
                    className={getUIClasses(uiLibrary, 'Td')}
                    style={customStyles.td}
                  >
                    <UI.Input
                      type="text"
                      value={row[column] || ''}
                      onChange={(e) =>
                        handleCellEdit(
                          pagination ? (currentPage - 1) * pageSize + rowIndex : rowIndex,
                          column,
                          e.target.value,
                        )
                      }
                      className={getUIClasses(uiLibrary, 'Input')}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        ...customStyles.input,
                      }}
                    />
                  </UI.Td>
                ))}
              </UI.Tr>
            ))}
          </UI.Tbody>
        </UI.Table>
        {pagination &&
          totalPages > 1 &&
          (() => {
            const pagerProps = {
              currentPage,
              totalPages,
              pageSize,
              cacheSize,
              goToPage,
              prevPage,
              nextPage: nextPageFn,
            }
            if (typeof paginationRenderer === 'function') {
              return <UI.Box style={{ marginTop: '12px' }}>{paginationRenderer(pagerProps)}</UI.Box>
            }
            if (PaginationComponent) {
              const Comp = PaginationComponent
              return (
                <UI.Box style={{ marginTop: '12px' }}>
                  <Comp {...pagerProps} />
                </UI.Box>
              )
            }
            return (
              <UI.HStack
                className={getUIClasses(uiLibrary, 'HStack')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  ...(customStyles.pagination || {}),
                }}
              >
                <UI.Button
                  onClick={prevPage}
                  disabled={currentPage <= 1}
                  className={getUIClasses(uiLibrary, 'Button', 'secondary')}
                  style={{ opacity: currentPage <= 1 ? 0.5 : 1 }}
                >
                  Prev
                </UI.Button>
                <UI.Text>
                  {currentPage} / {totalPages}
                </UI.Text>
                <UI.Button
                  onClick={nextPageFn}
                  disabled={currentPage >= totalPages}
                  className={getUIClasses(uiLibrary, 'Button', 'secondary')}
                  style={{ opacity: currentPage >= totalPages ? 0.5 : 1 }}
                >
                  Next
                </UI.Button>
              </UI.HStack>
            )
          })()}
      </UI.Box>
    )
  }

  return (
    <UI.Container
      className={getUIClasses(uiLibrary, 'Container')}
      style={customStyles.container}
      {...props}
    >
      <UI.VStack
        className={getUIClasses(uiLibrary, 'VStack')}
        style={{ gap: '1rem', ...customStyles.stack }}
      >
        

        {error && (
          <UI.Alert
            className={getUIClasses(uiLibrary, 'Alert', 'error')}
            style={customStyles.alert}
          >
            <UI.Text style={customStyles.errorText}>{error}</UI.Text>
          </UI.Alert>
        )}

        {renderTable()}

        {showControls && editableData && (
          <UI.HStack
            gap="2"
            className={getUIClasses(uiLibrary, 'HStack')}
            style={{ gap: '0.5rem', marginTop: '1rem', ...customStyles.controlButtons }}
          >
            <UI.Button
              onClick={handleSave}
              className={getUIClasses(uiLibrary, 'Button', 'default')}
              style={customStyles.saveButton}
            >
              {saveButtonText}
            </UI.Button>
            <UI.Button
              onClick={handleCancel}
              className={getUIClasses(uiLibrary, 'Button', 'secondary')}
              style={customStyles.cancelButton}
            >
              {cancelButtonText}
            </UI.Button>
          </UI.HStack>
        )}
      </UI.VStack>
    </UI.Container>
  )
}

export default Table
