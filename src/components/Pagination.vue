<template>
  <ul v-if="totalPages > 1" class="pagination">
    <li>
      <router-link
        v-if="hasPreviousPage"
        :to="getPageLocation(currentPage - 1)"
        class="pagination__link pagination__link_arrow"
        aria-label="Предыдущая страница"
      >
        ←
      </router-link>
      <span v-else class="pagination__link pagination__link_disabled">←</span>
    </li>

    <li v-for="item in paginationItems" :key="item.key">
      <router-link
        v-if="item.type === 'page' && item.page"
        :to="getPageLocation(item.page)"
        class="pagination__link"
        :class="{pagination__link_active: currentPage === item.page}"
      >
        {{ item.page }}
      </router-link>

      <span v-else class="pagination__ellipsis">...</span>
    </li>

    <li>
      <router-link
        v-if="hasNextPage"
        :to="getPageLocation(currentPage + 1)"
        class="pagination__link pagination__link_arrow"
        aria-label="Следующая страница"
      >
        →
      </router-link>
      <span v-else class="pagination__link pagination__link_disabled">→</span>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import {Location} from 'vue-router'
import {range} from '@/helpers/utils'

interface PaginationItem {
  key: string
  type: 'page' | 'ellipsis'
  page?: number
}

export default Vue.extend({
  name: 'McvPagination',
  props: {
    total: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  computed: {
    // Общее количество страниц
    totalPages(): number {
      return Math.ceil(this.total / this.limit)
    },

    // Флаг предыдущей страницы
    hasPreviousPage(): boolean {
      return this.currentPage > 1
    },

    // Флаг следующей страницы
    hasNextPage(): boolean {
      return this.currentPage < this.totalPages
    },

    // Центральный диапазон страниц
    visiblePageNumbers(): number[] {
      if (this.totalPages <= 5) {
        return range(1, this.totalPages)
      }

      let startPage = Math.max(1, this.currentPage - 2)
      let endPage = Math.min(this.totalPages, startPage + 4)

      startPage = Math.max(1, endPage - 4)

      return range(startPage, endPage)
    },

    // Элементы пагинации с многоточиями
    paginationItems(): PaginationItem[] {
      const items: PaginationItem[] = []
      const firstVisiblePage = this.visiblePageNumbers[0]
      const lastVisiblePage =
        this.visiblePageNumbers[this.visiblePageNumbers.length - 1]

      if (firstVisiblePage > 1) {
        items.push({
          key: 'page-1',
          type: 'page',
          page: 1,
        })
      }

      if (firstVisiblePage > 2) {
        items.push({
          key: 'ellipsis-start',
          type: 'ellipsis',
        })
      }

      this.visiblePageNumbers.forEach((page) => {
        items.push({
          key: `page-${page}`,
          type: 'page',
          page,
        })
      })

      if (lastVisiblePage < this.totalPages - 1) {
        items.push({
          key: 'ellipsis-end',
          type: 'ellipsis',
        })
      }

      if (lastVisiblePage < this.totalPages) {
        items.push({
          key: `page-${this.totalPages}`,
          type: 'page',
          page: this.totalPages,
        })
      }

      return items
    },
  },
  methods: {
    // Путь для страницы пагинации
    getPageLocation(page: number): Location {
      return {
        path: this.url,
        query: {
          ...this.$route.query,
          page: String(page),
        },
      }
    },
  },
})
</script>
