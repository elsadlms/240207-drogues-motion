<script>
  import { onMount } from 'svelte'
  import { clamp, interpolate } from '~/utils'

  export let progression

  let moduleConfig = {
    backgroundImage:
      'https://assets-decodeurs.lemonde.fr/redacweb/240207-drogues-motion-map/map-background.png',
    urlTemplate:
      'https://assets-decodeurs.lemonde.fr/redacweb/240207-drogues-motion-map/map[index].png',
    indexPadding: 5,
    imageStart: 1000,
    imageStop: 1146,
  }

  if (typeof window.LM_PAGE !== 'undefined') {
    moduleConfig = window.LM_PAGE.tree?.value?.MODULES.motion
  }

  let isLoading = true

  let images = []
  let loadedImages = 0

  onMount(() => {
    for (let i = moduleConfig.imageStart; i < moduleConfig.imageStop; i++) {
      const formattedNumber = i.toString().padStart(moduleConfig.indexPadding, '0')
      const url = moduleConfig.urlTemplate.replace('[index]', formattedNumber)
      images = [...images, url]
    }
  })

  const onImageLoad = () => {
    loadedImages++
    if (loadedImages === images.length) {
      isLoading = false
    }
  }

  $: containerClasses = [
    'container',
    isLoading === true ? 'container--loading' : '',
  ]

  $: clampedProgression = clamp(progression, 0, 1)
  $: progressionIndex = Math.round(
    interpolate(clampedProgression, 0, images.length - 1)
  )
</script>

<div class={containerClasses.join(' ')}>
  <div class="spinner"></div>

  <img src={moduleConfig.backgroundImage} class="background-image" alt="" />

  {#each images as frame, i}
    {@const classList = [
      'frame',
      i === progressionIndex ? 'frame--active' : '',
    ]}

    <img src={frame} class={classList.join(' ')} alt="" on:load={onImageLoad} />
  {/each}
</div>

<style lang="scss">
  .container {
    background-color: #000;
    display: grid;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    > * {
      grid-area: 1/-1;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .frame {
    z-index: 1;
    opacity: 0;

    &.frame--active {
      z-index: 2;
      opacity: 1;
    }
  }

  .background-image {
    z-index: 1;
    transition: opacity 600ms;
  }

  .spinner {
    align-self: center;
    justify-self: center;
    border: 4px solid rgba(248, 248, 248, 0.5);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border-left-color: rgb(248, 248, 248, 0.8);
    animation: spin 1s ease infinite;
    opacity: 0;
    z-index: 0;
    transition: opacity 600ms;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .container.container--loading {
    .spinner {
      opacity: 1;
    }

    .background-image,
    .frame {
      opacity: 0;
    }
  }
</style>
