import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function DataTable({ columns, data, searchValue, onSearchChange, searchPlaceholder, filters, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-slate-500">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
    >
      {/* Search & Filters Bar */}
      {(onSearchChange || filters) && (
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-3">
          {onSearchChange && (
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 focus-within:border-cyan-500 transition-all flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={searchPlaceholder || 'Search...'}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
              />
            </div>
          )}
          {filters}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <motion.tr
                  key={row.id || rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.03 }}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-slate-700">
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
        <p className="text-sm text-slate-500">{data.length} record{data.length !== 1 ? 's' : ''} found</p>
      </div>
    </motion.div>
  );
}