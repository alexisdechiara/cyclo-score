<script setup lang="ts">
import { UButton, UInput, UCard, UAccordion, UTabs, USelect } from '#components'
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { VueFlow, useVueFlow, type Node as FlowNode, type Edge as FlowEdge, Position, MarkerType } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import dagre from 'dagre'
import type { Score } from '~/types/questions'
import { getBestPossibleScore } from '~/utils/questions'
import ScoreBadge from '~/components/ScoreBadge.vue'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/node-resizer/dist/style.css'

const { questions, startId } = useQuestions()
const { fitView, setCenter, findNode } = useVueFlow()

useSeoMeta({
  title: "Logigramme",
  description: "Visualisez l'ensemble des chemins et décisions du référentiel Cyclo-Score sous forme de logigramme interactif.",
  ogTitle: "Logigramme",
  ogDescription: "Visualisez l'ensemble des chemins et décisions du référentiel Cyclo-Score.",
})

defineOgImageComponent('Docs')

// Tailles des nœuds
const NODE_MIN_WIDTH = 200
const NODE_MIN_HEIGHT = 100

const nodes = ref<FlowNode[]>([])
const edges = ref<FlowEdge[]>([])

// Controls state
const showPositive = ref(true)
const showNegative = ref(true)
const layoutDirection = ref<'TB' | 'LR'>('TB')
const nodesep = 40  // Réduit l'espacement horizontal entre les nodes
const ranksep = 60  // Réduit l'espacement vertical entre les nodes

// Edge options
const defaultEdgeOptions = {
  type: 'smoothstep',
  style: {
    strokeWidth: 1.5,
    cursor: 'move'
  },
  labelBgStyle: { fill: 'var(--ui-bg)' },
  markerEnd: { type: MarkerType.Arrow },
  interactionWidth: 20,
  selectable: true,
  updatable: true
}

const SCORE_IDS: Score[] = ['A', 'B', 'C', 'D', 'E']
const selectedScores = ref<Score[]>([...SCORE_IDS])
const availableScores = SCORE_IDS
const linkColorMode = ref<'standard' | 'score'>('score')

// Search overlay state
const searchBarVisible = ref(false)
const searchQuery = ref('')
const searchMatches = ref<FlowNode[]>([])
const activeSearchIndex = ref(0)
const highlightedNodeId = ref<string | null>(null)
const searchInputRef = ref<{ $el?: { querySelector: (selector: string) => HTMLInputElement | null } } | null>(null)



// Helper to get color based on score
const getScoreColor = (score: Score | 'E' | string | null) => {
  switch (score) {
    case 'A': return '#10b981' // Green
    case 'B': return '#84cc16' // Lime
    case 'C': return '#eab308' // Yellow
    case 'D': return '#f97316' // Orange
    case 'E': return '#ef4444' // Red
    default: return '#9ca3af' // Gray
  }
}

// Build graph data
const buildGraph = () => {
  const tempNodes: FlowNode[] = []
  const tempEdges: FlowEdge[] = []
  const addedNodes = new Set<string>()

  // Add question nodes
  for (const [id, question] of Object.entries(questions.value)) {
    if (!addedNodes.has(id)) {
      tempNodes.push({
        id,
        type: 'question', // Custom type for questions
        data: {
          question: question, // Pass the full question object
          label: question.description,
          fullText: question.description,
          isStart: id === startId.value // Identify start node
        },
        position: { x: 0, y: 0 },
        targetPosition: layoutDirection.value === 'TB' ? Position.Top : Position.Left,
        sourcePosition: layoutDirection.value === 'TB' ? Position.Bottom : Position.Right,
      })
      addedNodes.add(id)
    }

    // Process Yes branch
    const yesTarget = question.yes
    const noTarget = question.no


    if (!addedNodes.has(yesTarget)) {
      if (SCORE_IDS.includes(yesTarget as Score)) {
        tempNodes.push({
          id: yesTarget,
          type: 'score', // Custom type
          data: { score: yesTarget },
          position: { x: 0, y: 0 },
          targetPosition: layoutDirection.value === 'TB' ? Position.Top : Position.Left,
          sourcePosition: layoutDirection.value === 'TB' ? Position.Bottom : Position.Right,
        })
        addedNodes.add(yesTarget)
      }
    }

    const computeColor = (target: string | Score) => {
      const mode = typeof linkColorMode.value === 'string'
        ? linkColorMode.value
        : (linkColorMode.value as any)?.value ?? 'standard'

      if (mode === 'score') {
        return getScoreColor(getBestPossibleScore(target, questions.value))
      }
      return null // null → mode standard (fixed colors)
    }

    const yesColor = computeColor(yesTarget) ?? '#10b981'
    const noColor = computeColor(noTarget) ?? '#ef4444'

    tempEdges.push({
      id: `${id}-yes`,
      source: id,
      target: yesTarget,
      label: 'Oui',
      type: 'smoothstep',
      interactionWidth: 40,
      style: { stroke: yesColor, strokeWidth: 2, strokeLinecap: 'round' },
      labelStyle: { fill: yesColor, fontWeight: 700 },
      animated: false,
      data: { type: 'yes' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: yesColor,
        width: 24,
        height: 24,
      },
    })

    // Process No branch
    if (!addedNodes.has(noTarget)) {
      if (SCORE_IDS.includes(noTarget as Score)) {
        tempNodes.push({
          id: noTarget,
          type: 'score',
          data: { score: noTarget },
          position: { x: 0, y: 0 },
          targetPosition: layoutDirection.value === 'TB' ? Position.Top : Position.Left,
          sourcePosition: layoutDirection.value === 'TB' ? Position.Bottom : Position.Right,
        })
        addedNodes.add(noTarget)
      }
    }

    tempEdges.push({
      id: `${id}-no`,
      source: id,
      target: noTarget,
      label: 'Non',
      type: 'smoothstep',
      interactionWidth: 40,
      style: { stroke: noColor, strokeWidth: 2, strokeLinecap: 'round' },
      labelStyle: { fill: noColor, fontWeight: 700 },
      animated: false,
      data: { type: 'no' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: noColor,
        width: 24,
        height: 24,
      },
    })
  }

  return { nodes: tempNodes, edges: tempEdges }
}

type RebuildOptions = {
  preservePositions?: boolean
  relayout?: boolean
}

const rebuildGraph = (options: RebuildOptions = {}) => {
  const { preservePositions = true, relayout = false } = options
  const { nodes: newNodes, edges: newEdges } = buildGraph()

  const positionMap = preservePositions
    ? new Map(nodes.value.map(node => [node.id, node.position]))
    : new Map<string, FlowNode['position']>()

  nodes.value = newNodes.map(node => ({
    ...node,
    position: positionMap.get(node.id) || node.position
  }) as FlowNode)

  edges.value = newEdges as FlowEdge[]

  nextTick(() => {
    if (relayout) {
      layoutGraph()
    }
    applyFilters()
  })
}

// Layout graph using dagre
const layoutGraph = () => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setGraph({
    rankdir: layoutDirection.value,
    nodesep: nodesep,
    ranksep: ranksep,
  })

  nodes.value.forEach((node) => {
    // Adjust dimensions based on node type
    const width = node.type === 'score' ? 300 : 250
    const height = node.type === 'score' ? 150 : 120
    dagreGraph.setNode(node.id, { width, height })
  })

  edges.value.forEach((edge) => {
    if (dagreGraph.hasNode(edge.source) && dagreGraph.hasNode(edge.target)) {
      dagreGraph.setEdge(edge.source, edge.target, {})
    }
  })

  dagre.layout(dagreGraph)

  nodes.value = nodes.value.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      targetPosition: layoutDirection.value === 'TB' ? Position.Top : Position.Left,
      sourcePosition: layoutDirection.value === 'TB' ? Position.Bottom : Position.Right,
      position: {
        x: nodeWithPosition.x - (node.type === 'score' ? 300 : 250) / 2,
        y: nodeWithPosition.y - (node.type === 'score' ? 150 : 120) / 2,
      },
    }
  })
}

// Filter Logic
const applyFilters = () => {
  // 1. Filter by Score (Backwards traversal)
  const visibleNodeIds = new Set<string>()

  if (selectedScores.value.length === SCORE_IDS.length) {
    // If all scores selected, show everything (optimization)
    nodes.value.forEach(n => visibleNodeIds.add(n.id))
  } else {
    // Build parent map for traversal
    const parents: Record<string, string[]> = {}
    edges.value.forEach(edge => {
      if (!parents[edge.target]) parents[edge.target] = []
      parents[edge.target]!.push(edge.source)
    })

    // Start BFS from selected scores
    const queue: string[] = [...selectedScores.value]
    const visited = new Set<string>(queue)

    while (queue.length > 0) {
      const curr = queue.shift()!
      visibleNodeIds.add(curr)

      const pList = parents[curr] || []
      for (const p of pList) {
        if (!visited.has(p)) {
          visited.add(p)
          queue.push(p)
        }
      }
    }
  }

  // 2. Apply visibility to Nodes
  nodes.value.forEach(node => {
    node.hidden = !visibleNodeIds.has(node.id)
  })

  // 3. Apply visibility to Edges (based on nodes AND type toggles)
  edges.value.forEach(edge => {
    const nodesVisible = visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    const typeVisible = (edge.data?.type === 'yes' && showPositive.value) ||
      (edge.data?.type === 'no' && showNegative.value)

    edge.hidden = !(nodesVisible && typeVisible)
  })
}

const resetParams = () => {
  showPositive.value = true
  showNegative.value = true
  layoutDirection.value = 'TB'
  selectedScores.value = [...SCORE_IDS]
  linkColorMode.value = 'score'
  setTimeout(() => fitView(), 100)
}

const focusSearchInput = () => {
  const input = searchInputRef.value?.$el?.querySelector('input') as HTMLInputElement | null
  input?.focus()
  input?.select()
}

const openSearchBar = () => {
  searchBarVisible.value = true
  nextTick(() => focusSearchInput())
}

const closeSearchBar = () => {
  searchBarVisible.value = false
  searchQuery.value = ''
  searchMatches.value = []
  highlightedNodeId.value = null
}

const focusNode = (nodeId: string) => {
  const targetNode = findNode?.(nodeId) ?? nodes.value.find((node) => node.id === nodeId)
  if (!targetNode) return

  highlightedNodeId.value = nodeId

  const width = targetNode.type === 'score' ? 300 : 250
  const height = targetNode.type === 'score' ? 150 : 120
  const centerX = targetNode.position.x + width / 2
  const centerY = targetNode.position.y + height / 2

  setCenter?.(centerX, centerY, { duration: 400, zoom: 1 })
}

const focusCurrentMatch = () => {
  const current = searchMatches.value[activeSearchIndex.value]
  if (current) {
    focusNode(current.id)
  }
}

const updateSearchMatches = (preserveIndex = false) => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    searchMatches.value = []
    highlightedNodeId.value = null
    return
  }

  const matches = nodes.value.filter(node => {
    const label = (node.data?.fullText || node.data?.label || node.id).toString().toLowerCase()
    const scoreLabel = (node.data?.score || '').toString().toLowerCase()
    return label.includes(query) || scoreLabel.includes(query) || node.id.toLowerCase().includes(query)
  })

  searchMatches.value = matches

  if (!matches.length) {
    highlightedNodeId.value = null
    return
  }

  if (!preserveIndex || activeSearchIndex.value >= matches.length) {
    activeSearchIndex.value = 0
  }

  focusCurrentMatch()
}

const goToNextMatch = () => {
  if (!searchMatches.value.length) return
  activeSearchIndex.value = (activeSearchIndex.value + 1) % searchMatches.value.length
  focusCurrentMatch()
}

const goToPreviousMatch = () => {
  if (!searchMatches.value.length) return
  activeSearchIndex.value = (activeSearchIndex.value - 1 + searchMatches.value.length) % searchMatches.value.length
  focusCurrentMatch()
}

const handleSearchEnter = (event: KeyboardEvent) => {
  event.preventDefault()
  if (event.shiftKey) {
    goToPreviousMatch()
  } else {
    goToNextMatch()
  }
}

const handleGlobalKeyDown = (e: KeyboardEvent) => {
  // Ctrl+F pour ouvrir/activer la recherche
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault()
    searchBarVisible.value = true
    nextTick(() => focusSearchInput())
  }

  // Échap ou Ctrl+Z pour fermer la recherche
  if ((e.key === 'Escape' || ((e.ctrlKey || e.metaKey) && e.key === 'z')) && searchBarVisible.value) {
    e.preventDefault()
    closeSearchBar()
  }
}

// Watchers
watch(questions, () => {
  rebuildGraph({ preservePositions: false, relayout: true })
})

watch([showPositive, showNegative, selectedScores], applyFilters)

watch(layoutDirection, () => {
  rebuildGraph({ preservePositions: false, relayout: true })
  setTimeout(() => fitView(), 50)
})

watch(linkColorMode, () => {
  rebuildGraph({ preservePositions: true, relayout: false })
})

watch(searchQuery, () => updateSearchMatches())

// ...
watch(nodes, () => {
  if (searchBarVisible.value && searchQuery.value.trim()) {
    updateSearchMatches(true)
  }
})

onMounted(() => {
  rebuildGraph({ preservePositions: false, relayout: true })

  setTimeout(() => {
    fitView()
  }, 100)

  window.addEventListener('keydown', handleGlobalKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown)
})
</script>

<template>
  <div class="relative w-full h-(--ui-main-height)">
    <transition name="fade">
      <UCard v-if="searchBarVisible" class="absolute top-3 left-4 z-60 w-fit" :ui="{
        root: 'shadow-lg ring-1 ring-gray-200 dark:ring-gray-700',
        body: 'dark:bg-gray-800/90 backdrop-blur-sm p-2 sm:p-2'
      }">
        <div class="flex items-center gap-2">
          <UInput ref="searchInputRef" v-model="searchQuery" type="text" placeholder="Rechercher un nœud..." size="sm"
            autofocus @keydown.enter="handleSearchEnter">
            <template #trailing>
              <span v-if="searchQuery" class="text-xs text-gray-500 dark:text-gray-400 mr-1">
                {{ searchMatches.length ? `${activeSearchIndex + 1}/${searchMatches.length}` : '0/0' }}
              </span>
            </template>
          </UInput>

          <div class="flex items-center space-x-0.5 ml-1">
            <UButton icon="i-heroicons-chevron-up-20-solid" color="neutral" variant="ghost" size="xs"
              :disabled="!searchMatches.length" @click="goToPreviousMatch" />
            <UButton icon="i-heroicons-chevron-down-20-solid" color="neutral" variant="ghost" size="xs"
              :disabled="!searchMatches.length" @click="goToNextMatch" />
            <UButton icon="i-heroicons-x-mark-20-solid" color="neutral" variant="ghost" size="xs"
              @click="closeSearchBar" />
          </div>
        </div>
      </UCard>
    </transition>
    <UCard
      :ui="{ body: 'p-2 sm:p-4', root: 'absolute top-0 right-0 md:top-4 md:right-4 z-50 md:max-w-72 w-full rounded-none md:rounded-lg' }">
      <UAccordion :items="[{ label: '' }]" :ui="{ trigger: 'py-0 cursor-pointer' }">
        <template #leading>
          <span class="font-semibold text-highlighted">Paramètres</span>
        </template>
        <template #content>
          <div class="flex flex-col gap-4 mt-3.5">
            <!-- Layout Direction -->
            <div class="flex flex-col gap-2">
              <span class="text-sm font-medium">Direction du graphique</span>
              <UTabs :content="false" :items="[
                { label: 'Vertical', icon: 'lucide:move-vertical', value: 'TB' },
                { label: 'Horizontal', icon: 'lucide:move-horizontal', value: 'LR' }
              ]" class="w-full" v-model="layoutDirection">
              </UTabs>
            </div>

            <!-- Link Color Mode -->
            <div class="flex flex-col gap-2">
              <span class="text-sm font-medium">Couleur des liens</span>
              <USelect v-model="linkColorMode" :items="[
                { label: 'Oui (Vert) / Non (Rouge)', value: 'standard' },
                { label: 'Meilleur score possible', value: 'score' }
              ]" option-attribute="label" value-attribute="value" />
            </div>

            <!-- Score Filter -->
            <div class="flex flex-col gap-2">
              <span class="text-sm font-medium">Filtrer par Score final</span>
              <USelect v-model="selectedScores" :items="availableScores" multiple
                placeholder="Sélectionner les scores..." />
            </div>

            <!-- Reset Button -->
            <div class="flex flex-col gap-2">
              <UButton color="neutral" variant="link" size="xs" class="ms-auto mt-4 cursor-pointer"
                @click="resetParams">
                Réinitialiser
              </UButton>
            </div>
          </div>
        </template>
      </UAccordion>

    </UCard>
    <VueFlow v-model:nodes="nodes" v-model:edges="edges" :default-viewport="{ zoom: 0.8 }" :min-zoom="0.1" :max-zoom="4"
      fit-view-on-init :nodes-draggable="true" :nodes-connectable="false" :elements-selectable="true" edges-draggable
      edges-updatable selection-on-drag zoom-on-scroll :pan-on-drag="[2]" :pan-on-scroll-speed="1"
      :default-edge-options="defaultEdgeOptions">
      <Background :gap="20" />
      <Controls />

      <!-- Custom Question Node -->
      <template #node-question="props">
        <div class="relative">
          <NodeResizer :is-visible="props.selected" :min-width="NODE_MIN_WIDTH" :min-height="NODE_MIN_HEIGHT"
            handle-class-name="bg-primary! border-primary!"
            line-class-name="border-primary! border! rounded! border-1.5!" />
          <div class="question-node"
            :class="{ 'is-start': props.data.isStart, 'ring-2! ring-primary': props.id === highlightedNodeId, 'w-[260px] h-[140px]': !props.dimensions?.width && !props.dimensions?.height }"
            :style="{
              width: props.dimensions?.width ? `${props.dimensions.width}px` : NODE_MIN_WIDTH,
              height: props.dimensions?.height ? `${props.dimensions.height}px` : NODE_MIN_HEIGHT,
              minWidth: `${NODE_MIN_WIDTH}px`,
              minHeight: `${NODE_MIN_HEIGHT}px`
            }">
            <FlowchartLabel :question="props.data.question" />
          </div>
        </div>
      </template>

      <!-- Custom Score Node -->
      <template #node-score="props">
        <ScoreBadge :score="props.data.score" variant="flowchart" />
      </template>

    </VueFlow>
  </div>
</template>

<style>
.question-node {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  text-align: center;
  transition: all 0.2s ease;
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: calc(var(--ui-radius) * 3);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  color: var(--ui-text);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.vue-flow__controls .vue-flow__controls-button {
  background: var(--ui-bg);
  border-bottom: 0;
  color: var(--ui-text);
}

.vue-flow__controls .vue-flow__controls-button:hover {
  background: var(--ui-bg-elevated);
}

.vue-flow__controls .vue-flow__controls-button svg {
  fill: currentColor;
}
</style>
