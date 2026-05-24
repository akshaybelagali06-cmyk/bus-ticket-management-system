import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

export default function DataTable({ columns, data, searchValue, onSearchChange, searchPlaceholder, filters, loading }) {
  if (loading) {
    return (
      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-12">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-[#94a3b8]">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#1e293b] rounded-2xl border border-[#334155] overflow-hidden shadow-lg"
    >
      {/* Search & Filters Bar */}
      {(onSearchChange || filters) && (
        <div className="p-4 border-b border-[#334155] flex flex-wrap items-center gap-3">
          {onSearchChange && (
            <div className="flex items-center gap-2 bg-[#0f172a] rounded-xl px-4 py-2.5 border border-[#334155] focus-within:border-cyan-500/50 transition-all flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[#64748b]" />
              <input
                type="text"
                placeholder={searchPlaceholder || 'Search...'}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-[#64748b] outline-none w-full"
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
            <tr className="border-b border-[#334155]">
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-[#64748b]">
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
                  className="border-b border-[#334155]/50 hover:bg-[#0f172a]/50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-[#e2e8f0]">
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
      <div className="px-6 py-4 border-t border-[#334155] flex items-center justify-between">
        <p className="text-sm text-[#64748b]">{data.length} record{data.length !== 1 ? 's' : ''} found</p>
      </div>
    </motion.div>
  );
}
