import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ReactNode, useState } from 'react'
import DropDownShowHideColumns from './DropDownShowHideColumns'
import TablePaginate, { TablePaginateProps } from './TablePaginate'

// Type conditionnel pour le prop onRowSelectionChange
type RowSelectionChangeHandler<TData, TMode> = TMode extends 'single'
  ? React.Dispatch<React.SetStateAction<TData | undefined>>
  : React.Dispatch<React.SetStateAction<TData[] | undefined>>

// Type de base pour les props communs
type BaseDataTableProps<TData, TValue, TMode extends 'single' | 'multiple' = 'single'> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  legend?: ReactNode
  allowRowSelection?: boolean
  rowSelectionMode?: TMode
  onRowSelectionChange?: RowSelectionChangeHandler<TData, TMode>
  showHideColumns?: boolean
}

// Types étendus pour gérer la pagination conditionnelle
type DataTablePropsWithoutPagination<
  TData,
  TValue,
  TMode extends 'single' | 'multiple' = 'single',
> = BaseDataTableProps<TData, TValue, TMode> & {
  showPagination?: false
  paginationProps?: never
}

type DataTablePropsWithPagination<
  TData,
  TValue,
  TMode extends 'single' | 'multiple' = 'single',
> = BaseDataTableProps<TData, TValue, TMode> & {
  showPagination: true
  paginationProps: TablePaginateProps
}

type DataTableProps<TData, TValue, TMode extends 'single' | 'multiple' = 'single'> =
  | DataTablePropsWithoutPagination<TData, TValue, TMode>
  | DataTablePropsWithPagination<TData, TValue, TMode>

export function DataTable<TData, TValue, TMode extends 'single' | 'multiple' = 'single'>({
  columns,
  data,
  legend,
  allowRowSelection = false,
  rowSelectionMode = 'single' as TMode,
  onRowSelectionChange,
  showHideColumns = false,
  showPagination = false,
  ...props
}: DataTableProps<TData, TValue, TMode>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (originalRow, index) => (originalRow as any).idLog || index.toString(),
    state: {
      rowSelection,
      columnVisibility,
    },
  })

  // Récupérer paginationProps si showPagination est true
  const paginationProps = showPagination
    ? (props as DataTablePropsWithPagination<TData, TValue, TMode>).paginationProps
    : undefined

  return (
    <>
      {legend && legend}
      <div className="flex flex-wrap items-center justify-between">
        {showPagination && paginationProps && <TablePaginate {...paginationProps} />}
        {showHideColumns && <DropDownShowHideColumns table={table} />}
      </div>
      <div className="w-full overflow-auto border rounded-md border-white/10 custom-scrollbar bg-bg_secondary">
        <Table className="relative flex-1">
          <TableHeader className="sticky top-0 z-10 outline-bottom-white bg-bg_secondary ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`group ${allowRowSelection ? 'cursor-pointer' : ''} data-[state=selected]:bg-bg_tertiary `}
                  onClick={() => {
                    if (allowRowSelection) {
                      if (rowSelectionMode === 'single') {
                        setRowSelection({})
                        row.toggleSelected()
                        if (onRowSelectionChange) {
                          // Type cast pour satisfaire TypeScript
                          const handler = onRowSelectionChange as React.Dispatch<
                            React.SetStateAction<TData | undefined>
                          >
                          if (!row.getIsSelected()) {
                            handler(row.original)
                          } else {
                            handler(undefined)
                          }
                        }
                      } else if (rowSelectionMode === 'multiple') {
                        row.toggleSelected()
                        if (onRowSelectionChange) {
                          // Type cast pour satisfaire TypeScript
                          const handler = onRowSelectionChange as React.Dispatch<
                            React.SetStateAction<TData[] | undefined>
                          >
                          handler((prev = []) => {
                            if (!row.getIsSelected()) {
                              return [...prev, row.original]
                            } else {
                              return prev.filter((item) => item !== row.original)
                            }
                          })
                        }
                      }
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${row.getIsSelected() ? 'text-white' : ''}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
