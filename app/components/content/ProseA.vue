<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: ""
  },
  target: {
    type: String,
    default: undefined
  }
})

const { getDefinition } = useGlossary()

const definition = computed(() => {
  if (!props.href) return null
  // Check if href is a slug in glossary
  // href might be "ralentisseurs" or "/glossaire/ralentisseurs"
  const slug = props.href.split("/").pop()
  return slug ? getDefinition(slug) : null
})

const finalHref = computed(() => {
  if (!props.href) return ""
  // If it's a relative link (no / at start), assume it's a glossary term
  if (!props.href.startsWith("/") && !props.href.startsWith("http")) {
    return `/glossaire/${props.href}`
  }
  return props.href
})
</script>

<template>
  <UTooltip v-if="definition" :text="definition ?? undefined" :delay-duration="0"
    :content="{ align: 'center', side: 'top', sideOffset: 4 }">
    <NuxtLink :to="finalHref"
      class="text-primary underline decoration-dashed underline-offset-4 hover:text-primary-600 transition-colors cursor-pointer">
      <slot />
    </NuxtLink>
  </UTooltip>
  <NuxtLink v-else :to="finalHref" :target="target" class="text-primary hover:underline font-medium">
    <slot />
  </NuxtLink>
</template>
