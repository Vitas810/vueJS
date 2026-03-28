<template>
  <div class="tag-list-block">
    <ul class="tag-list">
      <li
        v-for="(tag, tagIndex) in visibleTags"
        :key="`${tag}-${tagIndex}`"
        class="tag-list__item tag-list__item_outline"
      >
        {{ tag }}
      </li>
    </ul>

    <button
      v-if="hasHiddenTags"
      class="app-button app-button_secondary app-button_small tag-list-block__toggle"
      type="button"
      :aria-expanded="String(hasExpandedTags)"
      @click="toggleTags"
    >
      Показать еще
    </button>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'

interface TagListData {
  visibleTagsCount: number
}

export default Vue.extend({
  name: 'McvTagList',
  props: {
    tags: {
      type: Array as PropType<string[]>,
      required: true,
    },
    maxVisible: {
      type: Number,
      required: false,
      default: 10,
    },
  },
  data(): TagListData {
    return {
      visibleTagsCount: this.maxVisible,
    }
  },
  computed: {
    // Видимые теги
    visibleTags(): string[] {
      return this.tags.slice(0, this.visibleTagsCount)
    },

    // Флаг скрытых тегов
    hasHiddenTags(): boolean {
      return this.visibleTagsCount < this.tags.length
    },

    // Факт частичного раскрытия тегов
    hasExpandedTags(): boolean {
      return this.visibleTagsCount > this.maxVisible
    },

    // Шаг порционного показа тегов
    expandStep(): number {
      return this.maxVisible > 0 ? this.maxVisible : 10
    },
  },
  watch: {
    // Сброс лимита тегов при смене статьи
    tags(): void {
      this.visibleTagsCount = this.maxVisible
    },
  },
  methods: {
    // Добавление следующей пачки тегов
    toggleTags(): void {
      if (!this.hasHiddenTags) {
        return
      }

      this.visibleTagsCount = Math.min(
        this.visibleTagsCount + this.expandStep,
        this.tags.length
      )
    },
  },
})
</script>
