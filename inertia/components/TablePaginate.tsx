import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/react'
import { useMemo } from 'react'

export type MetaType = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export interface TablePaginateProps {
  href: string
  meta: MetaType
  includeCurrentQs?: boolean
}

const TablePaginate = ({ href, meta, includeCurrentQs = false }: TablePaginateProps) => {
  const qs = usePage<SharedProps>().props.qs
  // We copy the qs object to avoid modifying the original object
  const qsCopy = { ...qs }
  delete qsCopy.page

  const totalPages = useMemo(() => Math.ceil(meta.total / meta.perPage), [meta])

  const renderPaginationItem = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink
        data={includeCurrentQs ? qsCopy : {}}
        isActive={page === meta.currentPage}
        href={`${href}?page=${page}`}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  )

  return (
    <Pagination>
      <PaginationContent className="flex !flex-wrap items-center">
        <PaginationItem>
          <PaginationPrevious
            data={includeCurrentQs ? qsCopy : {}}
            onClick={(e) => !meta.previousPageUrl && e.preventDefault()}
            className={
              meta.previousPageUrl ? '' : 'opacity-50 hover:!bg-transparent cursor-not-allowed'
            }
            href={meta.previousPageUrl ? `${href}${meta.previousPageUrl}` : ''}
          />
        </PaginationItem>
        {meta.currentPage > 2 && renderPaginationItem(1)}
        {meta.currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (page) =>
            page >= meta.currentPage - 1 &&
            page <= meta.currentPage + 1 &&
            renderPaginationItem(page)
        )}
        {meta.currentPage + 2 < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {meta.currentPage + 1 < totalPages && renderPaginationItem(totalPages)}
        <PaginationItem>
          <PaginationNext
            data={includeCurrentQs ? qsCopy : {}}
            className={
              meta.nextPageUrl ? '' : 'opacity-50 hover:!bg-transparent cursor-not-allowed'
            }
            href={meta.nextPageUrl ? `${href}${meta.nextPageUrl}` : ''}
            onClick={(e) => !meta.nextPageUrl && e.preventDefault()}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default TablePaginate
