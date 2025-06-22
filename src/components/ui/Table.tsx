// ===============================================
// COMPONENTE TABLE - Sistema de Catequesis
// ===============================================

import React, { useState, useMemo } from 'react';
import { TableProps, TableColumn } from '@/lib/types/ui';
import { cn } from '@/lib/utils/cn';

/**
 * Iconos para la tabla
 */
const SortIcon = ({ direction }: { direction?: 'asc' | 'desc' | null }) => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {direction === 'asc' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    ) : direction === 'desc' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    )}
  </svg>
);

const CheckboxIcon = ({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) => (
  <input
    type="checkbox"
    checked={checked}
    ref={(el) => {
      if (el) el.indeterminate = !!indeterminate;
    }}
    onChange={() => {}} // Manejado por el componente padre
    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
  />
);

const RadioIcon = ({ checked }: { checked: boolean }) => (
  <input
    type="radio"
    checked={checked}
    onChange={() => {}} // Manejado por el componente padre
    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
  />
);

const EmptyStateIcon = () => (
  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Cargando datos...</span>
  </div>
);

/**
 * Componente para paginación
 */
const Pagination = ({ 
  current, 
  pageSize, 
  total, 
  showSizeChanger = false, 
  showQuickJumper = false,
  onChange 
}: {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  onChange: (page: number, pageSize: number) => void;
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const [jumpValue, setJumpValue] = useState('');

  const handleSizeChange = (newSize: number) => {
    onChange(1, newSize);
  };

  const handleJump = () => {
    const page = parseInt(jumpValue);
    if (page >= 1 && page <= totalPages) {
      onChange(page, pageSize);
      setJumpValue('');
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onChange(1, pageSize)}
          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-l-md"
        >
          1
        </button>
      );
      if (start > 2) {
        pages.push(<span key="start-ellipsis" className="px-3 py-2 text-gray-500">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onChange(i, pageSize)}
          className={cn(
            'px-3 py-2 text-sm border-t border-b border-r border-gray-300',
            i === current
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          )}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="px-3 py-2 text-gray-500">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onChange(totalPages, pageSize)}
          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-r-md"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center text-sm text-gray-700">
        <span>
          Mostrando {((current - 1) * pageSize) + 1} a {Math.min(current * pageSize, total)} de {total} resultados
        </span>
        
        {showSizeChanger && (
          <div className="ml-6 flex items-center">
            <label className="mr-2">Mostrar:</label>
            <select
              value={pageSize}
              onChange={(e) => handleSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {showQuickJumper && (
          <div className="flex items-center text-sm">
            <span className="mr-2">Ir a página:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJump()}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <button
              onClick={handleJump}
              className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Ir
            </button>
          </div>
        )}
        
        <div className="flex">
          {renderPageNumbers()}
        </div>
      </div>
    </div>
  );
};

/**
 * Componente Table principal
 */
export const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  empty,
  pagination,
  selection,
  onRow,
  scroll,
  className,
  ...props
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Función para ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const { key, direction } = sortConfig;
    const column = columns.find(col => col.key === key);
    
    return [...data].sort((a, b) => {
      if (column?.sorter && typeof column.sorter === 'function') {
        return direction === 'asc' 
          ? column.sorter(a, b)
          : column.sorter(b, a);
      }

      const aVal = a[key];
      const bVal = b[key];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const result = aVal < bVal ? -1 : 1;
      return direction === 'asc' ? result : -result;
    });
  }, [data, sortConfig, columns]);

  // Manejar ordenamiento
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable && !column.sorter) return;

    setSortConfig(current => {
      if (current?.key === column.key) {
        return current.direction === 'asc' 
          ? { key: column.key, direction: 'desc' }
          : null;
      }
      return { key: column.key, direction: 'asc' };
    });
  };

  // Manejar selección
  const handleSelection = (record: T, checked: boolean) => {
    if (!selection) return;

    const key = record[columns[0]?.key || 'id'];
    const currentKeys = selection.selectedRowKeys;
    const newKeys = checked
      ? [...currentKeys, key]
      : currentKeys.filter(k => k !== key);
    
    const selectedRows = sortedData.filter(item => 
      newKeys.includes(item[columns[0]?.key || 'id'])
    );

    selection.onChange(newKeys, selectedRows);
  };

  // Manejar selección de todos
  const handleSelectAll = (checked: boolean) => {
    if (!selection) return;

    const allKeys = sortedData.map(item => item[columns[0]?.key || 'id']);
    const newKeys = checked ? allKeys : [];
    const selectedRows = checked ? sortedData : [];

    selection.onChange(newKeys, selectedRows);
  };

  // Estados de selección
  const allSelected = selection && sortedData.length > 0 && 
    sortedData.every(item => selection.selectedRowKeys.includes(item[columns[0]?.key || 'id']));
  const someSelected = selection && selection.selectedRowKeys.length > 0 && !allSelected;

  if (loading) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
        <div className="flex flex-col items-center justify-center py-16">
          <EmptyStateIcon />
          <p className="mt-4 text-lg font-medium text-gray-900">No hay datos</p>
          <p className="mt-2 text-gray-500">
            {empty ? empty : 'No se encontraron resultados para mostrar'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)} {...props}>
      <div className={cn('overflow-auto', scroll?.x && `max-w-[${scroll.x}px]`, scroll?.y && `max-h-[${scroll.y}px]`)}>
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {/* Columna de selección */}
              {selection && (
                <th className="w-12 px-6 py-3 text-left">
                  {selection.type !== 'radio' && (
                    <div 
                      className="cursor-pointer"
                      onClick={() => handleSelectAll(!allSelected)}
                    >
                      <CheckboxIcon 
                        checked={!!allSelected}
                        indeterminate={someSelected}
                      />
                    </div>
                  )}
                </th>
              )}

              {/* Columnas de datos */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    (column.sortable || column.sorter) && 'cursor-pointer hover:text-gray-700',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.width && `w-[${column.width}px]`
                  )}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {(column.sortable || column.sorter) && (
                      <SortIcon 
                        direction={sortConfig?.key === column.key ? sortConfig.direction : null}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((record, index) => {
              const rowProps = onRow ? onRow(record, index) : {};
              const isSelected = selection?.selectedRowKeys.includes(record[columns[0]?.key || 'id']);

              return (
                <tr
                  key={record[columns[0]?.key || 'id'] || index}
                  className={cn(
                    'hover:bg-gray-50 transition-colors',
                    isSelected && 'bg-blue-50',
                    rowProps.className
                  )}
                  {...rowProps}
                >
                  {/* Celda de selección */}
                  {selection && (
                    <td className="w-12 px-6 py-4">
                      <div 
                        className="cursor-pointer"
                        onClick={() => handleSelection(record, !isSelected)}
                      >
                        {selection.type === 'radio' ? (
                          <RadioIcon checked={!!isSelected} />
                        ) : (
                          <CheckboxIcon checked={!!isSelected} />
                        )}
                      </div>
                    </td>
                  )}

                  {/* Celdas de datos */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {column.render 
                        ? column.render(record[column.key], record, index)
                        : record[column.key]
                      }
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && (
        <Pagination {...pagination} />
      )}
    </div>
  );
};

export default Table;